const axios = require('axios');

const delay = ms => new Promise(res => setTimeout(res, ms));

exports.handler = async (event) => {
    // Netlify Variable se aapki CAMB AI Key aayegi
    const API_KEY = process.env.CAMB_API_KEY;

    if (!API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "Netlify mein CAMB_API_KEY save nahi hai!" }) };
    }

    try {
        const { text, voice_id } = JSON.parse(event.body);

        // 1. Camb AI ko script aur chuni hui awaaz bhejna
        const initRes = await axios.post("https://client.camb.ai/apis/tts", 
            { 
                text: text, 
                voice_id: voice_id || 147320, // Default voice agar koi na chune
                language: 1, 
                gender: 1 
            },
            { headers: { "x-api-key": API_KEY } }
        );

        const taskId = initRes.data.task_id;
        let runId = null;

        // 2. Awaaz banne ka wait karna (Polling)
        for (let i = 0; i < 5; i++) {
            await delay(2000); 
            const statusRes = await axios.get(`https://client.camb.ai/apis/tts/${taskId}`, {
                headers: { "x-api-key": API_KEY }
            });
            
            if (statusRes.data.status === "SUCCESS") {
                runId = statusRes.data.run_id;
                break;
            } else if (statusRes.data.status === "FAILED") {
                throw new Error("Camb AI API Error - Voice generation failed.");
            }
        }

        if (!runId) throw new Error("Awaaz banne mein time lag raha hai.");

        // 3. Audio file fetch karke website par bhejna
        const audioRes = await axios.get(`https://client.camb.ai/apis/tts-result/${runId}`, {
            headers: { "x-api-key": API_KEY },
            responseType: 'arraybuffer'
        });

        const base64Audio = Buffer.from(audioRes.data, 'binary').toString('base64');

        return {
            statusCode: 200,
            body: JSON.stringify({ audio: base64Audio }),
        };

    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
