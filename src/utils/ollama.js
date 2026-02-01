import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'http://localhost:11434/v1',
    apiKey: 'ollama',
    dangerouslyAllowBrowser: true
});

// 1. STRICTER SYSTEM PROMPT
const SYSTEM_PROMPT = `
        You are Alfred, an intelligent AI Butler for "Master Hanlin".
        - Primary Rule: Always answer in English.
        - Tone: Elegant, loyal, witty, and professional (British Butler style).
        - Address the user as "Master Hanlin".
        - Context: Master Hanlin is a kindergarten student, so explain complex things simply but elegantly.
`;

export const askOllama = async (prompt) => {
    try {
        const completion = await client.chat.completions.create({
            model: 'deepseek-r1', // Make sure this matches your installed model
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                // 2. SECRET INJECTION: We add this instruction to EVERY message
                { role: 'user', content: prompt + " (Please answer in English)" }
            ],
            temperature: 0.5, // Lower temperature = More obedient / Less random
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Connection Error:", error);
        return "I cannot reach the neural network, master";
    }
};