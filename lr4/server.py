import socket
import threading
from collections import defaultdict, deque
import time
import sys
import os
import platform
from colorama import init, Fore, Back, Style

init()

class FancyServer:
    def __init__(self, host='localhost', port=9999):
        self.host = host
        self.port = port
        self.protection_enabled = False
        self.max_connections = 10
        self.max_connections_per_ip = 3
        self.request_limit = 5
        self.connections = 0
        self.connected_ips = defaultdict(int)
        self.requests = defaultdict(lambda: deque(maxlen=10))
        self.lock = threading.Lock()
        self.running = False
        self.start_time = time.time()
        self.legitimate_responses = 0

    def handle_client(self, client_socket):
        ip = client_socket.getpeername()[0]
        try:

            data = client_socket.recv(1024)
            if data:
                response = b"OK"
                if self.protection_enabled:
                    with self.lock:
                        now = time.time()
                        self.requests[ip].append(now)

                        if len(self.requests[ip]) >= self.request_limit:
                            time_diff = now - self.requests[ip][0]
                            if time_diff < 5.0:
                                response = b"BLOCKED"

                with self.lock:
                    load_factor = min(1.0, self.connections / self.max_connections)
                delay = load_factor * 2
                time.sleep(delay)

                client_socket.send(response)
                with self.lock:
                    if response == b"OK":
                        self.legitimate_responses += 1
        except:
            pass
        finally:
            client_socket.close()
            with self.lock:
                self.connections -= 1
                self.connected_ips[ip] -= 1
                if self.connected_ips[ip] <= 0:
                    del self.connected_ips[ip]

    def start_server(self):
        self.running = True
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((self.host, self.port))
        server_socket.listen(5)
        print(f"{Fore.GREEN}⚡ Server started on {self.host}:{self.port}{Style.RESET_ALL}")

        while self.running:
            try:
                client_socket, addr = server_socket.accept()
                ip = addr[0]

                with self.lock:
                    if self.protection_enabled:
                        if (self.connections >= self.max_connections or
                            self.connected_ips[ip] >= self.max_connections_per_ip):
                            client_socket.close()
                            continue

                        self.connections += 1
                        self.connected_ips[ip] += 1

                    client_thread = threading.Thread(target=self.handle_client, args=(client_socket,))
                    client_thread.start()
            except:
                break
        server_socket.close()

    def toggle_protection(self, enable):
        self.protection_enabled = enable
        status = f"{Fore.GREEN}✓ ENABLED{Style.RESET_ALL}" if enable else f"{Fore.RED}✗ DISABLED{Style.RESET_ALL}"
        print(f"\n🛡️ Protection Status: {status}")

    def get_status(self):
        return {
            "uptime": time.time() - self.start_time,
            "protection": self.protection_enabled,
            "connections": self.connections,
            "connected_ips": dict(self.connected_ips),
            "max_per_ip": self.max_connections_per_ip,
            "health": max(0, 100 - (self.connections / self.max_connections * 100)),
            "legitimate_responses": self.legitimate_responses
        }

def draw_menu():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"""{Fore.CYAN}
    █▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
    █          🛡️ TCP SERVER CONTROL PANEL       █
    █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
    {Style.RESET_ALL}
    {Fore.YELLOW}1.{Style.RESET_ALL} 📊 Server Status
    {Fore.YELLOW}2.{Style.RESET_ALL} 🚀 Start Server
    {Fore.YELLOW}3.{Style.RESET_ALL} 🛑 Stop Server
    {Fore.YELLOW}4.{Style.RESET_ALL} 🛡️ Toggle Protection
    {Fore.YELLOW}5.{Style.RESET_ALL} 📨 Send Message to Server
    {Fore.YELLOW}6.{Style.RESET_ALL} ❌ Exit
    """)

def send_client_message(host, port, message):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)
            s.connect((host, port))
            start = time.time()
            s.sendall(message.encode())
            response = s.recv(1024).decode()
            latency = (time.time() - start) * 1000
            print(f"\n{Fore.GREEN}📩 Response: {response}")
            print(f"⏱️ Latency: {latency:.1f}ms{Style.RESET_ALL}")
    except Exception as e:
        print(f"\n{Fore.RED}❌ Error: {str(e)}{Style.RESET_ALL}")

def status_report(server):
    status = server.get_status()
    print(f"""{Fore.CYAN}
    === SERVER STATUS ===
    ⏱️ Uptime: {status['uptime']:.1f}s
    🛡️ Protection: {'✓ ENABLED' if status['protection'] else '✗ DISABLED'}
    🔌 Connections: {status['connections']}/{server.max_connections}
    ❤️ Health: {status['health']:.1f}%
    🔐 Max per IP: {status['max_per_ip']}
    📨 Legitimate Responses: {status['legitimate_responses']}

    🌐 Connected Clients:{Style.RESET_ALL}""")
    for ip, count in status['connected_ips'].items():
        print(f"    {Fore.MAGENTA}➔ {ip}: {count} connections{Style.RESET_ALL}")
    input("\nPress Enter to continue...")

def main():
    server = FancyServer()
    server_thread = None

    while True:
        draw_menu()
        choice = input(f"\n{Fore.YELLOW}➔ Select option [1-6]: {Style.RESET_ALL}")

        if choice == "1":
            status_report(server)
        elif choice == "2":
            if not server.running:
                server_thread = threading.Thread(target=server.start_server)
                server_thread.daemon = True
                server_thread.start()
                print(f"\n{Fore.GREEN}🚀 Server started successfully!{Style.RESET_ALL}")
            else:
                print(f"\n{Fore.YELLOW}⚠️ Server is already running!{Style.RESET_ALL}")
            time.sleep(1)
        elif choice == "3":
            if server.running:
                server.running = False
                print(f"\n{Fore.RED}🛑 Server stopping...{Style.RESET_ALL}")
            else:
                print(f"\n{Fore.YELLOW}⚠️ Server not running!{Style.RESET_ALL}")
            time.sleep(1)
        elif choice == "4":
            server.toggle_protection(not server.protection_enabled)
            time.sleep(1)
        elif choice == "5":
            if server.running:
                message = input(f"{Fore.BLUE}✉️ Enter message to send: {Style.RESET_ALL}")
                send_client_message(server.host, server.port, message)
            else:
                print(f"\n{Fore.RED}❌ Server not running!{Style.RESET_ALL}")
            time.sleep(1)
        elif choice == "6":
            print(f"\n{Fore.CYAN}👋 Exiting...{Style.RESET_ALL}")
            if server.running:
                server.running = False
            sys.exit()
        else:
            print(f"\n{Fore.RED}⚠️ Invalid choice!{Style.RESET_ALL}")
            time.sleep(1)

if __name__ == "__main__":
    main()
