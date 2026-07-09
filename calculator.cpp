#include <iostream>
#include "calculator.h"
#include "data_structures.h"

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
    return a / b;
}

double exponent(double a, double b) {
    return pow(a, b);
}

double postfix(Queue q) {
    std::string a, b;
    double result = 0;
    Stack s;
    int index = q.size();
    for(int i = 0; i < index; i++) {
        if(q.peek() != "+" && q.peek() != "-" && q.peek() != "*" && q.peek() != "/" && q.peek() != "^") {
            s.push(q.peek());
            q.dequeue();
        }
        else {
            if(q.peek() == "+") {
                b = s.peek();
                s.pop();
                a = s.peek();
                s.pop();
                result = addition(std::stod(a), std::stod(b));
            }
            if(q.peek() == "-") {
                b = s.peek();
                s.pop();
                a = s.peek();
                s.pop();
                result = subtraction(std::stod(a), std::stod(b));
            }
            if(q.peek() == "*") {
                b = s.peek();
                s.pop();
                a = s.peek();
                s.pop();
                result = multiplication(std::stod(a), std::stod(b));
            }
            if(q.peek() == "/") {
                b = s.peek();
                s.pop();
                a = s.peek();
                s.pop();
                result = division(std::stod(a), std::stod(b));
            }
            if(q.peek() == "^") {
                b = s.peek();
                s.pop();
                a = s.peek();
                s.pop();
                result = exponent(std::stod(a), std::stod(b));
            }
            q.dequeue();
            s.push(std::to_string(result));
        }
    }
    return result;
}

int precedence(std::string val) {
    if(val == "+" || val == "-") return 1;
    if(val == "*" || val == "/") return 2;
    if(val == "^") return 3;
    if(val == "(" || val == ")") return 4;
    return 0;
}

/* Better than what I've written above - It's much more readable.
enum Precedence {
    NONE = 0,
    SUM = 1,        // + and -
    PRODUCT = 2,    // * and /
    EXPONENT = 3    // ^
};
*/

// CREATE TOKENIZE FUNCTION! Also think about using a struct/class for this.
// This will separate tokenization from parsing and doing my shunting yard algorithm. Industry standard.
// Splitting up a program into multiple functions like this avoids "tight coupling".

/*

Incredible. Instead of having a queue of heavy strings, with complex destructors, big size, etc.
I can use this industry standard:
Method: The Variant / Polymorphic Token (The True Industry Standard)

I felt I had to resort to string because I was putting both digits and chars into my queue. I didn't know another
way to put something like 233.5 into the same list as + without just turning everything into strings and going off
that. It's still fine for a small application, I'm sure, but this method is so elite:

enum TokenType { OPERATOR, NUMBER };

struct Token {
    TokenType type;
    char op;         // Used if type == OPERATOR (e.g., '+', '*')
    double value;    // Used if type == NUMBER   (e.g., 5.2, 233.0)
};
*/

/*
Method B: Delimited Single Character Array (The Lightweight Hack)
This also works - instead of strings - ['5', '.', '2', ' ', '2', ' ', '+'] do this. 
Then, when I hit a space, glue the characters together into a string to then convert into a double.
Doing that with std::stod. Also really cool. I should probably go this route for learning.

*/



double pemdas(const std::string& expression) { //look more into const and passing by reference.
    Stack s;
    Queue q;

    char val;
    std::string valStr;
    std::string symbol;
    std::string number;

    for(int i = 0; i < expression.length(); i++) {
        val = expression[i];
        valStr = std::string(1, val);
        switch(val) {
            case '(':
                s.push(valStr);
                break;
            case ')':
                if(number != "") {
                    q.enqueue(number);
                    number = "";
                }
                while(s.peek() != "(") {
                    symbol = s.peek();
                    q.enqueue(symbol);
                    s.pop();
                }
                s.pop();
                break;
            case '+':
            case '-':
            case '*':
            case '/': //the rest of these ops are left associative.
            case '^': // exponent is right associative and shouldn't use <= for precedence, but <.
                q.enqueue(number);
                number = "";

                if(s.isEmpty()) {
                    s.push(valStr);
                }

                else {
                    while(precedence(valStr) <= precedence(s.peek())) {
                        symbol = s.peek();
                        q.enqueue(symbol);
                        s.pop();
                    }
                    s.push(valStr);
                }
                break;
            case ' ':
                break;
            default:
                number += val;
        }
    }
    if(number != "") {
        q.enqueue(number);
    }
    while(!s.isEmpty()) {
        symbol = s.peek();
        q.enqueue(symbol);
        s.pop();
    }
    std::cout << " FINAL QUEUE:" << std::flush;
    for(int i = 0; i < q.size(); i++) {
        std::cout << " " << q.arr[i] << std::flush;
    }
    std::cout << std::endl;
    double result = postfix(q);
    return result;
}