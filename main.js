
const express = require('express') // On charge express


var posts = require('./postsRoute'); // On charge le routage de posts
var comments = require('./commentsRoute'); // On charge le routage de comments
var writers = require('./writersRoute'); // On charge le routage de writers
var connect = require('./connectRoute'); // On charge le routage de connect

const app = express() // On charge l'application sur express
const port = 80 // On définit le port d'écoute

app.use(express.static('front')) // On paramètre un chemin static pour la gestion du Front


app.use('/API/posts', posts); // On utilise le routage de posts pour les url commencant par /API/posts
app.use('/API/comments', comments); // On utilise le routage de comments pour les url commencant par /API/comments
app.use('/API/writers', writers); // On utilise le routage de writers pour les url commencant par /API/writers
app.use('/API/connect', connect); // On utilise le routage de connect pour les url commencant par /API/connect



// On gère le chemin pour tout ce qui n'est pas géré plus haut dans l'API
app.all("/API/*", (req, res) => {
    // On renvois une erreur 404 avec un message perso
    res.status(404).json({ mess: "La ressource n'existe pas dans l'API" })
})

// On gère le chemin pour tout ce qui n'est pas géré plus haut hors API
app.all("/*", (req, res) => {
    // On renvois une erreur 404 avec un message perso
    res.status(404).send("<h1>La page demandé n'existe pas</h1>")
})
app.listen(port) // On démarre le serveur