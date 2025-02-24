# tgs_server.py

from database import add_active_session
from crypto import encrypt, decrypt

class TicketGrantingServer:
    def __init__(self, secret_key):
        self.secret_key = secret_key

    def issue_service_ticket(self, tgt, client_key):
        """Выдает билет на сервис, если TGT действителен."""
        # Расшифровываем TGT с использованием ключа клиента
        try:
            tgt_data = decrypt(client_key, tgt)
            username = tgt_data.split(":")[1]
            # Логируем активную сессию
            add_active_session(username, "TGS")
            # Создаем сервисный билет
            service_ticket = f"username:{username},service:example_service"
            return encrypt(self.secret_key, service_ticket)
        except Exception as e:
            raise ValueError("Invalid TGT")
