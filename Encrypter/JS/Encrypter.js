document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('outputFormat').addEventListener('change', (event) => {
        const keysize = document.getElementById('keySizeDiv');

        if (event.target.value === 'Base64') {
            document.getElementById('SeedNum').disabled = true;
            document.getElementById('iv').disabled = true;
        } else {
            document.getElementById('SeedNum').disabled = false;
            document.getElementById('iv').disabled = false;
        }

        if (event.target.value === 'AES') {
            keysize.style.display = 'block';
        } else {
            keysize.style.display = 'none';
        }
    });

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

    function getAESKey(userSeed) {
        let selectedKeySize = parseInt(document.getElementById('keySize').value, 10);
        let keyLength = selectedKeySize / 8; // e.g. 128 -> 16 bytes

        if (userSeed === '0') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let generatedKey = '';
            for (let i = 0; i < keyLength; i++) {
                generatedKey += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('SeedNum').value = generatedKey;
            return generatedKey;
        } else {
            return userSeed.padEnd(keyLength, '0').substring(0, keyLength);
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

    function getIVValueAES(userIV) {
        if (userIV === '0') {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let generated = '';
            for (let i = 0; i < 16; i++) {
                generated += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            document.getElementById('iv').value = generated;
            return generated;
        } else {
            return userIV.padEnd(16, '0').substring(0, 16);
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
        } else if (method === 'AES') {
            const iv = CryptoJS.enc.Utf8.parse(ivValue);
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const encrypted = CryptoJS.AES.encrypt(
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
        const method = document.getElementById('outputFormat').value;
        const text = document.getElementById('textToEncrypt').value || '';
        let seed = '';
        let ivVal = '';
        if (method === '3DES') {
            seed = get3DESKey(document.getElementById('SeedNum').value);
            ivVal = getIVValue(document.getElementById('iv').value);
        } else if (method === 'AES') {
            seed = getAESKey(document.getElementById('SeedNum').value);
            ivVal = getIVValueAES(document.getElementById('iv').value);
        } 
        const rounds = parseInt(document.getElementById('encryptionRounds').value, 10);
        let result = text;
        for (let i = 0; i < rounds; i++) {
            result = await encryptText(result, method, seed, ivVal);
        }
        if (method !== 'Base64') {
            document.getElementById('textOutput').value = result + "\n\nIV Used: " + ivVal;
        } else {
            document.getElementById('textOutput').value = result;
        }
    });
});
