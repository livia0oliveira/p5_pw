class postagemDAO {
    // métodos para CRUD
    // READ
    static async getPosts(client) {
        const cursor = await client
        .find()
        .project({_id:0})
        .sort({nome:1}) // edito nome p titulo?
        .limit(10)
        try {
            const results = await cursor.toArray()
            return results
        } catch(err) {
            console.log(err)
        }
    }
    
    // CREATE
    static async insertPost(client, doc) {
        const ok = await client
        .insertOne(doc)
        try {
            return ok
        } catch(err) {
            console.log(err)
        }
    }

    // DELETE
    static async deletePostByTitle(client, nome) {
        const ok = await client
        .deleteOne(nome)
        try {
            return ok
        } catch(err) {
            console.log(err)
        }
    }

    // UPDATE
    static async updateContentByTitle(client, titulo, new_content) {
        try {
            const result = await client.updateOne(
                { titulo: titulo }, // Filtro de busca pelo título
                { $set: { conteudo: new_content } } // Atualiza o campo 'conteudo'
            );
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

}

module.exports = postagemDAO