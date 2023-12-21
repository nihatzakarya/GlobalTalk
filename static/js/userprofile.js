"use strick";

let button = document.getElementById('b1');
let div = document.getElementById('div-form');
let sekil = document.getElementById('sekil');
let form = document.getElementById('form');

sekil.addEventListener('click', () => {
    div.classList.add("active");
    form.classList.add("active");
});

button.addEventListener('click', () => {
    div.classList.remove("active");
    form.classList.remove("active");
});

div.addEventListener('click', () => {
    div.classList.remove("active");
    form.classList.remove("active");
});