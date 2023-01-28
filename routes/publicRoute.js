const express = require('express');
const router = express.Router();

const {
    getPosts, getSinglePost,
    getCategories, getSingleCategorie,
    getTags, getSingletag, getAuthorPosts

} = require('../controllers/publicController');
//posts
router.get('/posts', getPosts)
router.get('/single-post/:id', getSinglePost)
//categories
router.get('/categories', getCategories)
router.get('/single-categorie/:id', getSingleCategorie)
//tags
router.get('/tags', getTags)
router.get('/single-tag/:id', getSingletag)
//author
router.get('/author/:id', getAuthorPosts)
module.exports = router