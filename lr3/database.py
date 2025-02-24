# database.py

# База данных пользователей
users_db = {
    "alice": "password123",
    "bob": "qwerty",
    "charlie": "securepass"
}

# Активные сессии
active_sessions = {}

def get_user_password(username):
    """Возвращает пароль пользователя по имени."""
    return users_db.get(username)

def get_all_users():
    """Возвращает список всех пользователей."""
    return list(users_db.keys())

def add_active_session(username, service):
    """Добавляет активную сессию пользователя."""
    if username not in active_sessions:
        active_sessions[username] = []
    active_sessions[username].append(service)
    print(f"Пользователь {username} авторизован для доступа к {service}.")

def get_active_sessions():
    """Возвращает информацию об активных сессиях."""
    return active_sessions
