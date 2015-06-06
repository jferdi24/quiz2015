var models = require('../models/models.js');

// Autoload :id
exports.load = function (req, res, next, quizId) {
    models.Quiz.findById(quizId).then(
        function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else { next(new Error('No existe quizId=' + quizId)) }
    }
    ).catch(function (error) { next(error) });
};
//GET quizes
exports.index = function (req, res) {
    models.Quiz.findAll().then(function (quizes) {
        res.render('quizes/index', { quizes: quizes });
    }).catch(function (error) { next(error) });
};
//GET quizes/question
exports.show = function (req, res) {
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        res.render('quizes/show', { quiz: req.quiz});
    })
};

//GET quiezes/answer
exports.answer = function (req, res) {
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        if (req.query.respuesta === req.quiz.respuesta) {
            res.render('quizes/answer', { quiz:req.quiz, respuesta: '<p class="cbien"><b>Correcto</b></p>' });
        }
        else {
            res.render('quizes/answer', { quiz: quiz, respuesta: '<p class="cmal"><b>Incorrecto</b></p>' });
        }
    })    
};