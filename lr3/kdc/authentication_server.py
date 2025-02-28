from database.users_db import get_user, verify_user
import uuid
import hashlib

def generate_session_key():
    return hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

def generate_tgt(username):
    tgt_id = str(uuid.uuid4())
    user = get_user(username)
    secret_key = user["secret_key"]
    session_key = generate_session_key()
    tgt_data = f"{username}:{tgt_id}:{session_key}"
    tgt_hash = hashlib.sha256((tgt_data + secret_key).encode()).hexdigest()
    return tgt_id, tgt_hash, session_key

def authenticate_user(username, password):
    if verify_user(username, password):
        return generate_tgt(username)
    return None, None, None 
