document.addEventListener("DOMContentLoaded", () => {
    function get3DESKey(userSeed) {
        if (userSeed === '0') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let generatedKey = '';
            for (let i = 0; i < 24; i++) {
                generatedKey += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('SeedNum').value = generatedKey; // Show generated key
            return generatedKey;
        } else {
            let keyText = userSeed.padEnd(24, '0').substring(0, 24);
            return keyText;
        }
    }

    function getIVValue(userIV) {
        if (userIV === '0') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let generated = '';
            // Generate a single character (8 bits)
            for (let i = 0; i < 8; i++) {
                generated += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('iv').value = generated;
            return generated;
        } else {
            // Only keep the first character for an 8-bit IV
            return userIV.substring(0, 8);
        }
    }

    async function encryptText(text, method, key, ivValue) {
        if (method === 'Base64') {
            return btoa(encodeURIComponent(text + key));
        } else if (method === '3DES') {
            const iv = CryptoJS.enc.Utf8.parse(ivValue);
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const encrypted = CryptoJS.TripleDES.encrypt(
                CryptoJS.enc.Utf8.parse(text),
                keyBytes,
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            );
            return encrypted.toString();
        }
        return text;
    }

    document.getElementById('encryptBtn').addEventListener('click', async () => {
        const text = document.getElementById('textToEncrypt').value || '';
        const method = document.getElementById('outputFormat').value;
        let seed = (method === '3DES') 
            ? get3DESKey(document.getElementById('SeedNum').value) 
            : '';
        const ivValue = getIVValue(document.getElementById('iv').value);
        const rounds = parseInt(document.getElementById('encryptionRounds').value, 10);
        let result = text;
        for (let i = 0; i < rounds; i++) {
            if (method === '3DES') {
                result = await encryptText(result, method, seed, ivValue);
            } else {
                result = await encryptText(result, method, seed, '');
            }
        }
        document.getElementById('textOutput').value = result + "\n\nIV Used: " + ivValue;
    });
});
