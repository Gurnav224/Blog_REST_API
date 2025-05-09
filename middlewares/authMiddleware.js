const jwt = require('jsonwebtoken');


function authorization(req,res,next){
    const token = req.cookies.access_token;
    if(!token){
        return res.sendStatus(403)
    }

    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = data._id;
      return  next()
    } catch (error) {
      return res.sendStatus(403)
    }
}


module.exports = authorization;