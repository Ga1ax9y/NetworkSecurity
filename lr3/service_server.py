# service_server.py

from database import add_active_session
from crypto import decrypt

class ServiceServer:
    def __init__(self, secret_key):
        self.secret_key = secret_key

    def grant_access(self, service_ticket):
        """Предоставляет доступ, если билет действителен."""
        try:
            ticket_data = decrypt(self.secret_key, service_ticket)
            username = ticket_data.split(",")[0].split(":")[1]
            # Логируем активную сессию
            add_active_session(username, "ServiceServer")
            return f"Access granted to {username}"
        except Exception as e:
            raise ValueError("Invalid service ticket")
