# crypto.py

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.backends import default_backend
import os

def encrypt(key, plaintext):
    """Шифрует данные с использованием AES."""
    iv = os.urandom(16)  # Генерация случайного вектора инициализации
    padder = padding.PKCS7(algorithms.AES.block_size).padder()
    padded_data = padder.update(plaintext.encode()) + padder.finalize()
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    print(iv+ciphertext)
    return iv + ciphertext  # Возвращаем IV + зашифрованные данные

def decrypt(key, ciphertext):
    """Дешифрует данные с использованием AES."""
    iv = ciphertext[:16]  # Извлекаем IV
    ciphertext = ciphertext[16:]
    cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
    decryptor = cipher.decryptor()
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
    plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()
    print(plaintext.decode())
    return plaintext.decode()
