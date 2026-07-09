#include <iostream>
#include "data_structures.h"

// STACK

Stack::Stack() { 
    for(int i = 0; i < CAP; i++) {
        arr[i] = ' ';
    }
    topIndex = -1;
}

// push character onto index
void Stack::push(std::string val) {
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

std::string Stack::peek() {
    if(topIndex == -1) { return " "; }
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

//QUEUE

Queue::Queue() {
    head = tail = capacity = 0;
}

void Queue::enqueue(std::string val) {
    if(isFull()) {
        std::cout << "Queue is full." << std::endl;
        return;
    }
    if(isEmpty()) { // if queue is empty, just add value to head
        arr[head] = val;
    }
    else {
        if(tail < CAP - 1) {
            tail++;
            arr[tail] = val;
        }
        else {
            tail = 0;
            arr[tail] = val;
        }
    }
    capacity++;
}

void Queue::dequeue() { // if head not empty, make it empty and move head to next mem addr    
    if(isEmpty()) {
        std::cout << "Queue is empty." << std::endl;
        return;
    }
    
    

    if(head < CAP - 1) {
        arr[head] = " ";
        head++;
    }
    else {
        arr[head] = " ";
        head = 0;
    }
    capacity--;
}

std::string Queue::peek() {
    return arr[head];
}

bool Queue::isEmpty() {
    if(capacity == 0) {
        return true;
    }
    return false;
}

bool Queue::isFull() {
    if(capacity == CAP) {
        return true;
    }
    return false;
}

int Queue::size() {
    return capacity;
}