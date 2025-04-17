'use strict';
const cache = require('memory-cache');
const {Annotation, 
    jsonEncoder: {JSON_V2}} = require('zipkin');
const axiosRetry = require('axios-retry');
const axios = require('axios');

const OPERATION_CREATE = 'CREATE',
      OPERATION_DELETE = 'DELETE';

// Configuración del retry
const RETRY_CONFIG = {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 1000; // Delay incremental: 1s, 2s, 3s
    },
    retryCondition: (error) => {
        // Reintentar en caso de errores de conexión o timeout
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
               error.code === 'ECONNREFUSED' ||
               error.code === 'ETIMEDOUT';
    }
};

class TodoController {
    constructor({tracer, redisClient, logChannel}) {
        this._tracer = tracer;
        this._redisClient = redisClient;
        this._logChannel = logChannel;
        
        // Configurar axios con retry
        axiosRetry(axios, RETRY_CONFIG);
    }

    // TODO: these methods are not concurrent-safe
    list (req, res) {
        const data = this._getTodoData(req.user.username)

        res.json(data.items)
    }

    create (req, res) {
        // TODO: must be transactional and protected for concurrent access, but
        // the purpose of the whole example app it's enough
        const data = this._getTodoData(req.user.username)
        const todo = {
            content: req.body.content,
            id: data.lastInsertedID
        }
        data.items[data.lastInsertedID] = todo

        data.lastInsertedID++
        this._setTodoData(req.user.username, data)

        this._logOperation(OPERATION_CREATE, req.user.username, todo.id)

        res.json(todo)
    }

    delete (req, res) {
        const data = this._getTodoData(req.user.username)
        const id = req.params.taskId
        delete data.items[id]
        this._setTodoData(req.user.username, data)

        this._logOperation(OPERATION_DELETE, req.user.username, id)

        res.status(204)
        res.send()
    }

    _logOperation (opName, username, todoId) {
        this._tracer.scoped(() => {
            const traceId = this._tracer.id;
            const message = JSON.stringify({
                zipkinSpan: traceId,
                opName: opName,
                username: username,
                todoId: todoId,
            });

            // Implementación del patrón Retry
            const publishWithRetry = async () => {
                try {
                    await this._redisClient.publish(this._logChannel, message);
                } catch (error) {
                    console.error(`Error al publicar en Redis: ${error.message}`);
                    throw error;
                }
            };

            // Ejecutar con retry
            publishWithRetry().catch(error => {
                console.error(`Fallo después de ${RETRY_CONFIG.retries} intentos: ${error.message}`);
            });
        });
    }

    _getTodoData (userID) {
        var data = cache.get(userID)
        if (data == null) {
            data = {
                items: {
                    '1': {
                        id: 1,
                        content: "Create new todo",
                    },
                    '2': {
                        id: 2,
                        content: "Update me",
                    },
                    '3': {
                        id: 3,
                        content: "Delete example ones",
                    }
                },
                lastInsertedID: 3
            }

            this._setTodoData(userID, data)
        }
        return data
    }

    _setTodoData (userID, data) {
        cache.put(userID, data)
    }
}

module.exports = TodoController