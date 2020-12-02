function main() {
    document.getElementById("napis")
        .addEventListener("contextmenu", function (event) {
            event.preventDefault();
        })
    document.getElementById("napis")
        .addEventListener("click", function (event) {
            event.preventDefault();
        })
    document.getElementById("napis")
        .addEventListener("onmouseup", function (event) {
            event.preventDefault();
        })
}
function kowalskiOpcje() {
    var select = document.getElementById("wiek")
    for (x = 10; x < 21; x++) {
        var option = document.createElement("option")
        if (x == 10)
            option.setAttribute('selected', "selected")
        option.value = x;
        option.innerText = x;
        select.appendChild(option);
    }
}