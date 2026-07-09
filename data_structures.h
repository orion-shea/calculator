#ifndef DATA_STRUCTURES_H
#define DATA_STRUCTURES_H

#pragma once
#include <string>

class Stack {
    public:
        //Making an array with a fixed size b/c users won't use too many operators.
        static constexpr int CAP = 1000; // Avoids magic numbers.
        /*
            "static constexpr" makes it a compile-time constant
            It won't run if I declare as int, etc.
        */
        std::string arr[CAP]; // Attribute (member variable)
        int topIndex; // Track the index.

        Stack(); //constructor
        void push(std::string val);
        void pop();
        std::string peek();
        bool isEmpty();
        bool isFull();
        int size();
};

class Queue {
    public:
        static constexpr int CAP = 1000; // Avoids magic numbers.
        std::string arr[CAP]; // Attribute (member variable)
        int head; //points to first element in q
        int tail; //points to last element in q
        int capacity; //keeps track of size

        Queue(); // constructor
        void enqueue(std::string val); // adds an element to the rear of the q
        void dequeue(); //removes an element from the front of the q
        std::string peek(); //check head element
        bool isEmpty(); 
        bool isFull();
        int size();
};

#endif