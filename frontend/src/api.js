import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const generateKeys = (p, q) =>
  api.post('/generate-keys', { p, q }).then(r => r.data);

export const selectE = (p, q, e) =>
  api.post('/select-e', { p, q, e }).then(r => r.data);

export const encrypt = (message, e, n) =>
  api.post('/encrypt', { message, e, n }).then(r => r.data);

export const decrypt = (cipher, d, n) =>
  api.post('/decrypt', { cipher, d, n }).then(r => r.data);
