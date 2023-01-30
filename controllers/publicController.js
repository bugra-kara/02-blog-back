const queries = require('../db/queries')

//Posts
const getPosts = async (req,res) => {
    try {
        const headline = await queries(`SELECT post_uid, status, fullName, title, slug, categories, tags, created_date, image_url 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE status = '1' AND is_headline = 'true' AND 'One Cikanlar' = ANY(posts.categories) ORDER BY created_date DESC LIMIT 5`)
        const lastNews = await queries(`SELECT post_uid, status, fullName, title, slug, categories, tags, created_date, image_url 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE status = '1' AND is_headline = 'false' AND 'One Cikanlar' = ANY(posts.categories) ORDER BY created_date DESC LIMIT 5`)
        const bitcoin = await queries(`SELECT post_uid, status, fullName, title, slug, categories, tags, created_date, image_url 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE status = '1' AND 'Bitcoin' = ANY(posts.categories) ORDER BY created_date DESC LIMIT 5`)
        
        res.json({result: "success", data: {headline: headline.rows, lastNews: lastNews.rows, bitcoin: bitcoin.rows, otherNews: otherNews.rows}})
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}
const getSinglePost = async (req,res) => {
    const {id} = req.params
    try {
        const resp = await queries(`SELECT post_uid, status, fullName, title, subtitle, content, slug, categories, tags, created_date, image_url 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE slug = '${id}'`)
        if(resp.rows.length === 0 ) {
            res.json({result: "failed", msg: 404})
        }
        else {
            res.json({result: "succcess", data: resp.rows})
        }
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}

//Categories
const getCategories = async (req,res) => {
    try {
        const resp = await queries(`SELECT * FROM categories WHERE status = '1' ORDER BY created_date ASC`)
        res.json({result: "success", data: resp.rows})
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}
const getSingleCategorie = async (req,res) => {
    const {id} = req.params
    try {
        const resp = await queries(`SELECT (SELECT category_name FROM categories WHERE category_slug = '${id}'), post_uid, status, is_headline, fullName, title, slug, categories, tags, created_date, image_url, subtitle 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE status = '1' AND (SELECT category_name FROM categories WHERE category_slug = '${id}') = ANY(posts.categories) ORDER BY created_date DESC`)
        if(resp.rows.length === 0 ) {
            res.json({result: "failed", msg: 404})
        }
        else {
            res.json({result: "succcess", data: resp.rows})
        }
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}

//Tags
const getTags = async (req,res) => {
    const {page} = req.query
    if(page !== 'undefined') {
        try {
            const resp = await queries(`SELECT * FROM tags WHERE status = '1' ORDER BY created_date ASC OFFSET ${5*(page)} LIMIT 5`)
            const total = await queries(`SELECT COUNT(*) AS NumberOfTags FROM tags WHERE status = '1'`)
            res.json({result: "success", data: resp.rows, totalTag: total.rows[0].numberoftags})
        } catch (error) {
            res.json({result: "failed", msg: error})
        }
    }
    else {
        try {
            const resp = await queries(`SELECT * FROM tags WHERE status = '1' ORDER BY created_date ASC`)
            const total = await queries(`SELECT COUNT(*) AS NumberOfTags FROM tags WHERE status = '1'`)
            res.json({result: "success", data: resp.rows, totalTag: total.rows[0].numberoftags})
        } catch (error) {
            res.json({result: "failed", msg: error})
        }
    }
}
const getSingletag = async (req,res) => {
    const {id} = req.params
    try {
        const resp = await queries(`SELECT * FROM ( SELECT tag_slug, tag_id from tags where tag_slug = '${id}') AS 
        sub INNER JOIN posts ON tag_id = ANY(posts.tags)`)
        if(resp.rows.length === 0 ) {
            res.json({result: "failed", msg: 404})
        }
        else {
            res.json({result: "succcess", data: resp.rows})
        }
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}

//author
const getAuthorPosts = async (req, res) => {
    const {id} = req.params
    try {
        const resp = await queries(`SELECT * FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users WHERE slug = '${id}') as sub INNER JOIN posts ON author = sub.id`)
        if(resp.rows.length === 0 ) {
            res.json({result: "failed", msg: 404})
        }
        else {
            res.json({result: "succcess", data: resp.rows})
        }
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}
module.exports = {
    getPosts, getSinglePost,
    getCategories, getSingleCategorie,
    getTags,getSingletag, getAuthorPosts
}