const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const calculatePoints = require('./calculatePoints');

const app = express();
app.use(bodyParser.json());

let receipts = {};

app.post('/receipts/process', (req, res) => {
    const receipt = req.body;
    const id = uuidv4();
    const points = calculatePoints(receipt);
    receipts[id] = points;
    res.json({ id });
});

app.get('/receipts/:id/points', (req, res) => {
    const { id } = req.params;
    const points = receipts[id];
    if (points === undefined) {
        res.status(404).json({ error: 'Receipt not found' });
    } else {
        res.json({ points });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
