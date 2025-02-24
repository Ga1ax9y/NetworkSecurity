# kdc.py

from auth_server import AuthenticationServer
from tgs_server import TicketGrantingServer
from database import get_active_sessions

class KDC:
    def __init__(self, as_secret_key, tgs_secret_key):
        self.as_server = AuthenticationServer(as_secret_key)
        self.tgs_server = TicketGrantingServer(tgs_secret_key)

    def get_active_sessions(self):
        """Возвращает информацию об активных сессиях."""
        return get_active_sessions()
