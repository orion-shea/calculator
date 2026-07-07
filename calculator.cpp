#include <iostream>
#include "calculator.h"

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
        std::cout << "Error: Division by zero!" << std::endl;
        return 0; // Return 0 or handle the error as needed
    }
    return a / b;
}

std::string pemdas(std::string expression) {
    // Learn Dijkstra's shunting algorithm
}

double eval(std::string expression) {

    // EXTREMELY basic implementation for calc to even function.

    std::string a,b,op = "";
    bool flag = false;
    for(int i = 0; i < expression.length(); i++) {
        if(expression[i] == '+') {
            op = "add";
            flag = true;
        }
        else if(expression[i] == '-') {
            op = "sub";
            flag = true;
        }
        else if(expression[i] == '*') {
            op = "mul";
            flag = true;
        }
        else if(expression[i] == '/') {
            op = "div";
            flag = true;
        } 
        else if(flag == false && expression[i] != ' ') {
            a += expression[i];
        } 
        else if (expression[i] != ' ') {
            b += expression[i];
        }
    }

    double result;

    double na = std::stod(a);
    double nb = std::stod(b);
    if(op == "add") result = addition(na, nb);
    if(op == "sub") result = subtraction(na, nb);
    if(op == "mul") result = multiplication(na, nb);
    if(op == "div") result = division(na, nb);

    return result;
}