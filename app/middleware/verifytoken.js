const jwt = require('jsonwebtoken');

// Token verification middleware
function verifyToken(req, res, next) {
    const token = req.header('auth-token'); 
    if (!token) return res.status(401).json({ error: 'Access Denied' });
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
}
// verify if the user is the owner of the account or an admin
function verifyUserOrAdmin(req, res, next) {
  verifyToken(req, res, () => {
   // if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.user.id.toString() === req.params.id.toString() || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: 'Access Denied - Not allowed' });
    }
  });
}

// verify if the user is an admin
function verifyTokenAdmin(req, res, next) {
    verifyToken(req, res, () => { 
        if ( req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: 'You are not allowed to do that' });
        }
    });
}
module.exports = {verifyToken, verifyUserOrAdmin,verifyTokenAdmin};