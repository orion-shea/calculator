#include <iostream>
#include "stack.h"

// initialize array
Stack::Stack() { 
    for(int i = 0; i < CAP; i++) {
        arr[i] = ' ';
    }
    topIndex = -1;
}

// push character onto index
void Stack::push(char val) {
    if(topIndex < CAP - 1) {
        topIndex++;
        arr[topIndex] = val;
    }
}

void Stack::pop() {
    if(topIndex > -1) {
        arr[topIndex] = ' ';
        topIndex--;
    }
}

char Stack::top() {
    if(topIndex == -1) { return ' '; }
    return arr[topIndex];
}

bool Stack::isEmpty() {
    if(topIndex == -1) {return true;}
    return false;
}

bool Stack::isFull() {
    if(topIndex == CAP - 1) {return true;}
    return false;
}

int Stack::size() {
    return topIndex + 1;
}