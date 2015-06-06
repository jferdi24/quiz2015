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
    console.log(req.query.search);
    if (req.query.search !== "" && req.query.search !== undefined) {
        var srch = req.query.search;
        srch = srch.replace(/ /g, "%");
        console.log(srch);
        models.Quiz.findAll({ where: { pregunta: { $like: ('%' + srch + '%') } }, order:[['pregunta', 'ASC']] }).then(function (quizes) {
            res.render('quizes/index', { quizes: quizes });
        }).catch(function (error) { next(error) });
    }
    else if (req.query.search === undefined || req.query.search === "" ) {
        models.Quiz.findAll().then(function (quizes) {
            res.render('quizes/index', { quizes: quizes });
        }).catch(function (error) { next(error) });
    }    
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