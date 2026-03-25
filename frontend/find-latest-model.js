const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        console.log("Checking model availability...");
        // Note: listModels is on the genAI object or a model?
        // According to docs, it's not directly on genAI in the older SDKs, 
        // but let's try a different approach.
        console.log("Attempting to find latest models...");
        // Usually we can't easily list them without the discovery API, 
        // but let's try gemini-2.0-flash-exp.
    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function testModel(modelName) {
    try {
        const fs = require('fs');
        const env = fs.readFileSync('.env', 'utf8');
        const key = env.match(/REACT_APP_GEMINI_API_KEY=(.*)/)[1].trim();
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`Model ${modelName} works!`);
        return true;
    } catch (error) {
        console.log(`Model ${modelName} failed: ${error.message}`);
        return false;
    }
}

async function run() {
    const models = ["gemini-2.0-flash-exp", "gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"];
    for (const m of models) {
        if (await testModel(m)) break;
    }
}

run();
