var models = require('../models/models.js');

// Autoload :id
exports.load = function (req, res, next, quizId) {
    models.Quiz.find({ where: { id: Number(quizId) }, include: [{ model: models.Comment } ] }).then(
        function (quiz) {
        if (quiz) {
            req.quiz = quiz;
            next();
        } else { next(new Error('No existe quizId=' + quizId)) }
    }
    ).catch(function (error) { next(error) });
};
//GET quizes
exports.index = function (req, res,next) {
    console.log(req.query.search);
    if (req.query.search !== "" && req.query.search !== undefined) {
        var srch = req.query.search;
        srch = srch.replace(/ /g, "%");
        console.log(srch);
        models.Quiz.findAll({ where: { pregunta: { $like: ('%' + srch + '%') } }, order:[['pregunta', 'ASC']] }).then(function (quizes) {
            res.render('quizes/index', { quizes: quizes,errors:[] });
        }).catch(function (error) { next(error) });
    }
    else if (req.query.search === undefined || req.query.search === "" ) {
        models.Quiz.findAll().then(function (quizes) {
            res.render('quizes/index', { quizes: quizes, errors: [] });
        }).catch(function (error) { next(error) });
    }    
};

// GET quizes/new
exports.new = function (req, res) {
    var quiz = models.Quiz.build({
        pregunta: "Pregunta", respuesta: "Respuesta", tema:"Tema"
    });
    res.render('quizes/new', { quiz: quiz, errors: [] });
};

// GET quizes/create
exports.create = function (req, res) {
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate().then(function (err){
        if (err) {
            res.render('quizes/new', { quiz: quiz, errors: err.errors });
        }
        else {
            quiz.save({ fields: ["pregunta", "respuesta","tema"] }).then(function () {
            res.redirect('/quizes')})
        }
    });      
};

// Put quizes/id
exports.update = function (req, res) {
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    req.quiz.tema = req.body.quiz.tema;
    req.quiz.validate().then(function (err) {
        if (err) {
            res.render('quizes/edit', { quiz: req.quiz, errors: err.errors });
        }
        else {
            req.quiz.save({ fields: ["pregunta", "respuesta","tema"] }).then(function () {
                res.redirect('/quizes')
            })
        }
    });
};

// GET quizes/:id/edit
exports.edit = function (req, res) {
    var quiz = req.quiz;
    res.render('quizes/edit', { quiz: quiz, errors: [] });
};

// Delete quizes/:id/edit
exports.destroy = function (req, res,next) {
    req.quiz.destroy().then(function () {
        res.redirect('/quizes');
    }).catch(function (error) { next(error) });
};

//GET quizes/question
exports.show = function (req, res) {
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        res.render('quizes/show', { quiz: req.quiz, errors: []});
    })
};

//GET quiezes/answer
exports.answer = function (req, res) {
    models.Quiz.findById(req.params.quizId).then(function (quiz) {
        if (req.query.respuesta === req.quiz.respuesta) {
            res.render('quizes/answer', { quiz:req.quiz, respuesta: '<p class="cbien"><b>Correcto</b></p>' , errors: []});
        }
        else {
            res.render('quizes/answer', { quiz: quiz, respuesta: '<p class="cmal"><b>Incorrecto</b></p>' , errors: []});
        }
    })    
};