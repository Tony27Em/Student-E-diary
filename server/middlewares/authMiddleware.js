const tokenService = require("../services/token-service");

module.exports = function(req, res, next) {
  try {
    const authorizationHeaders = req.headers['authorization'];
    if(!authorizationHeaders) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const accessToken = authorizationHeaders.split(' ')[1];
    if(!accessToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if(!userData) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = userData;
    next();
  } catch(e) {
    return next(e);
  }
}