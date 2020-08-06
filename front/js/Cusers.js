import { reqAjax, majMenu } from "./fonct" // On importe la fonction de requete Ajax

class Users {


    tabWriters
    idCo
    cleApi

    constructor(lesArt) {
        this.tabWriters = []
        this.idCo = 0
        this.cleApi = ""
        this.lesArt = lesArt
    }

    deco() {
        this.idCo = 0
        this.cleApi = ""
        majMenu()
        mesArt.recupListeArt("http://localhost/API/posts")
    }

    /**********************************************/
    /*   Bloc de fonctions faisant appel à l'API  */
    /**********************************************/
    afficheProfil() { // Récupération du détail d'un utilisateur
        if (this.idCo == 0) {
            alert("Vous n'etes pas connecté")
        }
        else {
            reqAjax("GET", "http://localhost/API/writers/" + this.idCo, "", (data) => {
                let dataP = JSON.parse(data.target.response)
                if (data.target.status == 200) {
                    this.afficheFicheUt(dataP)
                }
                else {
                    let messP = JSON.parse(data.target.response)
                    alert(messP.mess)
                }
            })
        }
    }
    traiteFormInsc() { // Ajout d'un utilisateur
        let valUname = document.getElementById('username').value
        let valPass = document.getElementById('password').value
        let valConf = document.getElementById('conf').value
        if (valPass !== valConf) {
            alert("Les mots de passes ne correspondent pas")
        }
        else {
            let dataEnv = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value
            reqAjax("POST", "http://localhost/API/writers/", dataEnv, (data) => {
                let dataP = JSON.parse(data.target.response)
                if (data.target.status == 200) {
                    this.idCo = dataP[0].id
                    this.cleApi = dataP[0].cle
                    majMenu()
                    this.lesArts.recupListeArt("http://localhost/API/posts")
                }
                else {
                    let messP = JSON.parse(data.target.response)
                    alert(messP.mess)
                }
            })
        }

    }
    traiteFormEdUt(idUt) { // Modification d'un utilisateur
        let valUname = document.getElementById('username').value
        let valPass = document.getElementById('password').value
        let valConf = document.getElementById('conf').value
        if (valPass !== valConf) {
            alert("Les mots de passes ne correspondent pas")
        }
        else {
            let dataEnv = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value
            reqAjax("PUT", "http://localhost/API/writers/" + idUt + "?idUser=" + this.idCo + "&cle=" + this.cleApi, dataEnv, (data) => {
                let dataP = JSON.parse(data.target.response)
                if (data.target.status == 200) {
                    this.idCo = dataP[0].id
                    this.cleApi = dataP[0].cle
                    majMenu()
                    this.lesArt.recupListeArt("http://localhost/API/posts")
                }
                else {
                    let messP = JSON.parse(data.target.response)
                    alert(messP.mess)
                }
            })
        }

    }
    traiteFormConn() { // Connexion d'un utilisateur
        let dataEnv = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value
        reqAjax("POST", "http://localhost/API/connect/", dataEnv, (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.idCo = dataP.id
                this.cleApi = dataP.cle
                majMenu()
                this.lesArt.recupListeArt("http://localhost/API/posts")
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
    clicSuppUt(idut) { // Suppression d'un utilisateur
        if (confirm("Etes vous sur de vouloir supprimer l'utilisateur : " + idut)) {
            reqAjax("DELETE", "http://localhost/API/writers/" + idut + "?idUser=" + this.idCo + "&cle=" + this.cleApi, "", (data) => {
                let dataP = JSON.parse(data.target.response)
                if (data.target.status == 200) {
                    this.deco()
                }
                else {
                    let messP = JSON.parse(data.target.response)
                    alert(messP.mess)
                }
            })
        }
    }
    clicEditUt(idut) { // Récupération du détail d'un utilisateur pour le modifier
        reqAjax("GET", "http://localhost/API/writers/" + idut, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                this.afficheFormInsc("", dataP[0].username, dataP[0].id)
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
    afficheFicheUt(data) { // Affichage du détail d'un utilisateur
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""
        for (let i in data) {
            let unArt = document.createElement('article')
            unArt.classList.add('post')
            let unEntete = document.createElement('div')
            unEntete.classList.add('enteteArt')
            unArt.appendChild(unEntete)
            let titre = document.createElement('h2')
            titre.innerHTML = "Fiche utilisateur"
            unEntete.appendChild(titre)

            if (this.idCo == data[i].id) {
                let contOut = document.createElement('div')
                contOut.classList.add("menOutils")
                unEntete.appendChild(contOut)

                let edit = document.createElement('i')
                edit.classList.add("fas", "fa-edit")
                edit.addEventListener("click", this.closeclicEditUt(data[i].id))
                contOut.appendChild(edit)
                let supp = document.createElement('i')
                supp.classList.add("fas", "fa-trash-alt")
                supp.addEventListener("click", this.closeclicSuppUt(data[i].id))
                contOut.appendChild(supp)
            }

            let content = document.createElement('div')
            content.classList.add('contenu')
            content.innerHTML = data[i].username
            unArt.appendChild(content)


            monCont.appendChild(unArt)

        }
    }
    afficheFormConn() { // Affichage du formulaire de connection
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""

        let monFrom = document.createElement("form")

        let inpUserName = document.createElement("input")
        inpUserName.name = "username"
        inpUserName.type = "text"
        inpUserName.id = "username"
        inpUserName.placeholder = "Nom d'utilisateur"
        monFrom.appendChild(inpUserName)

        let inpMdp = document.createElement("input")
        inpMdp.name = "password"
        inpMdp.type = "password"
        inpMdp.id = "password"
        inpMdp.placeholder = "Mot de passe"
        monFrom.appendChild(inpMdp)

        let ajoutCom = document.createElement('div')
        ajoutCom.classList.add('boutCom')
        ajoutCom.innerHTML = "Valider"
        ajoutCom.addEventListener("click", traiteFormConn)
        monFrom.appendChild(ajoutCom)

        monCont.appendChild(monFrom)

    }
    afficheFormInsc(e = "", uname = "", idut = "") { // Affichage du formulaire d'inscription ou de modification
        let monCont = document.getElementById('main')
        monCont.innerHTML = ""

        let monFrom = document.createElement("form")

        let inpUserName = document.createElement("input")
        inpUserName.name = "username"
        inpUserName.type = "text"
        inpUserName.id = "username"
        inpUserName.value = uname
        inpUserName.placeholder = "Nom d'utilisateur"
        monFrom.appendChild(inpUserName)

        let inpMdp = document.createElement("input")
        inpMdp.name = "password"
        inpMdp.type = "password"
        inpMdp.id = "password"
        inpMdp.placeholder = "Mot de passe"
        monFrom.appendChild(inpMdp)

        let inpConf = document.createElement("input")
        inpConf.name = "conf"
        inpConf.type = "password"
        inpConf.id = "conf"
        inpConf.placeholder = "Confirmation de Mot de passe"
        monFrom.appendChild(inpConf)

        let ajoutCom = document.createElement('div')
        ajoutCom.classList.add('boutCom')
        ajoutCom.innerHTML = "Valider"
        if (idut == "") {
            ajoutCom.addEventListener("click", traiteFormInsc)
        }
        else {
            ajoutCom.addEventListener("click", this.closetraiteFormEdUt(idut))
        }
        monFrom.appendChild(ajoutCom)

        monCont.appendChild(monFrom)
    }

    /**********************************************/
    /* Bloc de fonctions des closures nécessaires */
    /**********************************************/
    closeclicSuppUt(idart) {
        return function (e) {
            this.clicSuppUt(idart)
        }
    }
    closeclicEditUt(idart) {
        return function (e) {
            this.clicEditUt(idart)
        }
    }
    closetraiteFormEdUt(idUt) {
        return function (e) {
            this.traiteFormEdUt(idUt)
        }
    }
}

export { Users };