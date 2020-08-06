var express = require('express'); // On charge express
var bodyParser = require('body-parser') // On charge le middleWare Body Parser
const bcrypt = require('bcrypt'); // On charge bcrypt (pour le hashage des mot de passe)
const { v4: uuidv4 } = require('uuid'); // On charge uuid (pour avoir des chaines uniques et aléatoires)
const saltRounds = 10; //On configure le nombre de sallage

var router = express.Router(); // On charge les routeur sur express
var connection = require('./conn') // On charge la connexion à la bdd
const acceAuth = require('./acceAuth') // On charge le controle d'authentification

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON


// On gère la liste des utilisateurs dans l'API
router.get('/', (req, res) => {
    connection.query('SELECT id, username, cle FROM writers', function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour le détail d'un utilisateur
router.get("/:id", (req, res) => {
    connection.execute('SELECT id, username FROM writers where id=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour les articles d'un utilisateur
router.get("/:id/posts", (req, res) => {
    connection.execute('SELECT * FROM posts where writerid=?', [req.params.id], function (error, results, fields) {
        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
        else res.status(200).json(results)
    })
})

// On gère le chemin pour l'ajout d'un utilisateur
router.post('/', (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).json({ mess: "le champ username doit être rempli" })
    }
    else if (req.body.password === undefined) {
        res.status(400).json({ mess: "le champ password doit être rempli" })
    }
    else {
        connection.execute('SELECT * FROM writers where username=? ', [req.body.username], function (error, results, fields) {
            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
            else {
                if (results.length > 0) res.status(400).json({ mess: "Le nom d'utilisateur est déjà utilisé" });
                else {
                    const hash = bcrypt.hashSync(req.body.password, saltRounds);
                    const cleUser = uuidv4()
                    connection.query('INSERT INTO `writers` (username, hashedpassword, cle) VALUES (?,?,?)', [req.body.username, hash, cleUser], function (err, results) {
                        if (err) {
                            res.status(500).json({ mess: "Il y a une erreur interne" })
                        }
                        else {
                            res.status(200).json([{ id: results.insertId, username: req.body.username, cle: cleUser }])
                        }
                    });
                }
            }
        })
    }
})

// On gère le chemin pour la modification d'un utilisateur
router.put('/:id', (req, res) => {
    acceAuth(req, res, () => {
        if (req.body.username === undefined) {
            res.status(400).json({ mess: "le champ username doit être rempli" })
        }
        else {
            connection.execute('SELECT * FROM writers where id=? ', [req.userId], function (error, results, fields) {
                if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                else {
                    if (results.length == 0) res.status(400).json({ mess: "Seul l'utilisateur connecté peut se modifier" });
                    else {
                        connection.execute('SELECT * FROM writers where username=? ', [req.body.username], function (error, results, fields) {
                            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                            else {
                                if (results.length > 0) res.status(400).json({ mess: "Le nom d'utilisateur est déjà utilisé" });
                                else {
                                    if (req.body.password === undefined || req.body.password == "") {
                                        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
                                        connection.query('UPDATE `writers` SET username=? WHERE id=?', [req.body.username, req.params.id], function (err, results) {
                                            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                                            if (err) {
                                                res.status(500).json({ mess: "Il y a une erreur interne" })
                                            }
                                            else {
                                                connection.execute('SELECT id, username, cle FROM writers where id=?', [req.params.id], function (error, results, fields) {
                                                    if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                                                    else res.status(200).json(results)
                                                })
                                            }
                                        });
                                    }
                                    else {
                                        const hash = bcrypt.hashSync(req.body.password, saltRounds);
                                        // Si l'utilisateur n'existe pas, on fait la requête qui ajoute l'utilisateur déjà dans la BDD
                                        connection.query('UPDATE `writers` SET username=?, hashedpassword=? WHERE id=?', [req.body.username, hash, req.params.id], function (err, results) {
                                            // S'il y a une erreur, on renvois une erreur 500 avec un message perso
                                            if (err) {
                                                res.status(500).json({ mess: "Il y a une erreur interne" })
                                            }
                                            else {
                                                connection.execute('SELECT id, username, cle FROM writers where id=?', [req.params.id], function (error, results, fields) {
                                                    if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                                                    else res.status(200).json(results)
                                                })
                                            }
                                        });
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })
})

// On gère le chemin pour la suppression d'un utilisateur
router.delete('/:id', (req, res) => {
    acceAuth(req, res, () => {
        connection.execute('SELECT * FROM writers where id=? ', [req.userId], function (error, results, fields) {
            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
            else {
                if (results.length == 0) res.status(400).json({ mess: "Seul l'utilisateur connecté peut se supprimer" });
                else {
                    connection.execute('DELETE FROM writers where id=?', [req.params.id], function (error, results, fields) {
                        if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
                        else res.status(200).json({ mess: "Commentaire du blog bien supprimé" })
                    })
                }
            }
        })

    })
})

module.exports = router; // On exporte notre routage