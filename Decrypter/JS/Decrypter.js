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

    async function decryptText(text, method, key, ivValue) {
        if (method === 'Base64') {
            return decodeURIComponent(atob(text).replace(key, ''));
        } else if (method === '3DES') {
            const iv = CryptoJS.enc.Utf8.parse(ivValue);
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const decrypted = CryptoJS.TripleDES.decrypt(
                text,
                keyBytes,
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            );
            return decrypted.toString(CryptoJS.enc.Utf8);
        } else if (method === 'AES') {
            const iv = CryptoJS.enc.Utf8.parse(ivValue);
            const keyBytes = CryptoJS.enc.Utf8.parse(key);
            const decrypted = CryptoJS.AES.decrypt(
                text,
                keyBytes,
                {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                }
            );
            return decrypted.toString(CryptoJS.enc.Utf8);
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
            ivVal = document.getElementById('iv').value;
        } else if (method === 'AES') {
            seed = getAESKey(document.getElementById('SeedNum').value);
            ivVal = document.getElementById('iv').value;
        }
        const rounds = parseInt(document.getElementById('encryptionRounds').value, 10);
        let result = text;
        for (let i = 0; i < rounds; i++) {
            result = await decryptText(result, method, seed, ivVal);
        }
        document.getElementById('textOutput').value = result;
    });
});