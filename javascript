const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { text, voice } = JSON.parse(event.body);

    const request = {
        input: { text: text },
        voice: { 
            languageCode: 'hi-IN', 
            name: voice, // Marcus/Frank ka code yahan aayega
            ssmlGender: 'MALE' 
        },
        audioConfig: { 
            audioEncoding: 'MP3',
            speakingRate: 0.90, // Thoda slow taki documentary feel aaye
            pitch: -2.0 // Deep voice ke liye
        },
    };

    try {
        const [response] = await client.synthesizeSpeech(request);
        return {
            statusCode: 200,
            body: JSON.stringify({ audio: response.audioContent.toString('base64') }),
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
