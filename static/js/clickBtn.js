function clickButton() {
    var element = document.getElementById('clickText');
    var value = element.innerHTML;

    ++value;

    console.log(value);
    document.getElementById('clickText').innerHTML = value;
}