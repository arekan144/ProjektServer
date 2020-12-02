


var express = require("express");
const { send } = require("process");
var app = express()
var PORT = process.env.PORT || 3000;

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

var zalogowany = false;
var kto = "";
var admin = false;

//tablica użytkowników

var users = [
    { id: 1, log: "AAA", pass: "PASS1", wiek: 10, uczen: "checked", plec: "m" },
    { id: 2, log: "BBB", pass: "PASS2", wiek: 13, uczen: "checked", plec: "k" },
    { id: 3, log: "CCC", pass: "PASS3", wiek: 17, uczen: "checked", plec: "m" },
    { id: 4, log: "111", pass: "111", wiek: 15, uczen: "unchecked", plec: "m" },
    { id: 5, log: "bbb", pass: "bbb", wiek: 17, uczen: "unchecked", plec: "k" },
    { id: 6, log: "ccc", pass: "ccc", wiek: 14, uczen: "unchecked", plec: "k" },
]

function otrzymaj_blok(liczba_x, liczba_y, tablica) {
    switch (liczba_y) {
        case 0: return 'id: ' + tablica[liczba_x].id;

        case 1: return 'user: ' + tablica[liczba_x].log + " - " + tablica[liczba_x].pass;

        case 2:
            var input = '<input disabled type="checkbox"';
            if (tablica[liczba_x].uczen == 'checked') input = input + "checked>";
            else input = input + ">"
            return 'uczeń: ' + input;

        case 3:
            return 'wiek: ' + tablica[liczba_x].wiek;

        case 4: return 'płeć: ' + tablica[liczba_x].plec;

        default: console.log("Coś poszło nie tak"); break;
    }
    return "ERROR";
}
function otrzymaj_dlugosc(liczba_y) {
    switch (liczba_y) {
        case 0: return 150;

        case 1: return 200;

        case 2: return 150;

        case 3: return 150;

        case 4: return 150;

        default: return 50;
    }

}

function otrzymaj_blok_tabeli(x, o, top, tablica) {
    const sto = 100;
    if (o == 0) {
        var top = (x + 0.5) * (sto / 2) + x * 5 + "px";
        var div = '<div style="position: absolute;top: ' + top + ';">';
    }
    if (o == 1) {
        var div = '<div style="position: absolute;top: ' + top + 'px;">';
    }


    var wczesniejsza_dlugosc = 0;
    for (var y = 0; y < 5; y++) {
        var dlugosc = otrzymaj_dlugosc(y);
        wczesniejsza_dlugosc = wczesniejsza_dlugosc + otrzymaj_dlugosc(y - 1)
        var left = wczesniejsza_dlugosc + y * 5 + "px";
        var kom = '<div class ="tabela" style="left: ' + left + ';width: ' + dlugosc + 'px"><div class="text">' + otrzymaj_blok(x, y, tablica) + '</div></div>';
        div = div + kom;
    }
    div = div + "</div>"
    return div;
}




app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/main.html")
})

app.get('/register', function (req, res) {
    res.sendFile(__dirname + "/static/register.html")
})
app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/static/login.html")
})

app.post('/login', function (req, res) {
    var poprawnylogin = false;
    var pass = "";
    var numer = 0;
    for (var x = 0; x < users.length; x++) {
        if (users[x].log == req.body.login) {
            poprawnylogin = true;
            pass = users[x].pass;
            numer = x;
        }
    }
    if (!poprawnylogin || pass != req.body.password) {
        res.send("Nie poprawny login lub hasło!")
    }
    else if (poprawnylogin && kto == req.body.login) {
        res.send("Ten użytkownik jest zalogowany.")
    }
    else {
        kto = users[numer].log;
        if (users[numer].uczen == "checked") {
            zalogowany = true;
            admin = true;
        }
        else {
            zalogowany = true;
            admin = false;
        }
        res.redirect('/admin')
    }
})

app.post('/register', function (req, res) {
    var z = 0;
    for (var x = 0; x < users.length; x++) {
        if (users[x].log == req.body.login) {
            z++;
        }
    }
    if (z == 1) {
        res.send("Już istnieje taki użytkownik.")
    } else {
        var che = "";
        if (req.body.uczen == null) {
            che = "unchecked";
        }
        else {
            che = "checked";
        }
        users.push({ id: users.length + 1, log: req.body.login, pass: req.body.password, wiek: eval(req.body.wiek), uczen: che, plec: req.body.plec });
        res.send("witaj " + req.body.login + ", jesteś zarejestrowany")
    }
})


app.get('/logoff', function (req, res) {
    zalogowany = false;
    admin = false;
    res.redirect('/')
    kto = "";
})


app.get('/admin', function (req, res) {
    if (admin && zalogowany) {
        res.sendFile(__dirname + "/static/admin.html")
    }
    else {
        res.sendFile(__dirname + "/static/adminNIE.html")
    }

});
app.get('/show', function (req, res) {
    if (admin && zalogowany) {
        console.log(users)
        res.sendFile(__dirname + "/static/admin.html")
        var head = '<meta charset="UTF-8"><meta name = "viewport" content = "width=device-width, initial-scale=1.0" ><title>Show</title><link rel="stylesheet" href="css/admin.css">'
        const sto = 100;
        var menu = '<div class="menu"><a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a></div>';
        var main = '<div style="position: absolute; top:' + (sto - 50) + 'px">'

        for (var x = 0; x < users.length; x++) {
            main = main + otrzymaj_blok_tabeli(x, 0, 0, users)
        }
        main = main + "</div>"
        var all = head + menu + main;
        res.send(all)
    }
    else {
        res.sendFile(__dirname + "/static/adminNIE.html")
    }
});



function oddaj_strone_sposortowaną(stan) {

    const sto = 100;

    var main = '<div style="position: absolute; top:' + (sto - 50) + 'px">'

    var posort = [...users];


    if (stan == 1) {
        posort.sort(function (a, b) {
            return parseFloat(a.wiek) - parseFloat(b.wiek);
        })
    }

    if (stan == 2) {
        posort.sort(function (a, b) {
            return parseFloat(b.wiek) - parseFloat(a.wiek);
        })

    }

    for (var x = 0; x < users.length; x++) {
        main = main + otrzymaj_blok_tabeli(x, 0, 0, posort)
    }
    var all = main + "</div>"

    return all;

}

app.get('/sort', function (req, res) {
    if (admin && zalogowany) {
        var menu = '<div class="menu"><a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a></div>';
        var head = '<meta charset="UTF-8"><meta name = "viewport" content = "width=device-width, initial-scale=1.0" ><title>Sort</title><link rel="stylesheet" href="css/admin.css">'
        var radio = '<form action="/sort" onchange="this.submit()" method="POST" ><label><input type="radio" name="war" value="1" >rosnąco</label><label><input type="radio" name="war" value="2">malejąco</label></form>'

        var all = head + menu + '<div style:"position: absolute; top:30px;">' + radio + oddaj_strone_sposortowaną(0) + '</div>'
        res.send(all)

    }
    else {
        res.sendFile(__dirname + "/static/adminNIE.html")
    }
});
app.post('/sort', function (req, res) {
    if (admin && zalogowany) {
        var menu = '<div class="menu"><a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a></div>';
        var radio1 = '<label><input type="radio" name="war" value="1" >rosnąco</label>'
        var radio2 = '<label><input type="radio" name="war" value="2">malejąco</label>'

        if (req.body.war == 1)
            radio1 = '<label><input type="radio" name="war" value="1" checked>rosnąco</label>'
        if (req.body.war == 2)
            radio2 = '<label><input type="radio" name="war" value="2" checked>malejąco</label>'

        var head = '<meta charset="UTF-8"><meta name = "viewport" content = "width=device-width, initial-scale=1.0" ><title>Show</title><link rel="stylesheet" href="css/admin.css">'
        var radio = '<form action="/sort" onchange="this.submit()" method="POST" >' + radio1 + radio2 + '</form>'
        if (req.body.war == 1)
            radio = '<div style:"position: absolute; top:30px;">' + radio + oddaj_strone_sposortowaną(1) + "</div>"
        if (req.body.war == 2)
            radio = '<div style:"position: absolute; top:30px;">' + radio + oddaj_strone_sposortowaną(2) + "</div>"
        if (req.body.war == null)
            res.redirect('/sort')
        var all = head + menu + radio
        res.send(all)
    }
    else {
        res.sendFile(__dirname + "/static/adminNIE.html")
    }
});


app.get('/gender', function (req, res) {
    if (admin && zalogowany) {

        res.sendFile(__dirname + "/static/admin.html")
        var head = '<meta charset="UTF-8"><meta name = "viewport" content = "width=device-width, initial-scale=1.0" ><title>Gender</title><link rel="stylesheet" href="css/admin.css">'
        const sto = 100;
        var menu = '<div class="menu"><a href="/sort">sort</a> <a href="/gender">gender</a> <a href="/show">show</a></div>';
        var main = '<div id="main" style="position: absolute; top:' + (sto - 50) + 'px">'
        var kobiety = '';
        var mezczyzni = '';


        var kobiety_top = 0;
        var mezczyzni_top = 0;

        var k = 0;
        var m = 0;
        for (var x = 0; x < users.length; x++) {

            if (users[x].plec == "m") {
                mezczyzni += otrzymaj_blok_tabeli(x, 1, mezczyzni_top, users);
                mezczyzni_top += (sto / 2) + 5;
                m++;
            }
            else {
                kobiety += otrzymaj_blok_tabeli(x, 1, kobiety_top, users);
                kobiety_top += (sto / 2) + 5;
                k++;
            }
        }

        kobiety = '<div id="kobiety" style="position: absolute;top:' + 25 + 'px">' + kobiety + "</div >"
        mezczyzni = '<div id="mezczyzni" style="position: absolute;top:' + (50 * (k + 1)) + 'px"">' + mezczyzni + "</div >"
        main = main + kobiety + mezczyzni + "</div>"

        var all = head + menu + main;
        res.send(all)
    }
    else {
        res.sendFile(__dirname + "/static/adminNIE.html")
    }
});



app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
