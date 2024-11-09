const axios = require('axios');
const crypto = require('crypto');

const BASE_URL = "https://openapi.tuyaus.com";
const LOGIN_URL = "/v1.0/token?grant_type=1";
const ATTRIBUTES_URL = "/v2.0/cloud/thing/{device_id}/shadow/properties";

const client_id = "nguhmjjpxy75ke7qr5fa"; // Thay thế bằng client_id thực tế
const client_secret = "e8bf644b0f8e40108004fcf14fbc202a"; // Thay thế bằng client_secret thực tế

async function makeRequest(url, headers) {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error("Error making request:", error.response ? error.response.data : error.message);
        throw error;
    }
}

function getTimestamp() {
    return Math.floor(Date.now()).toString();
}

function getSign(payload, key) {
    return crypto.createHmac('sha256', key).update(payload).digest('hex').toUpperCase();
}

async function getAccessToken() {
    const timestamp = getTimestamp();
    const stringToSign = `${client_id}${timestamp}GET\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\n${LOGIN_URL}`;
    const sign = getSign(stringToSign, client_secret);
    
    const headers = {
        "client_id": client_id,
        "sign": sign,
        "t": timestamp,
        "mode": "cors",
        "sign_method": "HMAC-SHA256",
        "Content-Type": "application/json"
    };

    const response = await makeRequest(`${BASE_URL}${LOGIN_URL}`, headers);
    return response.result.access_token;
}

async function getDeviceProperties(access_token, device_id) {
    const url = ATTRIBUTES_URL.replace("{device_id}", device_id);
    const timestamp = getTimestamp();
    const stringToSign = `${client_id}${access_token}${timestamp}GET\ne3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855\n\n${url}`;
    const sign = getSign(stringToSign, client_secret);
    
    const headers = {
        "client_id": client_id,
        "sign": sign,
        "access_token": access_token,
        "t": timestamp,
        "mode": "cors",
        "sign_method": "HMAC-SHA256",
        "Content-Type": "application/json"
    };

    const response = await makeRequest(`${BASE_URL}${url}`, headers);
    return response.result.properties.reduce((acc, prop) => {
        acc[prop.code] = prop.value;
        return acc;
    }, {});
}

(async () => {
    if (process.argv.length !== 3) {
        console.error("Usage: node tuya.js device_id");
        process.exit(1);
    }
    
    const device_id = process.argv[2];
    
    try {
        const access_token = await getAccessToken();
        const attributes = await getDeviceProperties(access_token, device_id);
        console.log(JSON.stringify(attributes));
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
