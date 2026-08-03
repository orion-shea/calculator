#include <iostream>
#include "calculator.h"
#include "data_structures.h"

double evaluatePostfix(Queue& q) {
    Stack s;
    std::string str_a, str_b;
    double operand1, operand2, result = 0;
    std::string qTop;

    while(!q.isEmpty()) {
        qTop = q.peek();
        if(qTop != "+" && qTop != "-" && qTop != "*" && qTop != "/" && qTop != "^") {
            s.push(qTop);
            q.dequeue();
        }
        else {
            str_b = s.peek();
            s.pop();
            str_a = s.peek();
            s.pop();
            operand1 = std::stod(str_a);
            operand2 = std::stod(str_b);
            if(qTop == "+") {result = operand1 + operand2;}
            else if(qTop == "-") {result = operand1 - operand2;}
            else if(qTop == "*") {result = operand1 * operand2;}
            else if(qTop == "/") {result = operand1 / operand2;}
            else if(qTop == "^") {result = pow(operand1, operand2);}
            q.dequeue();
            s.push(std::to_string(result));
        }
    }
    return result;
}

int precedence(std::string val) {
    if(val == "+" || val == "-") return 2;
    if(val == "*" || val == "/") return 3;
    if(val == "^") return 4;
    if(val == "(" || val == ")") return 1;
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

void handleOperator(Stack &s, Queue &q, std::string& number, std::string valStr, std::string symbol)
{
    if (number != "") {
        q.enqueue(number);
        number = "";
    }
    if (s.isEmpty()) {
        s.push(valStr);
    }
    else if(valStr == "^")
    {
        while (!s.isEmpty() && precedence(valStr) < precedence(s.peek()))
        {
            symbol = s.peek();
            q.enqueue(symbol);
            s.pop();
        }
        s.push(valStr);
    }
    else
    {
        while (!s.isEmpty() && precedence(valStr) <= precedence(s.peek()))
        {
            symbol = s.peek();
            q.enqueue(symbol);
            s.pop();
        }
        s.push(valStr);
    }
}

bool isNegative(const std:: string& expression, int i) {
    if
    (
        i == 0 ||
        expression[i - 1] == '(' ||
        expression[i - 1] == '*' ||
        expression[i - 1] == '/' ||
        expression[i - 1] == '^'
    ) { return true; }
    return false;
    /*
    Is operator if:
        -follows a number -> 5 - 2
        -follows an ending paren -> (2 + 2 ) - 3

    Is negative if:
        -follows nothing else -> -5
        -follows open paren -> (-2 + 2)
        -follows mult or divide -> 5*-2
        2-3(2)

    */
}

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
            case '.':
            case '0':
            case '1': case '2': case '3':
            case '4': case '5': case '6':
            case '7': case '8': case '9':
                number += val;
                break;
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
            case '-':
                if(isNegative(expression, i)) {
                    number += val;
                }
                else handleOperator(s, q, number, valStr, symbol);
                break;
            case '+': case '*': case '/': case '^': // exponent is right associative and shouldn't use <= for precedence, but <.
                handleOperator(s, q, number, valStr, symbol);
                break;
            default:
                break;
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
    double result = evaluatePostfix(q);
    return result;
}