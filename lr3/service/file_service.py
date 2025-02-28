from database.services_db import get_service
import hashlib

def verify_service_ticket(ticket_id, ticket_hash, username, service_name, session_key):
    service = get_service(service_name)
    if service:
        secret_key = service["secret_key"]
        ticket_data = f"{username}:{service_name}:{ticket_id}:{session_key}"
        expected_hash = hashlib.sha256((ticket_data + secret_key).encode()).hexdigest()
        return ticket_hash == expected_hash
    return False

def access_file_service(ticket_id, ticket_hash, username, session_key):
    if verify_service_ticket(ticket_id, ticket_hash, username, "fileservice", session_key):
        return f"Access granted to fileservice for {username} (Session Key: {session_key})"
    return "Access denied"
