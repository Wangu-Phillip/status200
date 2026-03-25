const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyCN0eZIKo_pw3504IiZmdaCKIxJYf76_cA');
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
        const genAI = new GoogleGenerativeAI('AIzaSyCN0eZIKo_pw3504IiZmdaCKIxJYf76_cA');
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
    const models = ["gemini-pro", "gemini-1.0-pro", "gemini-1.5-flash"];
    for (const m of models) {
        if (await testModel(m)) break;
    }
}

run();
