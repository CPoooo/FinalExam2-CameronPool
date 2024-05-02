# FinalExam2-CameronPool
Final Exam 2 in Systems Analysis

## HOW TO RUN
1. Clone the repository to your local machine:
   **git clone**
   
3. Navigate to the project directory in terminal:

4. Install dependencies using npm:
   **npm i**

## Usage

After installing the dependencies, you can run the application using Node.js. There are two main scripts provided:

### 1. Run with Node.js

To start the server using Node.js, run the following command:
node server.js

This will start the server, and you can access the application by navigating to `http://localhost:3000` in your web browser.

This command will also start the server, using `node server.js` under the hood.

## Usage Instructions

Once the server is running, you can interact with the application by opening it in your web browser. Here are the main features:

- **Add Cone**: Enter in the desired dimensions of your cone and then click **Add Cone** to add the cone to DynamoDB.
- **Update Cone**: Enter the coneID from DyanmoDB that corresponds with the correct cone and enter in the dimensions, then click **Update Cone** to make a change to that cone.
- **Display All Cones**: Click the **Display Cones** button in order to view all cones and their dimensions from DynamoDB.
