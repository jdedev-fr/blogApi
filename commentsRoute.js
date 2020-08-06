var express = require('express'); // On charge express
var bodyParser = require('body-parser') // On charge le middleWare Body Parser

var router = express.Router(); // On charge les routeur sur express
var connection = require('./conn') // On charge la connexion à la bdd

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON


// On gère la liste de commentaires dans l'API
router.get('/', (req, res) => {
    connection.query('SELECT * FROM comments', function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un commentaire
router.get("/:id", (req, res) => {
    connection.execute('SELECT * FROM comments where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère l'ajout de commentaires via l'API
router.post('/', (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).json({ mess: "le champ username doit être rempli" })
    }
    else if (req.body.content === undefined) {
        res.status(400).json({ mess: "le champ content doit être rempli" })
    }
    else if (req.body.postid === undefined) {
        res.status(400).json({ mess: "le champ postid doit être rempli" })
    }
    else {
        connection.query('INSERT INTO `comments` (username, content, publicationDate, postid) VALUES (?,?,?,?)', [req.body.username, req.body.content, new Date(), req.body.postid], function (err, results) {
            if (err) {
                res.status(500).json({ mess: "Il y a une erreur interne" })
            }
            else {
                res.status(200).json([{ id: results.insertId, username: req.body.username, content: req.body.content, publicationDate: new Date(), postid: req.body.postid }])
            }
        });

    }
})

// La modification et la suppression de commentaires ne sont pas possible, on ne les codes pas 

module.exports = router; // On exporte notre routage