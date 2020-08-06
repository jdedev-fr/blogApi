import { reqAjax } from "./fonct" // On importe la fonction de requete Ajax

class Articles {

    constructor(lesComs) {
        this.lesComs = lesComs
    }

    setUsers(lesUsers) {
        this.lesUsers = lesUsers
    }
    /**********************************************/
    /*   Bloc de fonctions faisant appel à l'API  */
    /**********************************************/
    recupListeArt(url) {    //Récupération d'une liste d'article
        reqAjax("GET", url, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.miseEnPageListeArt(dataP)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    recupDetArt(url) { // Récupération du détail d'un article
        reqAjax("GET", url, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.miseEnPageDetArt(dataP)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    traiteFormAjArt() { // Ajout d'un article
        var formElement = document.querySelector("form");
        var formData = new FormData(formElement);
        reqAjax("POST", "http://localhost/API/posts/?idUser=" + this.lesUsers.idCo + "&cle=" + this.lesUsers.cleApi, formData, (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.recupDetArt("http://localhost/API/posts/" + dataP[0].id)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    traiteFormEdArt(idArt) { // Modification d'un article
        var formElement = document.querySelector("form");
        var formData = new FormData(formElement);
        reqAjax("PUT", "http://localhost/API/posts/" + idArt + "?idUser=" + this.lesUsers.idCo + "&cle=" + this.lesUsers.cleApi, formData, (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.recupDetArt("http://localhost/API/posts/" + dataP[0].id)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    clicSupp(idart) { // Suppression d'un article
        if (confirm("Etes vous sur de vouloir supprimer l'article : " + idart)) {
            reqAjax("DELETE", "http://localhost/API/posts/" + idart + "?idUser=" + this.lesUsers.idCo + "&cle=" + this.lesUsers.cleApi, "", (data) => {
                let dataP = JSON.parse(data.target.response)
                if (data.target.status == 200) {
                    this.recupListeArt("http://localhost/API/posts")
                }
                else {
                    let messP = JSON.parse(data.target.response)
                    alert(messP.mess)
                }
            })
        }
    }
    clicEdit(idart) { // Récupération du détail d'un article pour le modifier
        reqAjax("GET", "http://localhost/API/posts/" + idart, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.afficheFormAjArt("", dataP[0].title, dataP[0].content, dataP[0].id)
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
    miseEnPageDetArt(data) { // Affichage du détail d'un article
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""
        for (let i in data) {
            let unArt = document.createElement('article')
            unArt.classList.add('post')
            if (data[i].imageFilename != "" && data[i].imageFilename != null) {
                let imgBlog = document.createElement('img')
                imgBlog.classList.add('imgBlog')
                imgBlog.src = "/uploads/" + data[i].id + "_" + data[i].imageFilename
                imgBlog.alt = data[i].imageFilename
                unArt.appendChild(imgBlog)
            }
            let unEntete = document.createElement('div')
            unEntete.classList.add('enteteArt')
            unArt.appendChild(unEntete)
            let titre = document.createElement('h2')
            titre.innerHTML = data[i].title
            unEntete.appendChild(titre)

            if (this.lesUsers.idCo == data[i].writerid) {
                let contOut = document.createElement('div')
                contOut.classList.add("menOutils")
                unEntete.appendChild(contOut)

                let edit = document.createElement('i')
                edit.classList.add("fas", "fa-edit")
                edit.addEventListener("click", this.closeclicEdit(data[i].id))
                contOut.appendChild(edit)
                let supp = document.createElement('i')
                supp.classList.add("fas", "fa-trash-alt")
                supp.addEventListener("click", this.closeclicSupp(data[i].id))
                contOut.appendChild(supp)
            }

            let content = document.createElement('div')
            content.classList.add('contenu')
            content.innerHTML = data[i].content
            unArt.appendChild(content)
            let writer = document.createElement('div')
            writer.classList.add('writer')
            writer.innerHTML = this.lesUsers.tabWriters[this.lesUsers.tabWriters.findIndex((element) => element.id == data[i].writerid)].username === undefined ? "écrit par : " + "utilisateur supprimé" : "écrit par : " + this.lesUsers.tabWriters[this.lesUsers.tabWriters.findIndex((element) => element.id == data[i].writerid)].username
            writer.addEventListener('click', this.closerecupListeArt("http://localhost/API/writers/" + data[i].writerid + "/posts"))
            unArt.appendChild(writer)


            monCont.appendChild(unArt)

            let titreCom = document.createElement('h2')
            titreCom.innerHTML = "Commentaires"
            monCont.appendChild(titreCom)

            //La on va devoir récuperer les comm
            this.lesComs.recupListeCom("http://localhost/API/posts/" + data[i].id + "/comments", data[i].id)


        }
    }
    miseEnPageListeArt(data) { // Affichage d'une liste d'articles
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""
        for (let i in data) {
            let unArt = document.createElement('article')
            unArt.classList.add('post')
            if (data[i].imageFilename != "" && data[i].imageFilename != null) {
                let imgBlog = document.createElement('img')
                imgBlog.classList.add('imgBlog')
                imgBlog.src = "/uploads/" + data[i].id + "_" + data[i].imageFilename
                imgBlog.alt = data[i].imageFilename
                unArt.appendChild(imgBlog)
            }
            let unEntete = document.createElement('div')
            unEntete.classList.add('enteteArt')
            unArt.appendChild(unEntete)
            let titre = document.createElement('h2')
            titre.innerHTML = data[i].title
            titre.addEventListener('click', this.closerecupDetArt("http://localhost/API/posts/" + data[i].id))
            unEntete.appendChild(titre)

            if (this.lesUsers.idCo == data[i].writerid) {
                let contOut = document.createElement('div')
                contOut.classList.add("menOutils")
                unEntete.appendChild(contOut)

                let edit = document.createElement('i')
                edit.classList.add("fas", "fa-edit")
                edit.addEventListener("click", this.closeclicEdit(data[i].id))
                contOut.appendChild(edit)
                let supp = document.createElement('i')
                supp.classList.add("fas", "fa-trash-alt")
                supp.addEventListener("click", this.closeclicSupp(data[i].id))
                contOut.appendChild(supp)
            }

            let content = document.createElement('div')
            content.classList.add('contenu')
            content.innerHTML = data[i].content
            unArt.appendChild(content)
            let writer = document.createElement('div')
            writer.classList.add('writer')
            writer.innerHTML = this.lesUsers.tabWriters[this.lesUsers.tabWriters.findIndex((element) => element.id == data[i].writerid)].username === undefined ? "écrit par : " + "utilisateur supprimé" : "écrit par : " + this.lesUsers.tabWriters[this.lesUsers.tabWriters.findIndex((element) => element.id == data[i].writerid)].username
            writer.addEventListener('click', this.closerecupListeArt("http://localhost/API/writers/" + data[i].writerid + "/posts"))
            unArt.appendChild(writer)


            monCont.appendChild(unArt)

        }
    }
    afficheFormAjArt(e, titre = "", cont = "", idArt = "") { // Affichage du formulaire d'ajout ou de modification d'un article
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""

        let monFrom = document.createElement("form")
        monFrom.enctype = 'multipart/form-data'

        let inpUserName = document.createElement("input")
        inpUserName.name = "title"
        inpUserName.type = "text"
        inpUserName.id = "title"
        inpUserName.value = titre
        inpUserName.placeholder = "Titre de l'article"
        monFrom.appendChild(inpUserName)

        let inpCont = document.createElement("textarea")
        inpCont.name = "content"
        inpCont.id = "content"
        inpCont.placeholder = "Votre commentaire"
        inpCont.value = cont
        monFrom.appendChild(inpCont)

        let inpImg = document.createElement("input")
        inpImg.name = "image"
        inpImg.type = "file"
        inpImg.id = "image"
        inpImg.placeholder = "Votre image"
        monFrom.appendChild(inpImg)

        let ajoutCom = document.createElement('div')
        ajoutCom.classList.add('boutCom')
        ajoutCom.innerHTML = "Valider"
        if (idArt == "") {
            ajoutCom.addEventListener("click", this.traiteFormAjArt)
        }
        else {
            ajoutCom.addEventListener("click", this.closetraiteFormEdArt(idArt))
        }
        monFrom.appendChild(ajoutCom)

        monCont.appendChild(monFrom)

    }

    /**********************************************/
    /* Bloc de fonctions des closures nécessaires */
    /**********************************************/
    closerecupListeArt(url) {
        return function (e) {
            this.recupListeArt(url)
        }
    }
    closerecupDetArt(url) {
        return function (e) {
            this.recupDetArt(url)
        }
    }
    closeclicSupp(idart) {
        return function (e) {
            this.clicSupp(idart)
        }
    }
    closeclicEdit(idart) {
        return function (e) {
            this.clicEdit(idart)
        }
    }
    closetraiteFormEdArt(idArt) {
        return function (e) {
            this.traiteFormEdArt(idArt)
        }
    }
}
export { Articles };