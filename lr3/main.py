from client.kerberos_client import authenticate, client, logout, get_active_users

def display_menu(is_authenticated):
    print("\n=== Kerberos Client Menu ===")
    if not is_authenticated:
        print("1. Authenticate")
        print("2. Exit")
    else:
        print("1. Access service")
        print("2. View active users")
        print("3. Logout")

def get_user_credentials():
    username = input("Enter your username: ")
    password = input("Enter your password: ")
    return username, password

def select_service():
    print("\nAvailable services:")
    print("1. fileservice")
    print("2. printservice")
    choice = input("Choose a service (1-2): ")
    if choice == "1":
        return "fileservice"
    elif choice == "2":
        return "printservice"
    else:
        print("Invalid choice. Defaulting to fileservice.")
        return "fileservice"

def main():
    while True:
        from client.kerberos_client import authenticated_user
        is_authenticated = authenticated_user is not None
        display_menu(is_authenticated)
        choice = input("Choose an option: ")

        if not is_authenticated:
            if choice == "1":
                username, password = get_user_credentials()
                if authenticate(username, password):
                    print("Authentication successful!")
                else:
                    print("Authentication failed. Please check your username and password.")
            elif choice == "2":
                print("Exiting the Kerberos client.")
                break
            else:
                print("Invalid choice. Please try again.")
        else:
            if choice == "1":
                service_name = select_service()
                print(f"\nAttempting to access {service_name}...")
                client(service_name)
            elif choice == "2":
                active_users = get_active_users()
                if active_users:
                    print("\nActive users:")
                    for user in active_users:
                        print(f"- {user}")
                else:
                    print("\nNo active users.")
            elif choice == "3":
                logout()
            else:
                print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
