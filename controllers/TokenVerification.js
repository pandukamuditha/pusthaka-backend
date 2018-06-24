var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  // Checking header for token
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks expiery
  jwt.verify(token, process.env.JWT_SALT, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
}

module.exports = verifyToken;