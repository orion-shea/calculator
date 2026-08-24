#include <iostream>
#include "calculator.h"
#include "data_structures.h"

/**
 * Evaluates a Postfix (Reverse Polish Notation) queue using a evaluation stack.
 * Pops operands, applies operators, and pushes intermediate results back onto the stack.
 */
double evaluatePostfix(Queue& q) {
    Stack s;
    std::string str_a, str_b;
    double operand1, operand2, result = 0;
    std::string qTop;

    while(!q.isEmpty()) {
        qTop = q.peek();
        
        // If the token is a number/operand, push directly onto the evaluation stack
        if(qTop != "+" && qTop != "-" && qTop != "*" && qTop != "/") {
            s.push(qTop);
            q.dequeue();
        }
        // If the token is an operator, pop top two operands and compute
        else {
            str_b = s.peek(); // Right operand
            s.pop();
            str_a = s.peek(); // Left operand
            s.pop();
            
            operand1 = std::stod(str_a);
            operand2 = std::stod(str_b);
            
            if(qTop == "+")      { result = operand1 + operand2; }
            else if(qTop == "-") { result = operand1 - operand2; }
            else if(qTop == "*") { result = operand1 * operand2; }
            else if(qTop == "/") { result = operand1 / operand2; }
            
            q.dequeue();
            s.push(std::to_string(result)); // Push intermediate result back as string
        }
    }
    return result;
}

/**
 * Defines operator precedence hierarchy for the Shunting-Yard algorithm.
 * Higher integer values signify higher precedence/binding priority.
 */
int precedence(std::string val) {
    if(val == "(" || val == ")") return 1;
    if(val == "+" || val == "-") return 2;
    if(val == "*" || val == "/") return 3;
    return 0;
}

/**
 * Manages operator stack pushes and queue flushes based on precedence rules.
 * Flushes pending numeric buffers before processing the operator.
 */
void handleOperator(Stack &s, Queue &q, std::string& number, std::string valStr, std::string symbol)
{
    // Flush pending multi-digit or decimal number string into output queue
    if (number != "") {
        q.enqueue(number);
        number = "";
    }
    
    if (s.isEmpty()) {
        s.push(valStr);
    }
    else
    {
        // Pop operators of equal or higher precedence from stack to queue before pushing current operator
        while (!s.isEmpty() && precedence(valStr) <= precedence(s.peek()))
        {
            symbol = s.peek();
            q.enqueue(symbol);
            s.pop();
        }
        s.push(valStr);
    }
}

/**
 * Disambiguates unary minus (negative numbers) from binary minus (subtraction).
 * Returns true if '-' acts as a sign prefix rather than an operator.
 */
bool isNegative(const std::string& expression, int i) {
    if (
        i == 0 ||
        expression[i - 1] == '(' ||
        expression[i - 1] == '*' ||
        expression[i - 1] == '/'
    ) { 
        return true; 
    }
    return false;
}

/**
 * Main Entry Point: Converts Infix expression to RPN Postfix via Dijkstra's Shunting-Yard
 * algorithm, then triggers Postfix evaluation.
 */
double pemdas(const std::string& expression) {
    Stack s; // Operator stack
    Queue q; // Postfix output queue

    char val;
    std::string valStr;
    std::string symbol;
    std::string number;

    // Tokenize and process input expression character-by-character
    for(int i = 0; i < expression.length(); i++) {
        val = expression[i];
        valStr = std::string(1, val);
        
        switch(val) {
            // Numeric characters and decimal points build up the multi-char number buffer
            case '.':
            case '0':
            case '1': case '2': case '3':
            case '4': case '5': case '6':
            case '7': case '8': case '9':
                number += val;
                break;

            // Open parenthesis always gets pushed directly onto operator stack
            case '(':
                s.push(valStr);
                break;

            // Closing parenthesis triggers stack flush to queue until matching '(' is found
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
                s.pop(); // Discard matching '(' from stack
                break;

            // Minus sign can be either unary (negative number) or binary (subtraction)
            case '-':
                if(isNegative(expression, i)) {
                    number += val; // Append to number string if prefixing a negative value
                }
                else {
                    handleOperator(s, q, number, valStr, symbol);
                }
                break;

            // Standard binary operators
            case '+': case '*': case '/':
                handleOperator(s, q, number, valStr, symbol);
                break;

            default:
                break;
        }
    }

    // Flush any remaining number left in buffer after string iteration completes
    if(number != "") {
        q.enqueue(number);
    }

    // Drain remaining operators on stack to the output queue
    while(!s.isEmpty()) {
        symbol = s.peek();
        q.enqueue(symbol);
        s.pop();
    }

    // Evaluate generated RPN queue and return numeric result
    double result = evaluatePostfix(q);
    return result;
}