//helper function
const passport = require('passport');
exports.isAuth = (req, res, next) => {
    return passport.authenticate('jwt');
}

exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role }
}

exports.cookieExtractor = (req) => {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MmM4OTIwNTkxZDIwYmI3ZjdmZjdhOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk3OTE2NTk2fQ._67TSVc0aTKmweembLsU37q6EEQMNCKz-rJLJxQivyk"
    return token;
};