        // Шифр Цезаря для русского и английского алфавитов
        function caesarCipher(text, shift, decrypt = false) {
            const shiftAmount = decrypt ? (shift * -1) : shift;
            return text.replace(/[a-zA-Zа-яА-Я]/g, (char) => {
                let base, alphabetSize;
                if (/[a-zA-Z]/.test(char)) {
                    // Английский алфавит
                    base = char < 'a' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
                    alphabetSize = 26;
                } else {
                    // Русский алфавит
                    base = char < 'а' ? 'А'.charCodeAt(0) : 'а'.charCodeAt(0);
                    alphabetSize = 32; // 32 буквы в русском алфавите (без ё)
                }
                const charCode = char.charCodeAt(0);
                const shiftedCharCode = base + (charCode - base + shiftAmount + alphabetSize) % alphabetSize;
                return String.fromCharCode(shiftedCharCode);
            });
        }

        // Шифр Виженера для русского и английского алфавитов
        function vigenereCipher(text, key, decrypt = false) {
            const keyLength = key.length;
            return text.replace(/[a-zA-Zа-яА-Я]/g, (char, index) => {
                let base, alphabetSize;
                if (/[a-zA-Z]/.test(char)) {
                    // Английский алфавит
                    base = char < 'a' ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);
                    alphabetSize = 26;
                } else {
                    // Русский алфавит
                    base = char < 'а' ? 'А'.charCodeAt(0) : 'а'.charCodeAt(0);
                    alphabetSize = 32; // 32 буквы в русском алфавите (без ё)
                }
                const keyChar = key[(index % keyLength)].toLowerCase();
                const keyShift = (/[a-z]/.test(keyChar)) ?
                    keyChar.charCodeAt(0) - 'a'.charCodeAt(0) :
                    keyChar.charCodeAt(0) - 'а'.charCodeAt(0);
                const shiftAmount = decrypt ? (alphabetSize - keyShift) % alphabetSize : keyShift;
                const charCode = char.charCodeAt(0);
                const shiftedCharCode = base + (charCode - base + shiftAmount + alphabetSize) % alphabetSize;
                return String.fromCharCode(shiftedCharCode);
            });
        }

// Функция для анимации "казино" (исправленная)
function animateText(outputElement, finalText, delay = 50) {
    let currentIndex = 0;
    const interval = setInterval(() => {
        if (currentIndex > finalText.length) { // Убедимся, что доходим до конца строки
            clearInterval(interval);
            return;
        }
        // Генерация случайных символов для эффекта "казино"
        const randomChars = Array.from({ length: finalText.length - currentIndex }, () => {
            const randomCharCode = Math.floor(Math.random() * 94) + 32; // Символы ASCII от 32 до 126
            return String.fromCharCode(randomCharCode);
        }).join('');
        // Обновляем текст в поле вывода
        outputElement.value = finalText.substring(0, currentIndex) + randomChars;
        currentIndex++;
    }, delay);
}

        // Функция для вывода результата на страницу с анимацией
        function displayOutputWithAnimation(text) {
            const outputElement = document.getElementById('output');
            outputElement.value = ''; // Очищаем поле перед анимацией
            animateText(outputElement, text);
        }

        // Функция для скачивания результата в файл
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

        // Шифрование файла с использованием шифра Цезаря
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

        // Дешифрование файла с использованием шифра Цезаря
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

        // Шифрование файла с использованием шифра Виженера
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

        // Дешифрование файла с использованием шифра Виженера
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
