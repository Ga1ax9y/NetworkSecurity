# client.py
import os
from crypto import encrypt, decrypt

class Client:
    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.client_key = os.urandom(32)  # Генерация ключа клиента

    def authenticate(self, as_server):
        """Аутентифицируется на сервере аутентификации."""
        self.tgt = as_server.issue_tgt(self.username, self.password)

    def request_service_ticket(self, tgs_server):
        """Запрашивает билет на сервис у TGS."""
        self.service_ticket = tgs_server.issue_service_ticket(self.tgt, self.client_key)

    def access_service(self, service_server):
        """Получает доступ к сервису."""
        return service_server.grant_access(self.service_ticket)
