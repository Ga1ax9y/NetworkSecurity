# main.py

from auth_server import AuthenticationServer
from tgs_server import TicketGrantingServer
from service_server import ServiceServer
from client import Client
from database import get_all_users, get_active_sessions
from kdc import KDC
import os

def print_menu():
    """Выводит меню."""
    print("\nМеню:")
    print("1. Показать всех пользователей")
    print("2. Авторизоваться и получить доступ к сервису")
    print("3. Показать активные сессии")
    print("4. Выйти")

def main():
    # Секретные ключи для AS, TGS и сервиса
    as_secret_key = os.urandom(32)
    tgs_secret_key = os.urandom(32)
    service_secret_key = os.urandom(32)

    # Создаем серверы
    as_server = AuthenticationServer(as_secret_key)
    tgs_server = TicketGrantingServer(tgs_secret_key)
    service_server = ServiceServer(service_secret_key)

    # Создаем KDC
    kdc = KDC(as_secret_key, tgs_secret_key)

    while True:
        print_menu()
        choice = input("Выберите действие: ")

        if choice == "1":
            # Показать всех пользователей
            print("Доступные пользователи:", get_all_users())


        elif choice == "2":
            # Авторизоваться и получить доступ к сервису
            username = input("Введите имя пользователя: ")
            password = input("Введите пароль: ")
            client = Client(username, password)
            try:
                client.authenticate(as_server)
                client.request_service_ticket(tgs_server)
                result = client.access_service(service_server)
                print(result)  # Output: Access granted to <username>
            except ValueError as e:
                print(f"Ошибка: {e}")

        elif choice == "3":
            # Показать активные сессии
            print("Активные сессии:", kdc.get_active_sessions())

        elif choice == "4":
            # Выйти
            print("Выход...")
            break

        else:
            print("Неверный выбор. Попробуйте снова.")

if __name__ == "__main__":
    main()
