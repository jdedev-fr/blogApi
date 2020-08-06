import { reqAjax, majMenu } from "./fonct"
import { Articles } from "./CArticles"
import { Commentaires } from "./CCommentaires"
import { Users } from "./Cusers"

let mesComm = new Commentaires()
let mesArt = new Articles(mesComm)
let mesUsers = new Users(mesArt)
mesArt.setUsers(mesUsers)



// Evenement de fin de chargement de la page
window.addEventListener('load', () => {
    majMenu()

    // On lance la requête GET de la liste sur l'API et on mets en forme avec du DOM
    reqAjax("GET", "http://localhost/API/writers", "", (data2) => {
        let dataP2 = JSON.parse(data2.target.response)
        mesUsers.tabWriters = []
        for (let i in dataP2) {
            mesUsers.tabWriters.push({ id: dataP2[i].id, username: dataP2[i].username })
        }
        mesArt.recupListeArt("http://localhost/API/posts")
    })
})



