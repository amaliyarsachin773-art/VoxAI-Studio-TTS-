// Vox AI Studio - Final Integrated Script (February 2026)
const API_BASE = "/.netlify/functions/tts";

// 1. Tab Switching (TTS vs Dubbing)
function switchTab(mode, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tts-section').style.display = (mode === 'tts') ? 'block' : 'none';
    document.getElementById('dub-section').style.display = (mode === 'dub') ? 'block' : 'none';
}

// 2. Strict 50MB Blocking & Validation
function validateAndUpload(input) {
    const file = input.files[0];
    const area = document.getElementById('drop-zone');
    const status = document.getElementById('upload-text');
    const btn = document.getElementById('process-btn');

    if (file) {
        if (file.size > 50 * 1024 * 1024) { // 50MB Hard Limit
            alert("⚠️ 50MB se badi file allowed nahi hai!");
            input.value = "";
            area.style.borderColor = "#ff4444";
            status.innerText = "File Rejected (Too Large)";
            btn.disabled = true;
        } else {
            area.style.borderColor = "#d4af37";
            status.innerText = "Ready: " + file.name;
            btn.disabled = false;
        }
    }
}

// 3. FINAL VOICE GENERATOR (With 20 Voices & Speed Control)
async function generateVoice() {
    const textInput = document.getElementById('text-input');
    const text = textInput.value;
    
    // Voice Selection (Male or Female dropdown)
    const maleVoice = document.getElementById('male-select').value;
    const femaleVoice = document.getElementById('female-select').value;
    
    // Speed Control Logic (0.25x to 4.0x range supported by Google)
    const speed = parseFloat(document.getElementById('voice-speed')?.value || 1.0);

    const btn = document.querySelector('#tts-section .btn-main');

    if (!text.trim()) return alert("Pehle apni kahani likhein!");

    // UI Feedback
    btn.innerText = "Connecting to AI Engine...";
    btn.disabled = true;

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                text: text, 
                voice: maleVoice, // Aap yahan logic daal sakte hain toggle ke liye
                speed: speed 
            })
        });

        const data = await response.json();

        if (data.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
            audio.play();
            btn.innerText = "✅ Playing Realistic Voice...";
        } else {
            throw new Error(data.error || "Awaaz generate nahi hui");
        }
    } catch (e) {
        // Error handling for Netlify connection
        alert("Server Connection Failed! Check: \n1. Netlify API Key \n2. Google Billing \n3. Cloud TTS API Enabled");
    } finally {
        setTimeout(() => { 
            btn.disabled = false; 
            btn.innerText = "Generate Realistic Voice"; 
        }, 4000);
    }
}

// 4. Dubbing Process Logic
function startProcessing() {
    const lang = document.getElementById('target-lang').value;
    alert(`AI Dubbing shuru ho gayi hai: Target Language [${lang}]`);
}
