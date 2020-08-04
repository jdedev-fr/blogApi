var express = require('express');
var router = express.Router();
const fs = require('fs')
var multer = require('multer')
var bodyParser = require('body-parser') // On charge le middleWare Body Parser
var connection = require('./conn');
const acceAuth = require('./acceAuth')

var upload = multer({ dest: 'uploads/' })

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON

router.get('/', (req, res) => {
    connection.query('SELECT * FROM posts', function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un utilisateur
router.get("/:id", (req, res) => {
    connection.execute('SELECT * FROM posts where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un utilisateur
router.get("/:id/comments", (req, res) => {
    connection.execute('SELECT * FROM comments where postid=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

router.post('/', upload.single('image'), (req, res) => {
    acceAuth(req, res, () => {
        if (req.body.title === undefined) {
            res.status(400).json({ mess: "le champ titre doit être rempli" })
            if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
        }
        else if (req.body.content === undefined) {
            res.status(400).json({ mess: "le champ content doit être rempli" })
            if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
        }
        else {
            // On fait une requête qui vérifie si l'email existe déjà dans la BDD
            connection.execute('SELECT * FROM `posts` WHERE title=?', [req.body.title], function (err, results) {
                // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                if (err) {
                    res.status(500).json({ mess: "erreur sur la requete SQL" })
                    if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                }
                else {
                    // Si l'utilisateur existe déjà, on renvois un code HTTP 400 et Un message perso
                    if (results.length > 0) {
                        res.status(400).json({ mess: "le titre de l'article existe déjà'" })
                        if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                    }
                    else {
                        let fileName = ""
                        if (req.file !== undefined) fileName = req.file.originalname
                        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
                        connection.query('INSERT INTO `posts` (title, content, publicationDate, writerid, imageFileName) VALUES (?,?,?,?,?)', [req.body.title, req.body.content, new Date(), req.userId, fileName], function (err, results) {
                            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                            if (err) {
                                res.status(500).json({ mess: "Il y a une erreur interne" })
                                if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                            }
                            else {
                                if (req.file !== undefined) {
                                    let rd = fs.createReadStream("./uploads/" + req.file.filename)
                                    let wr = fs.createWriteStream("./front/uploads/" + results.insertId + "_" + req.file.originalname)
                                    wr.on("finish", () => {
                                        fs.unlink("./uploads/" + req.file.filename, () => { })
                                    })
                                    rd.pipe(wr)
                                }
                                // Si tout va bien on renvois un code HTTP 200 et l'objet utilisateur comme si la BDD nous l'avais renvoyé
                                res.status(200).json([{ id: results.insertId, title: req.body.title, content: req.body.content, publicationDate: new Date(), imageFileName: fileName, writerid: req.body.writerid }])
                            }
                        });
                    }
                }
            })
        }
    })
})

router.put('/:id', upload.single('image'), (req, res) => {
    acceAuth(req, res, () => {
        if (req.body.title === undefined) {
            res.status(400).json({ mess: "le champ titre doit être rempli" })
            if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
        }
        else if (req.body.content === undefined) {
            res.status(400).json({ mess: "le champ content doit être rempli" })
            if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
        }
        else {
            // On fait une requête qui vérifie si l'email existe déjà dans la BDD
            connection.execute('SELECT * FROM `posts` WHERE title=? AND id!=?', [req.body.title, req.params.id], function (err, results) {
                // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                if (err) {
                    res.status(500).json({ mess: "erreur sur la requete SQL" })
                    if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                }
                else {
                    // Si l'utilisateur existe déjà, on renvois un code HTTP 400 et Un message perso
                    if (results.length > 0) {
                        res.status(400).json({ mess: "le titre de l'article existe déjà'" })
                        if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                    }
                    else {
                        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
                        connection.query('UPDATE `posts` SET title=?, content=?, publicationDate=?, writerid=? WHERE id=?', [req.body.title, req.body.content, new Date(), req.userId, req.params.id], function (err, results) {
                            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                            if (err) {
                                res.status(500).json({ mess: "Il y a une erreur interne" })
                                if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                            }
                            else {
                                if (req.file !== undefined) {
                                    let fileName = ""
                                    if (req.file !== undefined) fileName = req.file.originalname
                                    if (fileName != "") {
                                        connection.query('UPDATE `posts` SET imageFileName=? WHERE id=?', [fileName, req.params.id], function (err, results) {
                                            let rd = fs.createReadStream("./uploads/" + req.file.filename)
                                            let wr = fs.createWriteStream("./front/uploads/" + req.params.id + "_" + req.file.originalname)
                                            wr.on("finish", () => {
                                                fs.unlink("./uploads/" + req.file.filename, () => { })
                                            })
                                            rd.pipe(wr)
                                            // Si tout va bien on renvois un code HTTP 200 et l'objet utilisateur comme si la BDD nous l'avais renvoyé
                                            res.status(200).json([{ id: req.params.id, title: req.body.title, content: req.body.content, publicationDate: new Date(), imageFileName: fileName, writerid: req.body.writerid }])

                                        })
                                    }

                                }
                                else {
                                    connection.execute('SELECT * FROM posts where id=?', [req.params.id], function (error, results, fields) {
                                        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                                        else res.status(200).json(results)
                                    })
                                }
                            }
                        });
                    }
                }
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    acceAuth(req, res, () => {

        connection.execute('SELECT * FROM posts where id=? AND writerid=?', [req.params.id, req.userId], function (error, results, fields) {
            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
            else {
                if (results.length == 0) res.status(400).json({ mess: "L'article ne vous appartient pas" });
                else {
                    connection.execute('DELETE FROM posts where id=?', [req.params.id], function (error, results, fields) {
                        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                        else res.status(200).json({ mess: "Article du blog bien supprimé" })
                    })
                }

            }
        })

    })
})


module.exports = router;