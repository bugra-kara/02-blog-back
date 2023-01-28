const queries = require('../db/queries')

//Posts
const getPostsDashboard = async (req,res) => {
    console.log("here");
    try {
        const resp = await queries(`SELECT post_uid, status, fullName, title, slug, categories, tags, created_date 
        FROM (SELECT CONCAT(first_name, ' ', last_name) as fullName, id FROM users) as sub 
        INNER JOIN posts ON author = sub.id WHERE status != '-2' ORDER BY created_date DESC`)
        res.json({result: "success", data: resp.rows})
    } catch (error) {
        res.json({result: "failed", msg: error})
    }
}
const createPost = async (req,res) => {
    const { title, slug, subTitle, content, tags, author, categories, status } = req.body
    try {
        const newTags = JSON.stringify(tags).replace(/"/g,`'`)
        const newCats = JSON.stringify(categories).replace(/"/g,`'`)
        const response = await queries(`
        INSERT INTO posts (title, slug, subtitle, content, tags, author, categories, status) 
        VALUES (
        '${title}',
        '${slug}',
        '${subTitle}',
        '${content}',
        ARRAY${newTags},
         ${author},
        ARRAY${newCats},
        '${status}'
        );    
        `);
        if(response?.rowCount > 0 && status === '1') {
            res.json({result: "succes", msg: "İçerik başarıyla eklendi!"})
        }
        else if(response?.rowCount > 0 && status === '0') {
            res.json({result: "succes", msg: "İçerik başarıyla kaydedildi!"})
        }
        else {
            if(response.detail !== undefined) {
                res.json({result: "failed", msg: response.detail.slice(4)})
            }
            else {
                res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
            }
        }
    } catch (error) {
        console.log(error);
        res.json({result: "failed", msg: error})
    }
}
const updateSinglePost = async (req,res) => {
    const { title, slug, subTitle, content, image_url, isheadline, tags, author, categories, status } = req.body
    const {id} = req.params
    try {
        const response = await queries(`
        UPDATE posts 
        SET 
        title = '${title}',
        slug = '${slug}',
        subtitle = '${subTitle}',
        content = '${content}',
        image_url = '${image_url}',
        is_headline = '${isheadline}',
        tags = '{${tags}}',
        author = '${author}',
        categories = '{${categories}}',
        status = '${status}', 
        updated_date = CURRENT_TIMESTAMP 
        WHERE posts.post_uid = '${id}';
        `)
        if(response?.rowCount > 0) {
            res.json({result: "succes", msg: "İçerik başarıyla güncellendi!"})
        }
        else {
            if(response.detail !== undefined) {
                res.json({result: "failed", msg: response.detail.slice(4)})
            }
            else {
                res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
            }
        }
    } catch (error) {
        console.log(error);
        res.json({result: "failed", msg: error})
    }
}
const deleteSinglePost = async (req,res) => {
    const {id} = req.params
    const {status} = req.body
    try {
        const response = await queries(`UPDATE posts SET status = '${status !== -1 ? '-1' : '-2'}' WHERE posts.post_uid = '${id}'`)
        if(response.rowCount > 0) {
            res.json({result: "succes", msg: "İçerik başarıyla silindi!"})
        }
        else if(response.rowCount === 0) {
            res.json({result: "succes", msg: "İçerik bulunamadı!"})
        }
        else {
            if(response.detail !== undefined) {
                res.json({result: "failed", msg: response.detail.slice(4)})
            }
            else {
                res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
            }
        }
    } catch (error) {
        console.log(error);
        res.json({result: "failed", msg: error})
    }
}
const editPost = async (req, res) => {
    const {id} = req.params
    try {
        const resp = await queries(`SELECT * FROM posts WHERE post_uid = '${id}'`)
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
const createCategorie = async (req,res) => {
    const { name, slug } = req.body

    try {
        const response = await queries(`
        INSERT INTO categories 
        (category_name, category_slug) 
        VALUES ('${name}', '${slug}');
        `)
        console.log(response);
        if(response?.rowCount > 0) {
            res.json({result: "succes", msg: "Kategori başarıyla eklendi!"})
        }
        else {
            if(response.detail !== undefined) {
                res.json({result: "failed", msg: response.detail.slice(4)})
            }
            else {
                res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
            }
        }
    } catch (error) {
        console.log(error);
        res.json({result: "failed", msg: error})
    }
}
const updateSingleCategorie = async (req,res) => {
    const {id} = req.params
    const {name, slug} = req.body
    if((name === undefined || name === '') || (slug === undefined || slug === '')) {
        res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
    }
    else {
        try {
            const response = await queries(`
            UPDATE categories SET category_name = '${name}', category_slug = '${slug}' WHERE category_id = '${id}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Kategori başarıyla güncellendi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
}
const deleteSingleCategorie = async (req,res) => {
    const {id} = req.params
    const { name } = req.body
    if(id === undefined) {
        try {
            const response = await queries(`
            UPDATE categories SET status = '0' WHERE category_id = '${id}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Kategori başarıyla silindi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
    else {
        try {
            const response = await queries(`
            UPDATE categories SET status = '0' WHERE category_name = '${name}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Kategori başarıyla silindi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
}

//Tags
const createtag = async (req,res) => {
    const { name, slug } = req.body

    try {
        const response = await queries(`
        INSERT INTO tags 
        (tag_name, tag_slug) 
        VALUES ('${name}', '${slug}');
        `)
        if(response?.rowCount > 0) {
            res.json({result: "succes", msg: "Tag başarıyla eklendi!"})
        }
        else {
            if(response.detail !== undefined) {
                res.json({result: "failed", msg: response.detail.slice(4)})
            }
            else {
                res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
            }
        }
    } catch (error) {
        console.log(error);
        res.json({result: "failed", msg: error})
    }
}
const updateSingletag = async (req,res) => {
    const {id} = req.params
    const {name, slug} = req.body
    if((name === undefined || name === '') || (slug === undefined || slug === '')) {
        res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
    }
    else {
        try {
            const response = await queries(`
            UPDATE tags SET tag_name = '${name}', tag_slug = '${slug}' WHERE tag_id = '${id}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Tag başarıyla güncellendi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
}
const deleteSingletag = async (req,res) => {
    const {id} = req.params
    const { name } = req.body
    if(id === undefined) {
        try {
            const response = await queries(`
            UPDATE tags SET status = '0' WHERE tag_id = '${id}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Tag başarıyla silindi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
    else {
        try {
            const response = await queries(`
            UPDATE tags SET status = '0' WHERE tag_name = '${name}'
            `)
            if(response?.rowCount > 0) {
                res.json({result: "succes", msg: "Tag başarıyla silindi!"})
            }
            else {
                if(response.detail !== undefined) {
                    res.json({result: "failed", msg: response.detail.slice(4)})
                }
                else {
                    res.json({result: "failed", msg: "Lütfen boş alanları doldurunuz!"})
                }
            }
        } catch (error) {
            console.log(error);
            res.json({result: "failed", msg: error})
        }
    }
}
module.exports = {
    createPost, updateSinglePost, deleteSinglePost,
    createCategorie, updateSingleCategorie, deleteSingleCategorie,
    createtag, updateSingletag, deleteSingletag, editPost, getPostsDashboard
}