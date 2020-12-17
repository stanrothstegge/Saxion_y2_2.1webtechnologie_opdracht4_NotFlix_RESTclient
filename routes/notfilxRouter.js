var express = require('express');
var router = express.Router();
var Movies = require('./movies/movie');
var User = require('./users/user');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require("./../config.js");
var secret = new Buffer('yoursecret', 'base64').toString();
var secureRoutes = require('./secureRouter');





router.get('/movies/:id', function (req, res) {
    /**
     * req.params.id komt overeen met :id hierboven
     */
    Movies.findOne({ttnummer: req.params.id}, function (err, resultaat) {
        if (err) {
            console.log(err);
        } else {
            if (resultaat !== null) {
                res.status(200).json(resultaat);
            } else {
                res.status(204).json("Er bestaan geen films met dit id")
            }
        }

    });
});

router.post('/authenticate', function (req, res) {

    // find the user
    /**
     * Zoek alle gebruikers opp zodat we die kunnen vergelijken met de invoer.
     * Ommdat het veld voor wachtwoord standaard wordt verborgen moet deze nu expliciet aangegeven worden.
     */
    User.findOne({gebruikersnaam: req.body.name}, '+wachtwoord', function (err, user) {
        // check if password matches
        if(user === undefined || req.body.password === undefined || user === null || req.body.password == null){
            res.status(500);
        } else if (user.wachtwoord === req.body.password) {
            var token = jwt.sign({foo: user.gebruikersnaam}, config.secret.toString(), {
                //het token blijft 24 uur geldig
                expiresIn: 1440

            });
            // return the information including token as JSON
            res.status(200).json({
                success: true,
                message: 'Uw token is gevalideerd',
                token: token
            });
        } else {
            res.status(400).json("verkeerd wachtwoord");
        }
    });

});


router.get('/average/:ttnumber', function (req, res) {

    Movies.find({"ttnummer":req.params.ttnumber}, function (err, resultaat) {
        if(err){
            return err;
            res.status(513).json("er is een onbekende fout opgetreden")
        }
        if(!resultaat) { //er wordt gezocht naar een niet bestaande film
            res.status(204).json({succes: false, message: "er bestaat geen film voor deze zoekopdacht"})
        }
        else {
            // console.log(typeof req.param.film)

            var movie = resultaat[0];
            if(!movie){
                //-1 betekend geen ratiing
                res.status(200).json(-1);
            } else {
                var ratings = movie.beoordeling; //array

                /**
                 * Bereken het gemiddelde van alle beoordelingen.
                 */
                var total = 0;
                for (i = 0; i < ratings.length; i++) {
                    var cijfer = ratings[i].value;
                    var total = total + cijfer;
                }
                var gemiddelde = total /ratings.length;
                /**
                 * Rond het gemiddelde af naar iets wat we kunnen tonen met de sterren.
                 */
                var roundedRating = roundHalf(gemiddelde);

                res.status(200).json({ "average":roundedRating});
            }

        }
    });

    /**
     * Hulpfunctie om af te ronden op halve decimalen
     * @param num
     * @returns {number}
     */
    function roundHalf(num) {
        return Math.round(num*2)/2;
    }
});

router.post('/register', function (req, res) {
    var newUser = new User({
        voornaam: req.body.voornaam,
        tussenvoegsel: req.body.tussenvoegsel,
        achternaam: req.body.achternaam,
        gebruikersnaam: req.body.gebruikersnaam,
        wachtwoord: req.body.wachtwoord
    });
    newUser.save(function (err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log('succes');
        }
    });
    res.status(200).json("opgeslagen");
});

router.get('/movies', function (req, res) {
    Movies.find({}, function (err, resultaat) {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).json(resultaat);
        }
    });
});

router.get('/movies/:pagination(\d+)?', function (req, res) {
    var page = req.query.pagination;

    console.log(page);
    Movies.find({}, function (err, resultaat) {
        if (err) {
            console.log(err);
        }
        if (page !== undefined) {
            var ret = resultaat.slice(page, page + 1);
            res.status(200).json(ret);
        }

        else {
            res.status(200).json(resultaat);
        }
    });
});
router.use('/secure', secureRoutes);



module.exports = router;