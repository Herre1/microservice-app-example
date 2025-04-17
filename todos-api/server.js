'use strict';
const express = require('express')
const bodyParser = require("body-parser")
const jwt = require('express-jwt')

const ZIPKIN_URL = process.env.ZIPKIN_URL || 'http://127.0.0.1:9411/api/v2/spans';
const {Tracer, 
  BatchRecorder,
  jsonEncoder: {JSON_V2}} = require('zipkin');
const CLSContext = require('zipkin-context-cls');  
const {HttpLogger} = require('zipkin-transport-http');
const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
const AuthClient = require('./authClient');

const logChannel = process.env.REDIS_CHANNEL || 'log_channel';
const redisClient = require("redis").createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
          return new Error('The server refused the connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
          return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
          console.log('reattemtping to connect to redis, attempt #' + options.attempt)
          return undefined;
      }
      return Math.min(options.attempt * 100, 2000);
  }        
});

const port = process.env.TODO_API_PORT || 8082
const jwtSecret = process.env.JWT_SECRET || "foo"
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8081'

const app = express()

// tracing
const ctxImpl = new CLSContext('zipkin');
const recorder = new  BatchRecorder({
  logger: new HttpLogger({
    endpoint: ZIPKIN_URL,
    jsonEncoder: JSON_V2
  })
});
const localServiceName = 'todos-api';
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

// Crear instancia de AuthClient con Circuit Breaker
const authClient = new AuthClient(authServiceUrl);

// Middleware personalizado para validar token con Circuit Breaker
const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    await authClient.validateToken(token);
    next();
  } catch (error) {
    console.error('Error al validar token:', error.message);
    res.status(401).json({ message: 'Token inválido o servicio de autenticación no disponible' });
  }
};

app.use(validateToken);
app.use(zipkinMiddleware({tracer}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const routes = require('./routes')
routes(app, {tracer, redisClient, logChannel})

app.listen(port, function () {
  console.log('todo list RESTful API server started on: ' + port)
})
