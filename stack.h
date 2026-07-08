#pragma once

class Stack {
    public:
        //Making an array with a fixed size b/c users won't use too many operators.
        static constexpr int CAP = 100; // Avoids magic numbers.
        /*
            "static constexpr" makes it a compile-time constant
            It won't run if I declare as int, etc.
        */
        char arr[CAP]; // Attribute (member variable)
        int topIndex; // Track the index.

        Stack(); //constructor
        void push(char val);
        void pop();
        char top();
        bool isEmpty();
        bool isFull();
        int size();
};