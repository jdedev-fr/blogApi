const urlParse = require('url').parse
var connection = require('./conn');

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

module.exports = acceAuth;