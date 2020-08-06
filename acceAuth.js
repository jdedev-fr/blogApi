const urlParse = require('url').parse // On charge le module de parsing d'url
var connection = require('./conn'); // On charge la connexion à la bdd

// On controlle l'authentification passé dans l'url sous form idUser/cle
// Si ok on execute la callback
// Sinon on renvois un message d'erreur en JSON
function acceAuth(req, res, cb) {
    let monUrl = urlParse(req.url, true)
    if (monUrl.query.idUser === undefined) res.status(400).json({ mess: "Vous devez fournir l'id utilisateur" })
    else if (monUrl.query.cle === undefined) res.status(400).json({ mess: "Vous devez fournir la clé api de  l'utilisateur" })
    else {
        connection.execute('SELECT * FROM writers where id=? AND cle=?', [monUrl.query.idUser, monUrl.query.cle], function (error, results, fields) {
            if (error) res.status(500).json({ mess: "erreur sur la requete SQL" });
            else {
                if (results.length == 0) {
                    res.status(400).json({ mess: "Vos identifiants ne correspondent pas" })
                }
                else {
                    req.userId = monUrl.query.idUser
                    cb()
                }



            }
        })
    }
}

module.exports = acceAuth; // On exporte la fonction