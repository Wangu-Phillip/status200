import express from 'express';
const app = express();
app.get('/', (req, res) => res.send('OK'));
console.log('Starting test server...');
app.listen(3002, () => console.log('Listening on 3002'));
