var express = require('express');
var bodyParser = require('body-parser') // On charge le middleWare Body Parser

var router = express.Router();
var connection = require('./conn')

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON


router.get('/', (req, res) => {
    connection.query('SELECT * FROM comments', function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un utilisateur
router.get("/:id", (req, res) => {
    connection.execute('SELECT * FROM comments where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})
router.post('/', (req, res) => {
    //console.log(req.body)
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
        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
        connection.query('INSERT INTO `comments` (username, content, publicationDate, postid) VALUES (?,?,?,?)', [req.body.username, req.body.content, new Date(), req.body.postid], function (err, results) {
            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
            if (err) {
                res.status(500).json({ mess: "Il y a une erreur interne" })
            }
            else {
                // Si tout va bien on renvois un code HTTP 200 et l'objet utilisateur comme si la BDD nous l'avais renvoyé
                res.status(200).json([{ id: results.insertId, username: req.body.username, content: req.body.content, publicationDate: new Date(), postid: req.body.postid }])
            }
        });

    }
})
/*
router.put('/:id', (req, res) => {
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
        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
        connection.query('UPDATE `comments` SET username=?, content=?, publicationDate=?, postid=? WHERE id=?', [req.body.username, req.body.content, new Date(), req.body.postid, req.params.id], function (err, results) {
            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
            if (err) {
                res.status(500).json({ mess: "Il y a une erreur interne" })
            }
            else {
                // Si tout va bien on renvois un code HTTP 200 et l'objet utilisateur comme si la BDD nous l'avais renvoyé
                res.status(200).json([{ id: req.params.id, username: req.body.username, content: req.body.content, publicationDate: new Date(), postid: req.body.postid }])
            }
        });

    }
})

router.delete('/:id', (req, res) => {
    connection.execute('DELETE FROM comments where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json({ mess: "Commentaire du blog bien supprimé" })
    })
})
*/
module.exports = router;