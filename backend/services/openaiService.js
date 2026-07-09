const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.getAIResponse = async (userMessage) => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: userMessage }],
            model: "gpt-4o", // Hoặc gpt-3.5-turbo
        });
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Không thể kết nối với AI");
    }
};