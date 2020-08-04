var express = require('express');
var bodyParser = require('body-parser') // On charge le middleWare Body Parser

var router = express.Router();
var connection = require('./conn')
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(bodyParser.urlencoded({ extended: false })) // Gestion de Body Parser pour les formulaires
router.use(bodyParser.json()) // Gestion de Body Parser pour les données en JSON


router.post('/', (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).json({ mess: "le champ username doit être rempli" })
    }
    else if (req.body.password === undefined) {
        res.status(400).json({ mess: "le champ password doit être rempli" })
    }
    else {

        connection.execute('SELECT * FROM writers where username=?', [req.body.username], function (error, results, fields) {
            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
            else {
                if (results.length > 0) {
                    if (bcrypt.compareSync(req.body.password, results[0].hashedPassword)) {
                        res.status(200).json({ id: results[0].id, cle: results[0].cle })
                    }
                    else {
                        res.status(400).json({ mess: "Vos identifiants ne correspondent pas" })
                    }
                }
                else {
                    res.status(400).json({ mess: "Vos identifiants ne correspondent pas" })
                }



            }
        })
    }
})

module.exports = router;