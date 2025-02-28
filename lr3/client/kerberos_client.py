from kdc.authentication_server import authenticate_user
from kdc.ticket_granting_server import request_service_ticket
from service.file_service import access_file_service
from service.print_service import access_print_service

authenticated_user = None
tgt_id = None
tgt_hash = None
session_key = None

active_users = []

def authenticate(username, password):
    global authenticated_user, tgt_id, tgt_hash, session_key
    tgt_id, tgt_hash, session_key = authenticate_user(username, password)
    if tgt_id:
        authenticated_user = username
        if username not in active_users:
            active_users.append(username)
        return True
    return False

def client(service_name):
    global authenticated_user, tgt_id, tgt_hash, session_key
    if not authenticated_user:
        print("You are not authenticated. Please authenticate first.")
        return

    service_ticket_id, service_ticket_hash, service_session_key = request_service_ticket(
        tgt_id, tgt_hash, authenticated_user, service_name, session_key
    )
    if not service_ticket_id:
        print("Service ticket request failed")
        return

    if service_name == "fileservice":
        result = access_file_service(service_ticket_id, service_ticket_hash, authenticated_user, service_session_key)
    elif service_name == "printservice":
        result = access_print_service(service_ticket_id, service_ticket_hash, authenticated_user, service_session_key)
    else:
        result = "Unknown service"
    print(result)

def logout():
    global authenticated_user, tgt_id, tgt_hash, session_key
    authenticated_user = None
    tgt_id = None
    tgt_hash = None
    session_key = None
    print("You have been logged out.")

def get_active_users():
    return active_users
