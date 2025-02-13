// Цезарь
function caesarCipher(text, shift, decrypt = false) {
    const shiftAmount = decrypt ? (shift * -1) : shift;
    return text.replace(/[a-zA-Zа-яА-Я]/g, (char) => {
        let base, alphabetSize;
        if (/[a-zA-Z]/.test(char)) {
            base = char < 'a' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            alphabetSize = 26;
        } else {
            base = char < 'а' ? 'А'.charCodeAt(0) : 'а'.charCodeAt(0);
            alphabetSize = 32;
        }
        const charCode = char.charCodeAt(0);
        const shiftedCharCode = base + (charCode - base + shiftAmount + alphabetSize) % alphabetSize;
        return String.fromCharCode(shiftedCharCode);
    });
}

// Виженер
function vigenereCipher(text, key, decrypt = false) {
    const keyLength = key.length;
    let keyIndex = 0;
    return text.split('').map((char) => {
        if (char === '\n') {
            keyIndex = 0;
            return char;
        }
        let base, alphabetSize;
        if (/[a-zA-Z]/.test(char)) {
            base = char < 'a' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
            alphabetSize = 26;
        } else if (/[а-яА-Я]/.test(char)) {
            base = char < 'а' ? 'А'.charCodeAt(0) : 'а'.charCodeAt(0);
            alphabetSize = 32;
        } else {
            return char;
        }
        const keyChar = key[keyIndex % keyLength].toLowerCase();
        let keyShift;
        if (/[a-z]/.test(keyChar)) {
            keyShift = keyChar.charCodeAt(0) - 'a'.charCodeAt(0);
        } else if (/[а-я]/.test(keyChar)) {
            keyShift = keyChar.charCodeAt(0) - 'а'.charCodeAt(0);
        } else {
            return char;
        }
        const shiftAmount = decrypt ? (alphabetSize - keyShift) % alphabetSize : keyShift;
        const charCode = char.charCodeAt(0);
        const shiftedCharCode = base + (charCode - base + shiftAmount + alphabetSize) % alphabetSize;
        keyIndex++;
        return String.fromCharCode(shiftedCharCode);
    }).join('');
}

function animateText(outputElement, finalText, delay = 50) {
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex > finalText.length) {
            clearInterval(interval);
            return;
        }
        const randomChars = Array.from({ length: finalText.length - currentIndex }, () => {
            const randomCharCode = Math.floor(Math.random() * 94) + 32;
            return String.fromCharCode(randomCharCode);
        }).join('');
        outputElement.value = finalText.substring(0, currentIndex) + randomChars;
        currentIndex++;
    }, delay);
}

function displayOutputWithAnimation(text) {
    const outputElement = document.getElementById('output');
    outputElement.value = '';
    animateText(outputElement, text);
}

function downloadOutput() {
    const text = document.getElementById('output').value;
    if (text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'result.txt';
        a.click();
        URL.revokeObjectURL(url);
    } else {
        alert('Нет данных для скачивания.');
    }
}

function encryptCaesar() {
    const fileInput = document.getElementById('fileInput');
    const shift = parseInt(document.getElementById('caesarShift').value);
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const encryptedText = caesarCipher(text, shift);
            displayOutputWithAnimation(encryptedText);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл.');
    }
}

function decryptCaesar() {
    const fileInput = document.getElementById('fileInput');
    const shift = parseInt(document.getElementById('caesarShift').value);
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const decryptedText = caesarCipher(text, shift, true);
            displayOutputWithAnimation(decryptedText);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл.');
    }
}

function encryptVigenere() {
    const fileInput = document.getElementById('fileInput');
    const key = document.getElementById('vigenereKey').value;
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const encryptedText = vigenereCipher(text, key);
            displayOutputWithAnimation(encryptedText);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл.');
    }
}

function decryptVigenere() {
    const fileInput = document.getElementById('fileInput');
    const key = document.getElementById('vigenereKey').value;
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const decryptedText = vigenereCipher(text, key, true);
            displayOutputWithAnimation(decryptedText);
        };
        reader.readAsText(file);
    } else {
        alert('Пожалуйста, выберите файл.');
    }
}
