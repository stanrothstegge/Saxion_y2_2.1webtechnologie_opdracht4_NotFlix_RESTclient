function ValidateLoginInput() {

    var gebruikersnaam = $('#gebrnaam').val();
    var wachtwoord = $('#ww').val();

    var invoerCorrect = true;

    if (gebruikersnaam === "") {
        invoerCorrect = false;
    }
    if (wachtwoord === "") {
        invoerCorrect = false;
    }

    if (!invoerCorrect) {
        alert("U heeft één of meerdere gegevens niet ingevuld");
    } else {
        login(gebruikersnaam, wachtwoord)
    }

}

function login(gebruikersnaam, wachtwoord) {
    var login = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/api/authenticate",
        "method": "POST",
        "headers": {
            "content_type": "application/json"
        },
        "data": {
            name: gebruikersnaam,
            password: wachtwoord
        }
    };
    $.ajax(login).done(function (response) {
        console.log(response);

        localStorage.setItem("webtoken", response.token);
        localStorage.setItem("gebruikersnaam", gebruikersnaam);
        window.location.replace("index.html");
        alert("login succesvol");
    });
}

function Logout() {
    if(localStorage.getItem("webtoken") === null){
        alert("u bent niet ingelogd");
    }else{
        localStorage.removeItem("webtoken");
        localStorage.removeItem("gebruikersnaam");
        window.location.replace("login.html");
        alert("u bent uitgelogd")
    }
}
function checkToken() {
    if (localStorage.getItem("webtoken") === null) {
    } else {
        $('#navId').append($('<li><a href="./gebruikers.html">Gebruikers</a></li>'));
        $('#navId').append($('<li><a href="./profiel.html">Profiel</a></li>'))
    }
}

function ValidateSignupInput() {

    var voornaam = $('#voornm').val();
    var tussenvoegsel = $('#tussenv').val();
    var achternaam = $('#achternm').val();
    var gebruikersnaam = $('#gebrnaam').val();
    var wachtwoord = $('#ww').val();

    var invoerCorrect = true;

    if (voornaam === "") {
        invoerCorrect = false;
        alert("gebruikersnaam mag niet leeg zijn");
    }
    if (achternaam === "") {
        invoerCorrect = false;
        alert("achternaam mag niet leeg zijn");
    }
    if (gebruikersnaam === "") {
        invoerCorrect = false;
        alert("gebruikersnaam mag niet leeg zijn");
    }
    if (wachtwoord === "") {
        invoerCorrect = false;
        alert("wachtwoord mag niet leeg zijn");
    }

    if (!invoerCorrect) {
        alert("U heeft één of meerdere gegevens niet ingevuld");
    } else {
        signup(voornaam, tussenvoegsel, achternaam, gebruikersnaam, wachtwoord)
    }

}

function signup(voornaam, tussenvoegsel, achternaam, gebruikersnaam, wachtwoord) {
    var login = {
        "async": true,
        "crossDomain": true,
        "url": "http://localhost:8080/api/register",
        "method": "POST",
        "headers": {
            "content_type": "application/x-www-form-urlencoded"
        },
        "data": {
            voornaam: voornaam,
            tussenvoegsel: tussenvoegsel,
            achternaam: achternaam,
            gebruikersnaam: gebruikersnaam,
            wachtwoord: wachtwoord
        }
    };
    $.ajax(login).done(function (response) {
        console.log(response);

        alert("een account is aangemaakt");
        window.location.replace("login.html");
    });
}


function generateUserBlob(voornaam, tussenvoegsel, achternaam, gebruikersnaam) {
    var titleOhneSpaces = str = gebruikersnaam.replace(/\s/g, '');
    var id1 = "pt-1" + titleOhneSpaces;
    var id2 = "pt-2" + titleOhneSpaces;
    var id3 = "pt-3" + titleOhneSpaces;
    var $div = $("<div>", {id: id1, style: "margin-left: 17%", class: "col-sm-8"});
    var $div2 = $("<div>", { id: id2, style : "padding: 20px", class :"panel panel-default"});
    var $div3 = $("<div>", {html: '<h4>' + gebruikersnaam + '</h4>'});
    var padding = $("<h2>", { id: id3, class:"bold padding-bottom-7"});
    $(".row").append($div);
    $('#' + id1).append($div2);
    $('#' + id2).append($div3).append("<p>" + voornaam + " " + tussenvoegsel + " " + achternaam + " " + "</p>").append(padding);
}

function generateSingleUserBlob(voornaam, tussenvoegsel, achternaam, gebruikersnaam) {
    var titleOhneSpaces = str = gebruikersnaam.replace(/\s/g, '');
    var id1 = "pt-1" + titleOhneSpaces;
    var id2 = "pt-2" + titleOhneSpaces;
    var id3 = "pt-3" + titleOhneSpaces;
    var $div = $("<div>", {id: id1, style: "margin-left: 17%", class: "col-sm-8"});
    var $div2 = $("<div>", { id: id2, style : "padding: 20px", class :"panel panel-default"});
    var $div3 = $("<div>", {html: '<h4>' + gebruikersnaam + '</h4>'});
    var padding = $("<h2>", { id: id3, class:"bold padding-bottom-7"});
    $(".row").append($div);
    $('#' + id1).append($div2);
    $('#' + id2).append($div3).append("<p>" + voornaam + " " + tussenvoegsel + " " + achternaam + " " + "</p>").append(padding);
}

/**
 * Genereert een vierkant met movie data voor op de frontpage
 * @param descri
 * @param titel
 */
function generateMovieBlob(descri, titel, ttnummer) {
    //kan niet juist ophalen
    var rating = getAvgVotes(ttnummer);
    //var rating = 4;

    var titleOhneSpaces = str = titel.replace(/\s/g, '');
    //Genereer wat ids voor verschillende elementen zodat straks
    var id1 = "pt-1" + titleOhneSpaces;
    var id2 = "pt-2" + titleOhneSpaces;
    var id3 = "pt-3" + titleOhneSpaces;
    var posterId = "ps" + titleOhneSpaces;
    var $div = $("<div>", {id: id1, style: "margin: 4%", class: "col-sm-3"});
    var $div2 = $("<div>", { id: id2, style : "padding: 15px" , class :"panel panel-default"});
    var $div3 = $("<div>", {html: '<h4>' + titel + '</h4>'});
    //todo posters

    // var url = getPoster(titel)
    var $afbeelding= $("<img>", { id:posterId, src: "../pictures/logan.jpg", alt:"foto"});
    var padding = $("<h2>", { id: id3, class:"bold padding-bottom-7"});
    var DetailsButton = $('<button>', { class : "btn btn-primary" , html : 'Details'}).click(function () {
        window.location.replace("singleMovie.html?tt=" +ttnummer);
    });

    setTimeout(function(){
        downloadPoster(titleOhneSpaces, posterId)
    }, 5000);
    /**
     * Plak alle stukjes gegenereerde code aan elkaar.
     */
    $(".row").append($div);
    $('#' + id1).append($div2);
    $('#' + id2).append($div3).append($afbeelding).append("<p>" + descri + "</p>").append(padding).append(DetailsButton);
    $('#' + id3).append(rating + "<small>/5</small>");
}

function getRating(ttnummer) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/average/" + ttnummer,
        success: function (response) {
            //alert(response);
            console.log(response);

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error');
            console.log(errorThrown);
        },
        dataType: "json"
    });
}
function downloadPoster(titel, id) {
    //Als de pagina geladen is
    var request = 'http://api.myapifilms.com/imdb/idIMDB?title' + titel + '&token=ed2dac5e-fceb-4cdc-900f-f971cbd3261e';

    $.ajax({
        type: "GET",
        url: request,
        dataType: "jsonp",
        success: function (response) {
            //alert(response);
            if (response.data == !undefined) {
                var posterUrl = response.data.movies[0].urlPoster;
                $('#id').attr('src',posterUrl);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // alert('error');
        }
    });

}
function getPoster(movietitle) {

}

/**
 * Verstuur de beoordeling van de gebruiker over de film.
 */
function pushRating() {
    //haal het filmnummer op
    var ttnummer = window.location.href;
    var url = new URL(ttnummer);
    var paramValue = url.searchParams.get("tt");

    //haal de ingevoerde waarde op.
    var a = $( "#inputRating" ).val();
    //rond de rating af.
    var rounded = roundHalf(a);
    //todo push to server.
    sendRatingToServer(paramValue ,rounded);
}

function sendRatingToServer(paramValue, val) {
    var ttnummer = paramValue;
    var value = val;
    var token = localStorage.getItem("webtoken");
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/secure/ratings/" + ttnummer + "/" + value,
        headers: {
            "authorization": token
        },
        success: function (response) {
            //alert(response);
            console.log(response);
        },
        error: function (response, textStatus, errorThrown) {
            alert('error');
            //   console.log(response);
            //console.log(errorThrown);
        },
        dataType: "json"
    });
}
function roundHalf(num) {
    return Math.round(num*2)/2;
}
function getPoster(movietitle) {
    var title = movietitle.replace(/\s/g, '');
    //Als de pagina geladen is
    var request = 'http://api.myapifilms.com/imdb/idIMDB?title' + movietitle + '&token=ed2dac5e-fceb-4cdc-900f-f971cbd3261e';
    $.ajax({
        type: "GET",
        url: request,
        dataType: "jsonp",
        success: function (response) {
            alert(response);
            if (response.data == !undefined) {

                var posterUrl = response.data.movies[0].urlPoster;
            }
            $('#afbeelding').set
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error');
        }
    });
}

function getAvgVotes(ttnumber) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/average/" + ttnumber,
        success: function (response) {
            //alert(response);
            var movie = response;
            console.log("resul");
            console.log(movie);
            return movie;
        },
        error: function (response, textStatus, errorThrown) {
            alert('error');
            console.log(response);
            console.log(errorThrown);
        },
        dataType: "json"
    });
}