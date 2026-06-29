/*
const allBtns = document.querySelectorAll('.button-grid button');
for(let i = 0; i < allBtns.length; i++) {
    console.log(allBtns[i].id, allBtns[i].value);
}
*/
document.addEventListener('click', f);

function f(event) {
    console.log(event.target);
    console.log(event.target.id);
    console.log(event.target.value);
}