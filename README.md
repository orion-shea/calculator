# 🧮 C++ Powered Full-Stack Calculator

A full-stack, web-based mathematical calculator powered by a custom **C++ REST API engine**. Instead of relying on client-side evaluation, expression strings are sanitized in JavaScript and evaluated by a custom C++ backend using Dijkstra's **Shunting-Yard Algorithm**, backed by custom **Stack** and **Circular Queue** data structure implementations.

![Calculator Screenshot](https://github.com/user-attachments/assets/f7cbbaff-826a-4283-a470-d1eed919cb16)

---

## ⚡ Architecture Overview

```text
┌────────────────────────────────┐         HTTP GET         ┌─────────────────────────────────┐
│      Browser / Client (JS)     │ ──────────────────────> │        C++ REST Server          │
│                                │  /calculate?expression= │                                 │
│  • Event Handling & Input      │                          │  • Static Asset File Server    │
│  • Parenthesis & Decimal Guard │ <────────────────────── │  • Shunting-Yard Algorithm     │
│  • Implicit Multiplier Fix     │       "12.5" (Text)      │  • Custom Stack & Ring Queue   │
└────────────────────────────────┘                          └─────────────────────────────────┘
```

The system is split cleanly between a client-side interface and a C++ evaluation engine.

### 1. Client Interface

**Files:** `index.html`, `style.css`, `script.js`

* Uses **CSS Grid** and **Flexbox** for responsive layouts across mobile and desktop.
* Manages calculator input state, including:

  * Parenthesis balance
  * Operator constraints
  * Double-decimal prevention
* Normalizes implicit mathematical syntax before sending expressions to the backend:

  * `2(3)` → `2*(3)`
  * `-(x)` → `(-1)*(x)`

### 2. Backend Engine

**Files:** `main.cpp`, `calculator.cpp`, `data_structures.cpp`

* Built using [`cpp-httplib`](https://github.com/yhirose/cpp-httplib) to serve static web assets and handle API routes.
* Evaluates infix expressions by converting them to **Reverse Polish Notation (RPN)** using the **Shunting-Yard algorithm**.
* Uses custom, fixed-capacity **Stack** and **Circular Ring-Buffer Queue** data structures rather than STL containers.

---

## Getting Started

### Prerequisites

To compile and run the backend server, you will need:

* A **C++ compiler** with C++11 support or higher:

  * `g++`
  * `clang++`
  * MSVC
* `make` or `cmake` *(optional)*

### Build and Run

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/cpp-web-calculator.git
cd cpp-web-calculator
```

#### 2. Compile the server

```bash
g++ -std=c++11 main.cpp calculator.cpp data_structures.cpp -o calculator_server
```

#### 3. Start the application

```bash
./calculator_server
```

#### 4. Open the calculator

Navigate to:

```text
http://localhost:8080
```

---

## Project Structure

| File                  | Role & Key Responsibilities                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main.cpp`            | Server entry point. Handles HTTP routing, static asset serving (`/`, `/style.css`, `/script.js`), and API request dispatching.                          |
| `calculator.cpp`      | Core arithmetic engine implementing Dijkstra's Shunting-Yard algorithm, operator precedence parsing, unary minus detection, and RPN postfix evaluation. |
| `data_structures.cpp` | Custom LIFO Stack and FIFO circular ring-buffer Queue implementations.                                                                                  |
| `script.js`           | Client UI state management, button event delegation, physical keyboard normalization, and asynchronous API communication using `fetch()`.               |
| `style.css`           | Mobile-first layout styling, custom scrollbar handling, CSS variables, and dynamic button layouts.                                                      |
| `index.html`          | Semantic UI structure for the calculator display and button grid.                                                                                       |

---

## Key Algorithms & Logic

### 1. Infix to Postfix — Shunting-Yard Algorithm

To correctly handle order of operations (**PEMDAS**) without relying on built-in expression evaluation, the engine converts infix expressions into **Reverse Polish Notation (RPN)**.

The algorithm works as follows:

* **Operands** pass directly to the output Queue.
* **Operators** are pushed onto the evaluation Stack after comparing operator precedence.
* **Parentheses** control when operators are flushed from the Stack to preserve grouping and precedence.

For example:

```text
Infix:   3 + 4 * 2
RPN:     3 4 2 * +
```

### 2. Postfix Evaluation

Once an expression has been converted to RPN, the backend evaluates the postfix expression using a Stack.

For each token:

1. Operands are pushed onto the Stack.
2. When an operator is encountered, the required operands are popped.
3. The operation is performed.
4. The resulting value is pushed back onto the Stack.
5. The final value remaining on the Stack is returned as the result.

Example:

```text
RPN:       3 4 2 * +
Evaluation:
           4 × 2 = 8
           3 + 8 = 11

Result:    11
```

The final result is returned as a `double` and sent back to the browser through the REST API.

---

## Key Features

* C++ REST API backend
* Dijkstra's Shunting-Yard algorithm
* Reverse Polish Notation evaluation
* Custom Stack implementation
* Custom Circular Queue implementation
* Unary minus handling
* Operator precedence
* Parenthesis validation
* Implicit multiplication normalization
* Decimal validation
* Keyboard input support
* Responsive mobile-first UI
* Static asset serving directly from the C++ server
* Asynchronous JavaScript API requests

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.
