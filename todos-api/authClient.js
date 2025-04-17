'use strict';

const CircuitBreaker = require('circuit-breaker-js');
const axios = require('axios');

class AuthClient {
    constructor(authServiceUrl) {
        this.authServiceUrl = authServiceUrl;
        
        // Configuración del Circuit Breaker
        this.circuitBreaker = new CircuitBreaker({
            windowDuration: 10000, // 10 segundos
            numBuckets: 10,
            timeoutDuration: 5000, // 5 segundos
            errorThreshold: 50, // 50% de errores
            volumeThreshold: 10, // mínimo 10 peticiones
            onCircuitOpen: () => {
                console.log('Circuit Breaker abierto - Auth API no disponible');
            },
            onCircuitClose: () => {
                console.log('Circuit Breaker cerrado - Auth API disponible nuevamente');
            }
        });
    }

    async validateToken(token) {
        return this.circuitBreaker.run(() => {
            return axios.get(`${this.authServiceUrl}/validate`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.data)
            .catch(error => {
                console.error('Error al validar token:', error.message);
                throw error;
            });
        });
    }
}

module.exports = AuthClient; 