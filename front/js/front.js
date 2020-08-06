import { reqAjax, majMenu, baseURL, tabLiensNc, tabLiensCon } from "./fonct.js"
import { Articles } from "./CArticles.js"
import { Commentaires } from "./CCommentaires.js"
import { Users } from "./Cusers.js"

let mesComm = new Commentaires()
let mesArt = new Articles(mesComm)
let mesUsers = new Users(mesArt)
mesArt.setUsers(mesUsers)
mesComm.setArt(mesArt)

tabLiensNc.push({ nom: "Acceuil", cb: mesArt.closerecupListeArt(baseURL + "posts") })
tabLiensNc.push({ nom: "Connexion", cb: () => { mesUsers.afficheFormConn() } })
tabLiensNc.push({ nom: "Inscription", cb: () => { mesUsers.afficheFormInsc() } })

tabLiensCon.push({ nom: "Acceuil", cb: mesArt.closerecupListeArt(baseURL + "posts") })
tabLiensCon.push({ nom: "Déconnexion", cb: () => { mesUsers.deco() } })
tabLiensCon.push({ nom: "Ajout Article", cb: () => { mesArt.afficheFormAjArt() } })
tabLiensCon.push({ nom: "MonProfil", cb: () => { mesUsers.afficheProfil() } })


// Evenement de fin de chargement de la page
window.addEventListener('load', () => {
    majMenu(mesUsers.idCo)

    // On lance la requête GET de la liste sur l'API et on mets en forme avec du DOM
    reqAjax("GET", baseURL + "writers", "", (data2) => {
        let dataP2 = JSON.parse(data2.target.response)
        mesUsers.tabWriters = []
        for (let i in dataP2) {
            mesUsers.tabWriters.push({ id: dataP2[i].id, username: dataP2[i].username })
        }
        mesArt.recupListeArt(baseURL + "posts")
    })
})



