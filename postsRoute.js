var express = require('express'); // On charge express
var router = express.Router(); // On charge les routeur sur express
const fs = require('fs') // On charge fs
var multer = require('multer') // On charge multer (pour les formulaires multipart)
var bodyParser = require('body-parser') // On charge le middleWare Body Parser
var connection = require('./conn'); // On charge la connexion à la bdd
const acceAuth = require('./acceAuth') // On charge le controle d'authentification

var upload = multer({ dest: 'uploads/' }) // On configure multer

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON

// On gère la liste d'articles dans l'API
router.get('/', (req, res) => {
    connection.query('SELECT * FROM posts', function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un article
router.get("/:id", (req, res) => {
    connection.execute('SELECT * FROM posts where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour la liste des commentaires d'un article
router.get("/:id/comments", (req, res) => {
    connection.execute('SELECT * FROM comments where postid=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour l'ajout d'un article
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
            connection.execute('SELECT * FROM `posts` WHERE title=?', [req.body.title], function (err, results) {
                if (err) {
                    res.status(500).json({ mess: "erreur sur la requete SQL" })
                    if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                }
                else {
                    if (results.length > 0) {
                        res.status(400).json({ mess: "le titre de l'article existe déjà'" })
                        if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                    }
                    else {
                        let fileName = ""
                        if (req.file !== undefined) fileName = req.file.originalname
                        connection.query('INSERT INTO `posts` (title, content, publicationDate, writerid, imageFileName) VALUES (?,?,?,?,?)', [req.body.title, req.body.content, new Date(), req.userId, fileName], function (err, results) {
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
                                res.status(200).json([{ id: results.insertId, title: req.body.title, content: req.body.content, publicationDate: new Date(), imageFileName: fileName, writerid: req.body.writerid }])
                            }
                        });
                    }
                }
            })
        }
    })
})

// On gère le chemin pour la modification d'un article
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
            connection.execute('SELECT * FROM `posts` WHERE title=? AND id!=?', [req.body.title, req.params.id], function (err, results) {
                if (err) {
                    res.status(500).json({ mess: "erreur sur la requete SQL" })
                    if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                }
                else {
                    if (results.length > 0) {
                        res.status(400).json({ mess: "le titre de l'article existe déjà'" })
                        if (req.file !== undefined) fs.unlink("./uploads/" + req.file.filename, () => { })
                    }
                    else {
                        connection.query('UPDATE `posts` SET title=?, content=?, publicationDate=?, writerid=? WHERE id=?', [req.body.title, req.body.content, new Date(), req.userId, req.params.id], function (err, results) {
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

// On gère le chemin pour la suppression d'un article
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


module.exports = router; // On exporte notre routage