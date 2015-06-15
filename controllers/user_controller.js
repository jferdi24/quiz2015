var users = { admin: { id: 1, username: "admin", password: "123" } };

exports.autenticar = function (login, password, callback) {
    if (users[login]) {
        if (password === users[login].password) {
            callback(null, users[login]);
        } else { callback(new Error('Password erróneo.')); }
    } else { callback(new Error('No existe user=' )) }
    //models.User.find({
    //    where: {
    //        username: login
    //    }
    //}).then(function (user) {
    //    if (user) {
    //        if (user.verifyPassword(password)) {
    //            callback(null, user);
    //        }
    //        else { callback(new Error('Password erróneo.')); }
    //    } else { callback(new Error('No existe user=' + login)) }
    //}).catch(function (error) { callback(error) });
};