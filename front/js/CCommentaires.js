import { reqAjax, nl2br } from "./fonct" // On importe la fonction de requete Ajax

class Commentaires {

    /**********************************************/
    /*   Bloc de fonctions faisant appel à l'API  */
    /**********************************************/
    recupListeCom(url, idPost) { //Récupération d'une liste de commentaires
        reqAjax("GET", url, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.miseEnPageListeCom(dataP, idPost)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    traiteFormAjCom() { // Ajout d'un commentaire
        let dataEnv = "username=" + document.getElementById('username').value + "&content=" + nl2br(document.getElementById('content').value) + "&postid=" + document.getElementById('postId').value
        reqAjax("POST", "http://localhost/API/comments/", dataEnv, (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                mesArt.recupDetArt("http://localhost/API/posts/" + dataP[0].postid)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })

    }

    /**********************************************/
    /*   Bloc de fonctions de mise en forme DOM   */
    /**********************************************/
    miseEnPageListeCom(data, idPost) { // Affichage d'une liste decommentaires
        let monCont = document.getElementById('main')
        for (let i in data) {
            let unArt = document.createElement('article')
            unArt.classList.add('commentaire')
            let unEntete = document.createElement('div')
            unEntete.classList.add('enteteArt')
            unArt.appendChild(unEntete)
            let titre = document.createElement('h2')
            titre.innerHTML = data[i].username
            unEntete.appendChild(titre)
            let content = document.createElement('div')
            content.classList.add('contenu')
            content.innerHTML = data[i].content
            unArt.appendChild(content)


            monCont.appendChild(unArt)

        }
        let ajoutCom = document.createElement('div')
        ajoutCom.classList.add('boutCom')
        ajoutCom.innerHTML = "Ajouter un commentaire"
        ajoutCom.addEventListener("click", this.closeafficheFormAjCom(idPost))
        monCont.appendChild(ajoutCom)
    }
    afficheFormAjCom(postId) { // Affichage du formulaire d'ajout de commentaires
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""

        let monFrom = document.createElement("form")

        let inpPostId = document.createElement("input")
        inpPostId.name = "postId"
        inpPostId.type = "hidden"
        inpPostId.id = "postId"
        inpPostId.value = postId
        monFrom.appendChild(inpPostId)

        let inpUserName = document.createElement("input")
        inpUserName.name = "username"
        inpUserName.type = "text"
        inpUserName.id = "username"
        inpUserName.placeholder = "Nom d'utilisateur"
        monFrom.appendChild(inpUserName)

        let inpCont = document.createElement("textarea")
        inpCont.name = "content"
        inpCont.id = "content"
        inpCont.placeholder = "Votre commentaire"
        monFrom.appendChild(inpCont)

        let ajoutCom = document.createElement('div')
        ajoutCom.classList.add('boutCom')
        ajoutCom.innerHTML = "Valider"
        ajoutCom.addEventListener("click", this.traiteFormAjCom)
        monFrom.appendChild(ajoutCom)

        monCont.appendChild(monFrom)
    }

    /**********************************************/
    /* Bloc de fonctions des closures nécessaires */
    /**********************************************/
    closeafficheFormAjCom(idPost) {
        return function (e) {
            this.afficheFormAjCom(idPost)
        }
    }
}
export { Commentaires };