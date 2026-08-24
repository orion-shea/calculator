/* ==========================================
   1. STATE MANAGEMENT & DOM REFERENCES
   ========================================== */

// Global state tracking object for the active mathematical expression
const expression = {
  current: '0',        // Raw expression string displayed to the user
  operatorCount: 0,    // Tracks active binary operators to prevent invalid evaluations
  balance: 0,          // Net parenthesis depth balance: '(' adds 1, ')' subtracts 1
  initialZero: true,   // Tracks if the display is in its untouched default state
  decimalUsed: false,  // Guards against multiple decimals in a single operand segment
};

// Target outer container for scrolling, and inner span for text node updates
const displayContainer = document.getElementById('display');
const displayText = document.querySelector('.display-text');

// Attach event delegation listeners for UI buttons and physical keyboard inputs
document.querySelector('.calculator-buttons').addEventListener('click', main);
document.addEventListener('keydown', main);

// Initialize screen display text on page load
displayText.textContent = expression.current;


/* ==========================================
   2. INPUT NORMALIZATION & VALIDATION
   ========================================== */

/**
 * Maps raw click events or physical keypresses into unified calculator symbols.
 * Returns null if the event source is invalid (e.g., clicking grid gaps).
 */
function normalize(event) {
  let buttonValue = '';
  
  if (event.type === 'click') {
    // Ignore clicks on empty gap spaces between buttons inside the CSS Grid container
    if (!event.target.matches('button')) return null;
    buttonValue = event.target.value || event.target.innerText;
  }
  
  if (event.type === 'keydown') {
    // Prevent 'Enter' key from re-triggering the last clicked/focused HTML button
    if (event.key === 'Enter') event.preventDefault();
    buttonValue = event.key;
  }

  // Convert physical keyboard shortcuts to display glyphs
  if (buttonValue === '*') return '×';
  if (buttonValue === '/') return '÷';
  if (buttonValue === 'Escape') return 'C';
  
  return buttonValue;
}

/**
 * Checks if a new character can legally be appended based on trailing character rules.
 * Prevents appending operators/decimals after dangling spaces, parens, or minuses.
 */
function permitInsertion(expr) {
  const lastInput = expr.current[expr.current.length - 1];
  return ![' ', '.', '(', '-'].includes(lastInput);
}

/**
 * Validates whether an expression is ready to send to the backend C++ parser.
 * Requires at least one binary operator and all opened parentheses to be closed.
 */
function permitEvaluation(expr) {
  return expr.operatorCount > 0 && expr.balance === 0;
}


/* ==========================================
   3. EXPRESSION HANDLERS
   ========================================== */

/**
 * Appends or replaces numeric digits in the current expression string.
 */
function handleNumber(expr, buttonValue) {
  // Overwrite the initial state '0' immediately upon first digit press
  if (expr.current === '0') {
    expr.current = buttonValue;
  } 
  // Replace leading zeros after operators/minuses (e.g., "5 + 0" -> "5 + 8")
  else if (
    expr.current[expr.current.length - 1] === '0' &&
    [' ', '-'].includes(expr.current[expr.current.length - 2])
  ) {
    expr.current = expr.current.slice(0, -1) + buttonValue;
  } 
  else {
    expr.current += buttonValue;
  }
}

/**
 * Handles arithmetic operator insertions, operator swaps, and negative numbers.
 */
function handleOperator(expr, buttonValue) {
  const lastChar = expr.current[expr.current.length - 1];
  
  // Handling when the previous character is a space (indicating a trailing operator)
  if (lastChar === ' ') {
    const secondLast = expr.current[expr.current.length - 2];
    
    // Special Case: Allow negative sign after multiply/divide (e.g., "5 × -")
    if (buttonValue === '-' && (secondLast === '×' || secondLast === '÷')) {
      expr.current += buttonValue;
      expr.operatorCount++;
    } 
    // Otherwise, replace the previous operator with the newly pressed one ("5 + " -> "5 × ")
    else {
      expr.current = expr.current.slice(0, -2) + buttonValue + ' ';
    }
  } 
  // Append standard spaced operator if preceding character passes validation
  else if (permitInsertion(expr)) {
    expr.current += ' ' + buttonValue + ' ';
    expr.operatorCount++;
    expr.decimalUsed = false; // Reset decimal flag for the new upcoming number
  }
}

/**
 * Manages open/close parenthesis insertion and updates the balance counter.
 */
function handleParenthesis(expr, buttonValue) {
  const lastInput = expr.current[expr.current.length - 1];
  
  if (buttonValue === '(' && lastInput !== '.') {
    if (expr.initialZero) {
      expr.current = buttonValue;
      expr.initialZero = false;
    } else {
      expr.current += buttonValue;
    }
    expr.balance++; // Increments open parenthesis counter
    expr.decimalUsed = false;
  } 
  else if (buttonValue === ')') {
    // Only permit closing paren if there is a matching open paren available
    if (permitInsertion(expr) && expr.balance > 0) {
      expr.current += buttonValue;
      expr.balance--; // Decrements open parenthesis counter
      expr.decimalUsed = false;
    }
  }
}

/**
 * Handles Backspace operations, clearing multi-character operator pads and updating state counters.
 */
function handleBackspace(expr) {
  const lastInput = expr.current[expr.current.length - 1];

  // Reset to default '0' state when deleting the final remaining character
  if (expr.current.length === 1) {
    expr.initialZero = true;
    expr.decimalUsed = false;
    expr.balance = 0;
    expr.operatorCount = 0;
    expr.current = '0';
    return;
  }
  
  // Deleting an operator removes 3 characters due to space buffers (" + ")
  if (lastInput === ' ') {
    expr.current = expr.current.slice(0, -3);
    expr.operatorCount--;
    return;
  }
  
  // Maintain state flag accuracy when deleting boundary characters
  if (lastInput === '.') expr.decimalUsed = false;
  if (lastInput === '(') expr.balance--;
  if (lastInput === ')') expr.balance++;
  
  expr.current = expr.current.slice(0, -1);
}


/* ==========================================
   4. API COMMUNICATIONS & DISPATCHER
   ========================================== */

/**
 * Sends sanitised math string payload to the C++ backend endpoints.
 */
async function api(payloadExpr) {
  try {
    const response = await fetch(`/calculate?expression=${encodeURIComponent(payloadExpr)}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.text();
  } catch (error) {
    console.error('Fetch failed:', error);
    return 'Error';
  }
}

/**
 * Main application dispatcher function called on clicks and keypresses.
 */
async function main(event) {
  const buttonValue = normalize(event);
  
  // Early exit for unmapped keys or clicks on non-button elements
  if (!buttonValue) return;

  // Clear display if last result was invalid or produced an error string
  if (expression.current === 'inf' || expression.current === 'nan' || expression.current === 'Error') {
    expression.current = '0';
    expression.initialZero = true;
  }

  // Filter out unsupported physical keyboard inputs (e.g., Shift, letters, function keys)
  const validKeys = ['0','1','2','3','4','5','6','7','8','9','+','-','×','÷','.','(',')','Backspace','Enter','=','C','c'];
  if (!validKeys.includes(buttonValue)) return;

  switch (buttonValue) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9':
      expression.initialZero = false;
      handleNumber(expression, buttonValue);
      break;

    case '.':
      if (!expression.decimalUsed && permitInsertion(expression)) {
        expression.decimalUsed = true;
        expression.current += buttonValue;
      }
      break;

    case '+': case '×': case '÷':
      handleOperator(expression, buttonValue);
      break;

    case '-':
      if (expression.current === '0') {
        expression.current = buttonValue;
        expression.initialZero = false;
      } else if (expression.current[expression.current.length - 1] === '(') {
        expression.current += buttonValue;
      } else {
        handleOperator(expression, buttonValue);
      }
      break;

    case '(': case ')':
      handleParenthesis(expression, buttonValue);
      break;

    case 'Backspace':
      handleBackspace(expression);
      break;

    case 'C': case 'c':
      expression.current = '0';
      expression.initialZero = true;
      expression.decimalUsed = false;
      expression.balance = 0;
      expression.operatorCount = 0;
      break;

    case '=': case 'Enter':
      // Detect implicit multiplication patterns to increment operator count (e.g. 2(3) or (2)(3))
      if (expression.current.includes(')(')) expression.operatorCount++;
      if (/\d\(/.test(expression.current)) expression.operatorCount++;
      if (/\)\d/.test(expression.current)) expression.operatorCount++;

      if (permitEvaluation(expression)) {
        // Pre-process display glyphs and implicit math syntax into C++ standard syntax
        let payload = expression.current
          .replaceAll('×', '*')
          .replaceAll('÷', '/')
          .replaceAll('-(', '(-1)*(')
          .replaceAll('(-', '(-1*')
          .replaceAll(')(', ')*(')
          .replace(/(\d)\(/g, '$1*(') // Converts 2(3) -> 2*(3)
          .replace(/\)(\d)/g, ')*$1') // Converts (2)3 -> (2)*3
          .replaceAll(' ', '');       // Strip layout space buffers

        // Await C++ server evaluation and sync application state
        expression.current = await api(payload);
        expression.operatorCount = 0;
        expression.balance = 0;
        expression.decimalUsed = expression.current.includes('.');
        expression.initialZero = expression.current === '0';
      }
      break;
  }

  // Render updated expression string inside the inner text span
  displayText.textContent = expression.current;
  
  // Auto-scroll outer container horizontally to keep the latest typed character visible
  displayContainer.scrollLeft = displayContainer.scrollWidth;
}