# auth_server.py

from database import get_user_password, add_active_session
from crypto import encrypt

class AuthenticationServer:
    def __init__(self, secret_key):
        self.secret_key = secret_key

    def issue_tgt(self, username, password):
        """Выдает TGT, если учетные данные верны."""
        stored_password = get_user_password(username)
        if stored_password and stored_password == password:
            # Логируем активную сессию
            add_active_session(username, "AS")
            # Создаем TGT (Ticket Granting Ticket)
            tgt_data = f"username:{username}"
            return encrypt(self.secret_key, tgt_data)
        else:
            raise ValueError("Authentication failed")
