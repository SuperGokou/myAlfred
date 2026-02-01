import { askOllama } from './ollama';

export const processInput = async (text) => {
    const t = text.toLowerCase();

    // --- 0. 🛑 STOP TRIGGER (Priority) ---
    if (t.includes('stop') || t.includes('quiet') || t.includes('shut up') || t.includes('停') || t.includes('别唱')) {
        return {
            text: "好的少爷，保持安静。", // "Okay Master, staying quiet."
            action: 'STOP_AUDIO',
            data: null
        };
    }

    // --- 1. 🎤 SINGING TRIGGER (唱歌) ---
    // Expanded triggers to catch "听" (listen) and "放" (play)
    if (
        t.includes('sing') ||
        (t.includes('play') && t.includes('song')) ||
        t.includes('唱') ||
        t.includes('听') ||
        t.includes('放')
    ) {

        // Extract the song name using Regex
        // This removes ALL these words: "sing", "play", "me", "a", "song", "give me", "I want", "listen", "one", "music"
        let query = t.replace(
            /(sing|play|me|a|song|listen|to|给我|唱|一首|歌|我想|听|放|为我|音乐)/gi,
            ""
        ).trim();

        // Example Logic:
        // "给我唱一首歌" -> Removes "给我", "唱", "一首", "歌" -> Result: "" -> Plays Random
        // "我想听七里香" -> Removes "我想", "听" -> Result: "七里香" -> Plays QiLiXiang
        // "Sing me a song" -> Removes "Sing", "me", "a", "song" -> Result: "" -> Plays Random

        // If query is empty (e.g. just "Sing a song"), default to random
        if (query.length < 1) query = "random";

        return {
            text: `Clearing my throat... Playing ${query === 'random' ? 'a random selection' : query}.`,
            action: 'SING_SONG',
            data: { query: query }
        };
    }

    // --- 2. 📂 PROJECT TRIGGER (项目) ---
    if (t.includes('project') || t.includes('work') || t.includes('项目')) {
        return {
            text: "少爷，这是您最棒的自动驾驶仪表盘作业！",
            action: 'SHOW_PROJECT',
            data: {
                title: "EV Dashboard",
                description: "React & Python Telemetry System",
                image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6",
                link: "#"
            }
        };
    }

    // --- 3. 🧠 AI TRIGGER (Send to DeepSeek) ---
    try {
        const aiResponse = await askOllama(text);
        return { text: aiResponse, action: 'none', data: null };
    } catch (err) {
        console.error("Brain Error:", err);
        return { text: "无法连接到神经网络。", action: 'error', data: null };
    }
};