const { getArticles, createArticle, updateArticle, getArticleDetails, deleteArticleById } = require('../controllers/article.controller');
const authorization = require('../middlewares/authMiddleware');


const router = require('express').Router();


router.get('/', authorization,getArticles);
router.post('/', authorization,createArticle);
router.put('/:id',authorization,  updateArticle);
router.get('/:id',authorization,  getArticleDetails);
router.delete('/:id', authorization, deleteArticleById);

module.exports = router; 
