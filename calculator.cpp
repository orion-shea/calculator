#include <iostream>

using namespace std;

double addition(double a, double b) {
    return a + b;
}

double subtraction(double a, double b) {
    return a - b;
}

double multiplication(double a, double b) {
    return a * b;
}

double division(double a, double b) {
    if (b == 0) {
        cout << "Error: Division by zero!" << endl;
        return 0; // Return 0 or handle the error as needed
    }
    return a / b;
}

int main() {
    double a, b;
    cout << "Enter two numbers: ";
    cin >> a >> b;
    cout << "The sum is: " << addition(a, b) << endl;
    cout << "The difference is: " << subtraction(a, b) << endl;
    cout << "The product is: " << multiplication(a, b) << endl;
    cout << "The quotient is: " << division(a, b) << endl;
    return 0;
}