
const express = require('express')


var posts = require('./postsRoute');
var comments = require('./commentsRoute');
var writers = require('./writersRoute');
var connect = require('./connectRoute');

const app = express()
const port = 80

app.use(express.static('front')) // On paramètre un chemin static pour la gestion du Front


app.use('/API/posts', posts);
app.use('/API/comments', comments);
app.use('/API/writers', writers);
app.use('/API/connect', connect);



// On gère le chemin pour tout ce qui n'est pas géré plus haut
app.all("/API/*", (req, res) => {
    // On renvois une erreur 404 avec un message perso
    res.status(404).json({ mess: "La ressource n'existe pas dans l'API" })
})

// On gère le chemin pour tout ce qui n'est pas géré plus haut
app.all("/*", (req, res) => {
    // On renvois une erreur 404 avec un message perso
    res.status(404).send("<h1>La page demandé n'existe pas</h1>")
})
app.listen(port)