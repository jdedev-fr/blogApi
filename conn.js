var mysql = require('mysql2'); // On charge le module mysql

// On gère la connexion
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog'
});

connection.connect(); // On ouvre la connexion

module.exports = connection; // On exporte la connexion déjà ouverte