var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb = client.db('theowlhousewikidb').collection('postagem');
const postagemDAO = require('../postagemDAO');

// Estabelecer a conexão com o banco de dados
client.connect().then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB:', err);
});

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        const posts = await postagemDAO.getPosts(mydb);  // Usando postagemDAO para pegar os posts
        res.render('index', { posts });
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao carregar posts.");
    }
});

// Página da postagem específica
router.get('/post/:id', async (req, res) => {
    try {
        const post = await mydb.findOne({ titulo: req.params.id });  // Procurando por id no banco de dados
        if (post) {
            res.render('post', { post });
        } else {
            res.status(404).send("Postagem não encontrada");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Erro ao carregar postagem.");
    }
});

module.exports = router;
