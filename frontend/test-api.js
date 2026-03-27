const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    try {
        const genAI = new GoogleGenerativeAI('AIzaSyCN0eZIKo_pw3504IiZmdaCKIxJYf76_cA');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        console.log("Response:", result.response.text());
        console.log("API seems to be working.");
    } catch (error) {
        console.error("API Error:", error.message);
    }
}

testGemini();
