var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri);
const mydb = client.db('theowlhousewikidb').collection('postagem');
const postagemDAO = require('../postagemDAO');
const multer = require('multer');


// Configuração do armazenamento em memória para salvar a imagem no MongoDB
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// Estabelecer a conexão com o banco de dados
client.connect().then(() => {
    console.log('Conectado ao MongoDB');
}).catch((err) => {
    console.log('Erro ao conectar ao MongoDB:', err);
});

// Rota para a página principal
router.get('/', async (req, res, next) => {
    res.render('crud');
});

// Rota para criar-postagem
router.get('/criar-postagem', async (req, res) => {
    res.render('criar-postagem');
});

router.post('/criar-postagem', upload.single('imagem'), async (req, res) => {
    const { titulo, conteudo, categoria } = req.body;
    const imagem = req.file ? req.file.buffer.toString('base64') : null;

    const postagem = { titulo, conteudo, categoria, imagem };

    try {
        const result = await postagemDAO.insertPost(mydb, postagem);
        res.redirect('/');
    } catch (err) {
        console.log('Erro ao criar postagem:', err);
        res.status(500).send('Erro ao criar postagem');
    }
});

// Rota para editar-postagem
router.get('/editar-postagem', async (req, res) => {
    res.render('editar-postagem')
});

router.post('/editar-postagem', upload.single('imagem'), async (req, res) => {
    const { titulo, conteudo, categoria } = req.body;
    const imagem = req.file ? req.file.buffer.toString('base64') : null;
    
    if (!titulo || !conteudo) {
        return res.status(400).send('Título e conteúdo são obrigatórios!');
    }

    try {
        const result = await postagemDAO.updateContentByTitle(mydb, titulo, conteudo, categoria, imagem);
        
        if (result.modifiedCount > 0) {
            res.redirect('/'); // Redireciona para a página principal após a edição
        } else {
            res.status(404).send('Postagem não encontrada!');
        }
    } catch (err) {
        console.error('Erro ao editar postagem:', err);
        res.status(500).send('Erro no servidor!');
    }
});



// Rota para deletar-postagem
router.get('/deletar-postagem', async (req, res) => {
    res.render('deletar-postagem')
});

router.delete('/deletar-postagem', async (req, res) => {
    const { titulo } = req.body;
    const postagem = { titulo: titulo };


    if (!titulo) {
        return res.status(400).json({ success: false, message: 'Título é obrigatório!' });
    }

    try {
        const result = await postagemDAO.deletePostByTitle(mydb, postagem);

        if (result) {
            res.json({ success: true, message: 'Postagem deletada com sucesso!' });
        } else {
            res.status(404).json({ success: false, message: 'Postagem não encontrada!' });
        }
    } catch (err) {
        console.error('Erro ao deletar postagem:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor!' });
    }
});

module.exports = router;
