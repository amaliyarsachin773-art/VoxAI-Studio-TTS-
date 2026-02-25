async function generateVoice() {
    const text = document.getElementById("text-input").value;
    const voice = document.getElementById("voice-male").value;

    if (!text.trim()) {
        alert("Text likho");
        return;
    }

    const btn = document.querySelector(".btn-generate");
    btn.innerText = "Generating...";

    try {
        const res = await fetch("/.netlify/functions/tts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text, voice }),
        });

        if (!res.ok) throw new Error("TTS server error");

        const data = await res.json();

        const audio = new Audio("data:audio/mp3;base64," + data.audio);
        audio.play();

    } catch (e) {
        alert("Error: " + e.message);
    }

    btn.innerText = "Generate Realistic Voice";
}
