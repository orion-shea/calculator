# 🧮 C++ Powered Full-Stack Calculator

A full-stack, web-based mathematical calculator powered by a custom **C++ REST API engine**. Instead of relying on client-side evaluation, expression strings are sanitized in JavaScript and evaluated on a custom C++ backend using Dijkstra's **Shunting-Yard Algorithm** backed by custom **Stack** and **Circular Queue** data structure implementations.

<img width="789" height="806" alt="Screenshot 2026-08-24 at 17 06 32" src="https://github.com/user-attachments/assets/f7cbbaff-826a-4283-a470-d1eed919cb16" />

---

## ⚡ Architecture Overview

┌────────────────────────────────┐         HTTP GET         ┌─────────────────────────────────┐
│     Browser / Client (JS)      │ ───────────────────────> │         C++ REST Server         │
│  - Event Handling & Input      │   /calculate?expression= │  - Static Asset File Server     │
│  - Parenthesis & Decimal Guard │ <─────────────────────── │  - Shunting-Yard Algorithm      │
│  - Implicit Multiplier Fix     │       "12.5" (Text)      │  - Custom Stack & Ring Queue    │
└────────────────────────────────┘                          └─────────────────────────────────┘

The system is split cleanly between a client-side interface and a high-performance C++ evaluation engine:

1. **Client Interface (`index.html`, `style.css`, `script.js`)**: 
   - Uses **CSS Grid** and **Flexbox** to handle responsive layouts across mobile and desktop.
   - Manages input state (parenthesis balance, operator constraints, and double-decimal prevention).
   - Normalizes implicit math syntax (e.g., converting `2(3)` into `2*(3)` and `-(x)` into `(-1)*(x)`) before network delivery.

2. **Backend Engine (`main.cpp`, `calculator.cpp`, `data_structures.cpp`)**:
   - Built on top of `cpp-httplib` to serve static web assets and handle API routes.
   - Evaluates infix expressions by converting them to Reverse Polish Notation (RPN) via the **Shunting-Yard algorithm**.
   - Leverages hand-crafted, fixed-capacity **Stack** and **Circular Ring-Buffer Queue** data structures rather than STL containers.

---

## 🚀 Getting Started

### Prerequisites

To compile and run the backend server, you will need:
* **C++ Compiler** with C++11 support or higher (`g++`, `clang++`, or MSVC)
* **Make** or **CMake** (optional)

### Build & Run

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/cpp-web-calculator.git](https://github.com/your-username/cpp-web-calculator.git)
   cd cpp-web-calculator

   Compile the server:
Bash

g++ -std=c++11 main.cpp calculator.cpp data_structures.cpp -o calculator_server

2. **Compile the server:**
g++ -std=c++11 main.cpp calculator.cpp data_structures.cpp -o calculator_server

3. **Start the application:**
./calculator_server

4. **Start the application:**
Open your browser and navigate to http://localhost:8080.

File,Role & Key Responsibilities
main.cpp,"Server entry point. Handles HTTP routing, static asset serving (/, /style.css, /script.js), and API request dispatching."
calculator.cpp,"Core arithmetic engine implementing Dijkstra's Shunting-Yard algorithm (pemdas), operator precedence parsing, unary minus detection, and RPN postfix evaluation (evaluatePostfix)."
data_structures.cpp,Custom LIFO Stack and FIFO circular ring-buffer Queue memory buffer implementations.
script.js,"Client UI state management, button event delegation, physical keyboard key normalization, and asynchronous API communication (fetch)."
style.css,"Mobile-first layout styling featuring custom scrollbar hiding, CSS variables, and dynamic button layouts."
index.html,Semantic UI structure for the screen display and calculator button grid.

🛠️ Key Algorithms & Logic
1. Infix to Postfix (Shunting-Yard)

To handle order of operations (PEMDAS) correctly without relying on standard library evaluation hacks, the engine parses expressions into Reverse Polish Notation:

    Operands pass straight to the output Queue.

    Operators are pushed onto an evaluation Stack after comparing precedence hierarchy.

    Parentheses force stack flushing to preserve precedence grouping.

2. Postfix Evaluation

Once converted to RPN (e.g., 3 4 2 * +), the evaluation loop pops operands off the Stack, applies operators sequentially, and returns the simplified double precision float back to the server router.
📄 License

Distributed under the MIT License. See LICENSE for details.
