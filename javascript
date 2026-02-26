// 100% FREE BROWSER VOICE TEST (No API Key, No Billing Required)
function generateVoice() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value;
    const btn = document.querySelector('#tts-section .btn-main');

    // Agar text khali hai toh alert do
    if (!text.trim()) {
        alert("Pehle apni kahani likhein!");
        return;
    }

    // Check karein ki browser free voice support karta hai ya nahi
    if (!('speechSynthesis' in window)) {
        alert("Sorry bhai, aapka browser free voice support nahi karta. Chrome use karein.");
        return;
    }

    // Button ka text change karein
    btn.innerText = "Generating Free Voice...";
    btn.disabled = true;

    try {
        // Pehle se chal rahi koi awaaz band karein
        window.speechSynthesis.cancel();

        // Nayi awaaz banayein
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Hindi language set karne ki koshish (Browser par depend karega)
        utterance.lang = 'hi-IN'; 
        
        // Speed set karein (agar dropdown hai, nahi toh normal speed)
        const speed = parseFloat(document.getElementById('voice-speed')?.value || 1.0);
        utterance.rate = speed;

        // Jab awaaz khatam ho jaye toh button wapas normal kar dein
        utterance.onend = function() {
            btn.disabled = false;
            btn.innerText = "Generate Realistic Voice";
        };

        // Agar koi error aaye
        utterance.onerror = function() {
            btn.disabled = false;
            btn.innerText = "Generate Realistic Voice";
            alert("Awaaz play karne mein dikkat aayi.");
        };

        // Awaaz play karein!
        window.speechSynthesis.speak(utterance);
        btn.innerText = "✅ Playing (Free Browser Voice)...";

    } catch (e) {
        alert("Error: " + e.message);
        btn.disabled = false;
        btn.innerText = "Generate Realistic Voice";
    }
}
