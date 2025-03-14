import socket
import time

def send_requests(ip, port, num_requests):
    try:
        for i in range(num_requests):
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(2)
                s.connect((ip, port))
                s.sendall(b"TEST")
                response = s.recv(1024).decode()
                print(f"[{i+1}] Response: {response}")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    ip = "127.0.0.1"
    port = 9999
    num_requests = 20
    send_requests(ip, port, num_requests)
