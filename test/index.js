/**
 * Created by Gebruiker on 28-10-2017.
 */
var chai = require('chai');
var chaiHttp = require('chai-http');
var ap = require('../server');
var should = chai.should();
chai.use(chaiHttp);
var movie = require('../routes/movies/movie');
var request = require('supertest');
var server ='http://localhost:8080';


describe("Movie Test Suite", function () {
    describe("/movies GET", function () {
        it('should - print array met films ', function (done) {
            request(server)
                .get('/api/movies')
                .expect(200)
                .end(function (err, res) {
                    //De output is een lijst dus,
                    res.body.should.be.a('array');


                });
            done();
        });

        it('should - have right properties', function (done) {
            request(server)
                .get('/api/movies')
                .expect(200)
                .end(function (err, res) {
                    //De output is een lijst dus,
                    var array = res.body;
                    for (i = 0; i < array.length; i++) {
                        res.body[i].should.have.property('_id');
                        res.body[i].should.have.property('ttnummer');
                        res.body[i].should.have.property('titel');
                        res.body[i].should.have.property('jaar');
                        res.body[i].should.have.property('lengte');
                        res.body[i].should.have.property('regiseur');
                    }

                });
            done();
        });



        it('should - not exist year ( Bad Weather test)', function (done) {
            request(server)
                .get('/api/movies')
                .expect(200)
                .end(function (err, res) {
                    //De output is een lijst dus,
                    var array = res.body;
                    for (i = 0; i < array.length; i++) {
                        res.body[i].jaar.should.not.equal(4444);
                    }

                });
            done();
        });

        it('should - not have property ', function (done) {
            request(server)
                .get('/api/movies')
                .expect(200)
                .end(function (err, res) {
                    //De output is een lijst dus,
                    var array = res.body;
                    for (i = 0; i < array.length; i++) {
                        res.body[i].should.not.have.property('aewfe');
                    }

                });
            done();
        })


        it('should - exist in 2016', function (done) {
            request(server)
                .get('/api/movies')
                .expect(200)
                .end(function (err, res) {
                    //De output is een lijst dus,
                    var array = res.body;
                    for (i = 0; i < array.length; i++) {
                        res.body[i].jaar.should.equal(2016);
                    }

                });
            done();
        })
    })
});




describe("UNIT Tests - Movies", function () {





    it('should - print film voor gegeven id - /movies:id GET', function (done) {
        done();
    });

    it('should - print waarschuwing dat film met id niet bestaat', function (done) {
        done();
    });


    it('should - print film voor gezochte titel - GET', function (done) {
        done();
    });

    it('should - print waarschuwing dat film met titel niet bestaat', function (done) {
        done();
    });

})
;

describe("UNIT Tests - Gebruikers", function () {
    it('should - print lijst met users - /users GET', function (done) {
        done();
    });

    it('should - authoriseren van gebruiker - /authenticatie POST', function (done) {
        done();
    });


    it('should - weiger ongeautoriseerde toegang /authenticatie', function (done) {
        done();
    });

    it('should - registreer een gebruiker(correct)', function (done) {
        done();
    });
    it('should - deny a registration', function (done) {
        done();
    });
    it('should - - /', function (done) {
        done();
    });

});

describe("UNIT Tests - Ratings", function () {
    it('should - print gemiddelde rating van een film - /rating GET', function (done) {
        done();
    });
    it('should - print lijst met beoordelingen van een film - /rating:film POST', function (done) {
        done();
    });
    it('should - add a new rating- /addRating', function (done) {
        done();
    });
    it('should 00', function (done) {
        done();
    });

});

