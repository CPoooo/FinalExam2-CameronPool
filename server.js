const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Add this line

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static('public')); // Add this line

// Mock shape data
let shapes = [];

// home page
app.get('/', (req, res) => {
    // Send the index.html file when users access the root URL
    res.sendFile(path.join(__dirname,'index.html'));
});

// Route to display shape information as a table
app.get('/shapes', (req, res) => {
    res.json(shapes);
});

// Route to add a new shape
app.post('/shapes', (req, res) => {
    const newShape = req.body;
    shapes.push(newShape);
    res.status(201).send('Shape added successfully.');
});

// Route to update an existing shape
app.put('/shapes/:id', (req, res) => {
    const id = req.params.id;
    const updatedShape = req.body;
    const index = shapes.findIndex(shape => shape.id === id);
    if (index !== -1) {
        shapes[index] = updatedShape;
        res.send('Shape updated successfully.');
    } else {
        res.status(404).send('Shape not found.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
