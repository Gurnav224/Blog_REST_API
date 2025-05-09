const express = require('express');
const { signup, login, userProfile, followUser, unfollowUser, getUserFollowers } = require('../controllers/user.controller');
const authorization = require('../middlewares/authMiddleware');
const router = express.Router();



router.patch('/me', authorization,  userProfile);
router.put('/:id/follow',authorization, followUser);
router.delete('/:id/follow', authorization, unfollowUser);
router.get('/:id/followers',authorization, getUserFollowers)


module.exports = router;