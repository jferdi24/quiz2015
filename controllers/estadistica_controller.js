var models = require('../models/models.js');
var sta1 = 0, sta2=0, sta3=0, sta4=0, sta5=0;
exports.show = function (req, res,next) {
    models.Quiz.count().then(function (count) {
        sta1 = count;
    }
    ).catch(function (error) { next(error) });
    models.Comment.count().then(function (count) {
        sta2 = count; 
    }
    ).catch(function (error) { next(error) });
    //sequelize.query("SELECT * FROM Comments", { type: sequelize.QueryTypes.SELECT })
    //    .then(function (Comments) {
    //// We don't need spread here, since only the results will be returned for select queries
    //});
    models.Comment.count( { group : '"QuizId"'}).then(function (comments) {
        sta5 = comments.length;
        sta4 = sta1 - sta5;
        sta3 = (sta2 / sta5).toFixed(4);
        res.render('stadistica/show.ejs', { ln1: sta1, ln2: sta2, ln3: sta3, ln4: sta4, ln5: sta5, errors: [] });
    }
    ).catch(function (error) { next(error) });
};