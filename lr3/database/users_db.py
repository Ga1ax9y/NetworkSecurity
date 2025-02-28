users = {
    "alice": {
        "password": "password1",
        "secret_key": "alice_secret_key"
    },
    "alexander": {
        "password": "password123",
        "secret_key": "alexander_secret_key"
    },
    "bob": {
        "password": "password2",
        "secret_key": "bob_secret_key"
    }
}

def get_user(username):
    return users.get(username)

def verify_user(username, password):
    user = get_user(username)
    if user and user["password"] == password:
        return True
    return False
