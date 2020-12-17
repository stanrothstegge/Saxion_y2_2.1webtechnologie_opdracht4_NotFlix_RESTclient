/**
 * SecureRouter
 * Alle calls binnen deze router alleen toegankelijk voor geauthoriseerde gebruikers.
 */
var express = require('express');
var secureRouter = express.Router();
var Movie = require('./movies/movie');
var User = require('./users/user');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require("./../config.js");
//todo nog afschermen

secureRouter.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['authorization']


    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret.toString(), function (err, decoded) {
            if (err) {
                console.log(err)
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();

            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

secureRouter.get('/users/:gebruikersnaam', function (req, res) {
    User.findOne({gebruikersnaam: req.params.gebruikersnaam}, function (err, resultaat) {
        if (err) {
            console.log(err);
        } else {
            if (resultaat !== null) {
                res.status(200).json(resultaat);
            } else {
                res.status(204).toJSON("Er bestaan geen gebruikers met deze gebruikersnaam")
            }
        }

    });
});


/**
 * returnt een lijst met alle gebruikers.
 * Alle standaard atributen worden meegegeven.
 */
secureRouter.get('/users', function (req, res) {
    User.find({}, function (err, resultaat) {
        if (err) {
            console.log(err);

        } else if (!resultaat) {
            res.status(204);
        } else {
            res.status(200).json(resultaat);
            console.log(resultaat)
        }
    });
});


secureRouter.get('/ratings/:film', function (req, res) {
    Movie.find({ttnummer: req.params.film}, function (err, resultaat) {
        if (err) {
            console.log(err)
            res.status(513).json("er is een onbekende fout opgetreden")
        }
        if (!resultaat) { //er wordt gezocht naar een niet bestaande film
            res.status(204).json({succes: false, message: "er bestaat geen film voor deze zoekopdacht"})
        } else {
            console.log(resultaat);
            var ArrayToObject = resultaat[0];
            //array met alle
            var beoordelingen = ArrayToObject.beoordeling;
            //
            var total = 0;
            for (i = 0; i < beoordelingen.length; i++) {
                var cijfer = beoordelingen[i].value;
                var total = total + cijfer;
            }
            var gemiddelde = total / beoordelingen.length;
            //stuur het gemiddellde terug met statuscode 200 (ok)
            res.status(200).json(gemiddelde);
        }
    });
});

secureRouter.delete('/ratings/:film', function (req, res) {

    var token = req.headers['authorization'];
    var decoded = jwt.verify(token, config.secret);
    var username = decoded.foo;

    Movie.find({ttnummer: req.params.film}, function (err, resultaat) {
        if (err) {
            console.log(err)
            res.status(513).json("er is een onbekende fout opgetreden")
        }
        if (!resultaat) { //er wordt gezocht naar een niet bestaande film
            res.status(204).json({succes: false, message: "Er bestaat geen rating voor deze film"});
        } else {
            console.log(resultaat);
            var data = resultaat[0]
            var ide = data._id;
            var listWithRatings = data.beoordeling;

            var teVerwijderenRating
            for (i = 0; i < listWithRatings.length; i++) {
                var singlerating = listWithRatings[i];
                if (singlerating.userId == decoded) {
                    teVerwijderenRating =singlerating;
                    Movie.update(
                        //can't believe this works but looks clean
                        teVerwijderenRating, { $pull: teVerwijderenRating});
                }
            }


            res.status(200).json("rating verwijderd");
        }
    });
});

/**
 * Via deze call kan een gebruiker een film beoordelen
 * param1 (ttnummer) : id van de film
 * param2 (ratingValue) : waarde tussen 0.5 - 5
 */
secureRouter.post('/ratings/:film/:value', function (req, res) {
    //Id dat mongo genereerd

    if (!req.params.value >= 0.5 && req.params.value <= 5) {
        res.status(400);
    }
    var generatedId;
    var titel = "";
    //rating van de gebruiker 0.5 tm 5
    //Zoek film beoordeeld door gebruiker
    var token = req.headers['authorization'];


    Movie.find({"ttnummer": req.params.film}, function (err, resultaat) {
        if (!resultaat | resultaat == undefined) {
            res.status(204).json({success: false, message: 'er bestaat geen film in de database met dit ttnumber'});
        } else if (err) {
            console.log(err);
            console.status(300);
        } else {
            console.log(resultaat);
            var obj = resultaat[0];
            generatedId = obj._id;
            titel = obj.titel;
            //Voeg beoordeling to aan beoordeling array
            var user;


            var decoded = jwt.verify(token, config.secret);

            User.find({"gebruikersnaam": decoded.foo}, function (err, resul) {
                if (!resul) {
                    //todo betere error verzinnen
                    res.status(201).json('er ging iets mis' + decoded.foo);

                    console.log("iets mis");
                    console.log(nickname)
                } else {
                    user = decoded.foo
                    Movie.update(
                        {_id: generatedId}, {
                            $addToSet: {
                                'beoordeling': {
                                    'userId': user,
                                    'value': req.params.value
                                }
                            }
                        }, function (err) {
                        });
                    res.status(200).json("rating for " + titel + " beoordeeld met " + req.params.value);
                }
            });

        }
    });
});

module.exports = secureRouter;
