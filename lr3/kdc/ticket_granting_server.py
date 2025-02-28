from database.services_db import get_service
from database.users_db import get_user
import uuid
import hashlib

def generate_session_key():
    return hashlib.sha256(str(uuid.uuid4()).encode()).hexdigest()

def verify_tgt(tgt_id, tgt_hash, username, session_key):
    user = get_user(username)
    if user:
        secret_key = user["secret_key"]
        tgt_data = f"{username}:{tgt_id}:{session_key}"
        expected_hash = hashlib.sha256((tgt_data + secret_key).encode()).hexdigest()
        return tgt_hash == expected_hash
    return False

def generate_service_ticket(username, service_name, session_key):
    service = get_service(service_name)
    if service:
        secret_key = service["secret_key"]
        ticket_id = str(uuid.uuid4())
        service_session_key = generate_session_key()
        ticket_data = f"{username}:{service_name}:{ticket_id}:{service_session_key}"
        ticket_hash = hashlib.sha256((ticket_data + secret_key).encode()).hexdigest()
        return ticket_id, ticket_hash, service_session_key
    return None, None, None

def request_service_ticket(tgt_id, tgt_hash, username, service_name, session_key):
    if verify_tgt(tgt_id, tgt_hash, username, session_key):
        return generate_service_ticket(username, service_name, session_key)
    return None, None, None
