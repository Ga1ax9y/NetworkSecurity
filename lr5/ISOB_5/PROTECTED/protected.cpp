#include <iostream>
#include <cstring>
#include <iomanip>
#include <cstdlib>
#include <ctime>

using namespace std;

void bufferSizeLimit() {
    char buffer[16];
    int isAdmin = 0;

    cout << "\033[1;32m" << "[PROTECTION: BUFFER SIZE LIMIT]" << "\033[0m\n";
    cout << "Buffer Address: " << (void*)buffer << endl;
    cout << "isAdmin Address: " << (void*)&isAdmin << endl;

    cout << "Enter input: ";
    cin.getline(buffer, sizeof(buffer));

    cout << "\n\033[1;32m" << "[AFTER PROTECTED INPUT]" << "\033[0m\n";
    cout << "Buffer Content: \"" << buffer << "\"\n";
    cout << "isAdmin Value: " << isAdmin << endl;

    if (isAdmin) {
        cout << "Admin access granted.\n";
    }
    else {
        cout << "Normal user access.\n";
    }
}

void stackCanary() {
    char buffer[16];
    unsigned long canary = 0;
    int isAdmin = 0;

    srand(time(0));
    canary = rand();
    unsigned long canaryPtr = canary;

    cout << "\033[1;32m" << "[PROTECTION: STACK CANARY]" << "\033[0m\n";
    cout << "Buffer Address: " << (void*)buffer << endl;
    cout << "Canary Address: " << (void*)canaryPtr << endl;
    cout << "isAdmin Address: " << (void*)&isAdmin << endl;
    cout << "Canary Value: " << hex << canary << dec << "\n";

    cout << "Enter input: ";
    cin.getline(buffer, 255);


    if (canary != canaryPtr) {
        cout << "\033[1;31m" << "[STACK CANARY CORRUPTED!]" << "\033[0m\n";
        cout << "Buffer overflow detected. Terminating program.\n";
        exit(1); 
    }

    cout << "\n\033[1;32m" << "[AFTER PROTECTED INPUT]" << "\033[0m\n";
    cout << "Buffer Content: \"" << buffer << "\"\n";
    cout << "isAdmin Value: " << isAdmin << endl;

    if (isAdmin) {
        cout << "Admin access granted.\n";
    }
    else {
        cout << "Normal user access.\n";
    }
}


int main() {
    int choice;

    cout << "Choose a protection method:\n";
    cout << "1. Buffer Size Limitation\n";
    cout << "2. Stack Canary\n";
    cout << "Enter your choice (1-2): ";
    cin >> choice;
    cin.ignore();

    switch (choice) {
    case 1:
        bufferSizeLimit();
        break;
    case 2:
        stackCanary();
        break;
    default:
        cout << "Invalid choice. Exiting.\n";
        break;
    }

    return 0;
}