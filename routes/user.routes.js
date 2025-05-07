const express = require('express');
const { signup, login, userProfile } = require('../controllers/user.controller');
const jwt = require('jsonwebtoken')
const router = express.Router();


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

router.post('/signup', signup);
router.post('/login', login);
router.get('/users/me', authorization,  userProfile);



module.exports = router;