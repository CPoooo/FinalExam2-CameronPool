import express from "express";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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

async function updateConeInDB(coneID, updatedConeData) {
    const updateCommand = new UpdateCommand({
        TableName: "cameronpool_cones",
        Key: {
            "coneID": coneID
        },
        UpdateExpression: "SET radius = :radius, height = :height, slantHeight = :slantHeight",
        ExpressionAttributeValues: {
            ":radius": updatedConeData.radius,
            ":height": updatedConeData.height,
            ":slantHeight": updatedConeData.slantHeight
        }
    });

    try {
        await docClient.send(updateCommand);
        console.log("Cone updated in DynamoDB with ID:", coneID);
    } catch (err) {
        console.error("Error updating cone in DynamoDB:", err);
        throw err;
    }
}

const app = express();

app.use(express.static(join(__dirname, 'public')));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

app.post("/addCone", async (req, res) => {
    const coneData = req.body;
    console.log("Received coneData:", coneData); // checking cone data

    try {
        const coneID = await addConeToDB(coneData);
        res.status(201).json({ message: "Cone added to DynamoDB", coneID });
    } catch (error) {
        res.status(500).json({ message: "Failed to add cone to DynamoDB" });
    }
});

app.put("/updateCone/:coneID", async (req, res) => {
    const coneID = req.params.coneID;
    const updatedConeData = req.body;

    try {
        await updateConeInDB(coneID, updatedConeData);
        res.status(200).json({ message: "Cone updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update cone" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
