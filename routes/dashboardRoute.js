const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authentication');

const {
    createPost, updateSinglePost, deleteSinglePost,
    createCategorie,updateSingleCategorie, deleteSingleCategorie,
    createtag, updateSingletag, deleteSingletag, editPost, getPostsDashboard

} = require('../controllers/dashboardController');

router.get('/posts', auth, getPostsDashboard)
router.get('/edit-post/:id', auth, editPost)
router.post('/create-post', auth, createPost)
router.patch('/single-post/:id', auth, updateSinglePost)
router.delete('/single-post/:id', auth, deleteSinglePost)

router.post('/create-categorie', auth, createCategorie)
router.patch('/single-categorie/:id', auth, updateSingleCategorie)
router.delete('/single-categorie/:id', auth, deleteSingleCategorie)

router.post('/create-tag', auth, createtag)
router.patch('/single-tag/:id', auth, updateSingletag)
router.delete('/single-tag/:id', auth, deleteSingletag)
module.exports = router