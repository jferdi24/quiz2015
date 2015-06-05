var models = require('../models/models.js');

//GET quizes/question
exports.question = function (req, res) {
    models.Quiz.findAll().then(function (quiz) {
        res.render('quizes/question', { pregunta: quiz[0].pregunta });
    })
};

//GET quiezes/answer
exports.answer = function (req, res) {
    models.Quiz.findAll().then(function (quiz) {
        if (req.query.respuesta === quiz[0].respuesta) {
            res.render('quizes/answer', { respuesta: '<p class="cbien"><b>Correcto</b></p>' });
        }
        else {
            res.render('quizes/answer', { respuesta: '<p class="cmal"><b>Incorrecto</b></p>' });
        }
    })    
};