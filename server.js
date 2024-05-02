const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const AWS = require('aws-sdk'); 

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the correct MIME type for CSS files
app.use((req, res, next) => {
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }
  next();
});

// home page
app.get('/', (req, res) => {
    // Send the index.html file when users access the root URL
    res.sendFile(path.join(__dirname, 'index.html'));
});


// my AWS credentials
AWS.config.update({
    region: 'us-east-2', // AWS region
    accessKeyId: 'AKIATFBNJRUQNNLNL36H', // AWS access key ID
    secretAccessKey: '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' // AWS secret access key
});

// DynamoDB service object
const dynamodb = new AWS.DynamoDB();

// Define table schema for cones
const params = {
    TableName: 'cameronpool_cones',
    KeySchema: [
        { AttributeName: 'coneID', KeyType: 'HASH' } // Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: 'coneID', AttributeType: 'S' } // 'coneID' attribute type string
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

// Create the DynamoDB table for cones
dynamodb.createTable(params, (err, data) => {
    if (err) {
        console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
    } else {
        console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
    }
});

// Route to add a new cone shape to DynamoDB
app.post('/cones', (req, res) => {
    const newCone = req.body;

    // Create params for DynamoDB put operation
    const params = {
        TableName: 'cameronpool_cones', // Update table name
        Item: {
            'coneID': { S: newCone.coneID }, // Assuming 'coneID' is a string
            'radius': { N: newCone.radius.toString() },
            'height': { N: newCone.height.toString() },
            'slantHeight': { N: newCone.slantHeight.toString() }
        }
    };

    // Put item into DynamoDB table
    dynamodb.putItem(params, (err, data) => {
        if (err) {
            console.error('Unable to add cone shape to DynamoDB. Error:', err);
            res.status(500).send('Unable to add cone shape.');
        } else {
            console.log('Successfully added cone shape to DynamoDB:', data);
            res.status(201).send('Cone shape added successfully.');
        }
    });
});

// Route to update an existing cone shape in DynamoDB
app.put('/cones/:id', (req, res) => {
    const id = req.params.id;
    const updatedCone = req.body;

    // Create params for DynamoDB update operation
    const params = {
        TableName: 'cameronpool_cones', // Update table name
        Key: {
            'coneID': { S: id } // Assuming 'coneID' is a string
        },
        UpdateExpression: 'SET radius = :r, height = :h, slantHeight = :s',
        ExpressionAttributeValues: {
            ':r': { N: updatedCone.radius.toString() },
            ':h': { N: updatedCone.height.toString() },
            ':s': { N: updatedCone.slantHeight.toString() }
        },
        ReturnValues: 'UPDATED_NEW'
    };

    // Update item in DynamoDB table
    dynamodb.updateItem(params, (err, data) => {
        if (err) {
            console.error('Unable to update cone shape in DynamoDB. Error:', err);
            res.status(500).send('Unable to update cone shape.');
        } else {
            console.log('Successfully updated cone shape in DynamoDB:', data);
            res.send('Cone shape updated successfully.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
