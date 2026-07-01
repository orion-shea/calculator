/*
const allBtns = document.querySelectorAll('.calculator-buttons button');
for(let i = 0; i < allBtns.length; i++) {
    console.log(allBtns[i].id, allBtns[i].value);
}
*/
//document.querySelector('.calculator-buttons').addEventListener('click', f);
document.addEventListener('click', f);
document.addEventListener('keydown', f);

let acc = 0;
document.getElementById('display').innerHTML = acc;

function f(event) {
    console.log(event);

    let variable;
    if(event.type === 'click') {
        variable = event.target.value;
    }
    if(event.type === 'keydown') {
        variable = event.key;
    }

    console.log(variable);
    
    if(variable === '+') {
        console.log('add');
        document.getElementById('display').innerHTML += ' + ';
    }
    else if(variable === '-') {
        console.log('subtract');
        document.getElementById('display').innerHTML += ' - '; 
    } 
    else if(variable === '*') {
        console.log('multiply'); 
    } 
    else if(variable === '/') {
        console.log('divide');
    } 
    else if(variable === '=') {
        console.log('equals');
    }
    else if(variable === 'c' || variable === 'C') {
        console.log('clear');
        acc = 0;
        document.getElementById('display').innerHTML = acc;
    }
    else if(variable === 'Backspace') {
        console.log('backspace: ' + acc);
        if(acc.length === 1) {
            acc = 0;
        }
        else {
            acc = acc.toString().slice(0, -1);
        }
        document.getElementById('display').innerHTML = acc;
    } 
    else {
        if(!isNaN(variable)) {
            if(document.getElementById('display').innerHTML === '0') {
                acc = variable;
                document.getElementById('display').innerHTML = variable;
            }
            else {
                acc += variable;
                document.getElementById('display').innerHTML += variable;
            }
            
        }
    }
}