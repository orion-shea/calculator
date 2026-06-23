#include <iostream>

using namespace std;

int calculator(int a, int b) {
    return a + b;
}

int main() {
    int a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "The sum is: " << calculator(a, b) << endl;
    return 0;
}