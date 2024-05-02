import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const app = express();

// Add middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(join(__dirname, 'public')));

// Handle GET requests to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Handle POST requests to add cone data to DynamoDB
app.post("/addCone", async (req, res) => {
    const coneData = req.body;
    console.log("Received coneData:", coneData); // checking cone data

    try {
        const coneID = await addConeToDB(coneData);
        res.status(201).json({ message: "Cone added to DynamoDB", coneID });
    } catch (error) {
        console.error("Error adding cone to DynamoDB:", error);
        res.status(500).json({ message: "Failed to add cone to DynamoDB" });
    }
});

// Function to add cone data to DynamoDB
async function addConeToDB(coneData) {
    const coneID = uuidv4();

    const putCommand = new PutCommand({
        TableName: "cameronpool_cones",
        Item: {
            "coneID": coneID,
            "radius": coneData.radius,
            "height": coneData.height,
            "slantHeight": coneData.slantHeight
        }
    });

    try {
        await docClient.send(putCommand);
        console.log("Cone added to DynamoDB with ID:", coneID);
        return coneID;
    } catch (err) {
        console.error("Error adding cone to DynamoDB:", err);
        throw err;
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
