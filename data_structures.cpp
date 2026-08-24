#include <string>
#include "data_structures.h"

/* ==========================================
   1. FIXED-CAPACITY STACK IMPLEMENTATION (LIFO)
   ========================================== */

/**
 * Initializes stack internal array with empty string padding
 * and sets topIndex pointer to empty sentinel (-1).
 */
Stack::Stack() { 
    for(int i = 0; i < CAP; i++) {
        arr[i] = ' ';
    }
    topIndex = -1;
}

/**
 * Pushes string token onto stack if storage capacity remains.
 */
void Stack::push(std::string val) {
    if(topIndex < CAP - 1) {
        topIndex++;
        arr[topIndex] = val;
    }
}

/**
 * Pops top element off stack and clears array cell.
 */
void Stack::pop() {
    if(topIndex > -1) {
        arr[topIndex] = ' ';
        topIndex--;
    }
}

/**
 * Inspects top element without mutating stack state.
 * Returns single space string if stack is empty.
 */
std::string Stack::peek() {
    if(topIndex == -1) { return " "; }
    return arr[topIndex];
}

bool Stack::isEmpty() {
    return topIndex == -1;
}

bool Stack::isFull() {
    return topIndex == CAP - 1;
}

int Stack::size() {
    return topIndex + 1;
}


/* ==========================================
   2. CIRCULAR QUEUE IMPLEMENTATION (FIFO)
   ========================================== */

/**
 * Initializes circular ring buffer pointers and element count tracking.
 */
Queue::Queue() {
    head = tail = capacity = 0;
}

/**
 * Enqueues element to the tail of the ring buffer, wrapping around
 * to array index 0 when tail reaches array end bound (CAP - 1).
 */
void Queue::enqueue(std::string val) {
    if(isFull()) {
        return;
    }
    
    // First insertion populates head index directly
    if(isEmpty()) {
        arr[head] = val;
    }
    else {
        // Circular buffer index wrap-around handling
        if(tail < CAP - 1) {
            tail++;
            arr[tail] = val;
        }
        else {
            tail = 0; // Wrap back to front of internal array
            arr[tail] = val;
        }
    }
    capacity++;
}

/**
 * Dequeues element from the head of the ring buffer, clearing memory cell
 * and advancing head index using modular array wrap-around.
 */
void Queue::dequeue() { 
    if(isEmpty()) {
        return;
    }

    // Advance head pointer with circular array wrap-around
    if(head < CAP - 1) {
        arr[head] = " ";
        head++;
    }
    else {
        arr[head] = " ";
        head = 0; // Wrap back to front of internal array
    }
    capacity--;
}

/**
 * Reads front-of-queue element without dequeuing.
 */
std::string Queue::peek() {
    return arr[head];
}

bool Queue::isEmpty() {
    return capacity == 0;
}

bool Queue::isFull() {
    return capacity == CAP;
}

int Queue::size() {
    return capacity;
}