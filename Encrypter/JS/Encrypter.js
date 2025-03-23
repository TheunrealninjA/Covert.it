document.addEventListener("DOMContentLoaded", () => {
    async function encryptText(text, method, key) {
        if (method === 'Base64') {
            return btoa(encodeURIComponent(text + key));
        } else if (method === 'SHA-256') {
            const msgBuffer = new TextEncoder().encode(text + key);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const byteArray = Array.from(new Uint8Array(hashBuffer));
            return byteArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        return text;
    }

    document.getElementById('encryptBtn').addEventListener('click', async () => {
        const text = document.getElementById('textToEncrypt').value || '';
        const method = document.getElementById('outputFormat').value;
        let seed = document.getElementById('SeedNum').value;
        if (method !== 'Base64') {
            if (seed === '0') {
                seed = Math.floor(Math.random() * 1000000).toString();
                document.getElementById('SeedNum').value = seed;
            }
        }
        const rounds = parseInt(document.getElementById('encryptionRounds').value, 10);
        let result = text;
        for (let i = 0; i < rounds; i++) {
            if (method === 'Base64') {
                result = await encryptText(result, method, '');
            } else {
                result = await encryptText(result, method, seed);
            }
        }
        document.getElementById('textOutput').innerHTML = result;
    });
});
