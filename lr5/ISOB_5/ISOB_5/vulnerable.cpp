#include <iostream>
#include <cstring>
#include <iomanip>

using namespace std;

void printMemory(const char* buffer, int size, const char* label) {
    cout << "\n=== Memory Dump (" << label << ") ===\n";
    for (int i = 0; i < size+16; i++) {
        cout << "Address: " << (void*)&buffer[i]
            << " | Value: " << hex << (int)buffer[i]
            << dec << " | Char: " << buffer[i] << endl;
    }
}

void demo() {
    char buffer[16];
    int isAdmin = 0;

    memset(buffer, 0, sizeof(buffer));

    cout << "\033[1;31m" << "[VULNERABLE MODE]" << "\033[0m\n";
    cout << "Buffer Address: " << (void*)buffer << endl;
    cout << "isAdmin Address: " << (void*)&isAdmin << endl;
    cout << "Initial isAdmin: " << isAdmin << "\n\n";

    cout << "Enter input: ";
    cin.getline(buffer, 255); 

    cout << "\n\033[1;31m" << "[AFTER OVERFLOW]" << "\033[0m\n";
    cout << "Buffer Content: \"" << buffer << "\"\n";
    cout << "isAdmin Value: " << isAdmin << endl;
    printMemory(buffer, 32, "Buffer + Overflow");

    if (isAdmin) {
        cout << "\n\033[1;31m" << "EXPLOIT SUCCESSFUL! Admin access granted.\033[0m\n";
    }
    else {
        cout << "\nNormal user access.\n";
    }
}

int main() {
    demo();
    return 0;
}