'use strict';

const axios = require('axios');
const CircuitBreaker = require('opossum');

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth-api:8081';

const circuitBreaker = new CircuitBreaker(async (token) => {
    const response = await axios.get(`${authServiceUrl}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}, {
    timeout: 3000,
    errorThresholdPercentage: 50,
    resetTimeout: 30000
});

async function validateToken(token) {
    try {
        return await circuitBreaker.fire(token);
    } catch (error) {
        console.error('Error validating token:', error.message);
        throw error;
    }
}

module.exports = {
    validateToken
}; 