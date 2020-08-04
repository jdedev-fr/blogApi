let tabWriters = []
let idCo = 0
let cleApi = ""

let tabLiensNc = [
    { nom: "Acceuil", cb: closerecupListeArt("http://localhost/API/posts") },
    { nom: "Connexion", cb: afficheFormConn },
    { nom: "Inscription", cb: afficheFormInsc }
]
let tabLiensCon = [
    { nom: "Acceuil", cb: closerecupListeArt("http://localhost/API/posts") },
    { nom: "Déconnexion", cb: deco },
    { nom: "Ajout Article", cb: afficheFormAjArt },
    { nom: "MonProfil", cb: afficheProfil }
]

// Fonction front de génération d'une requete Ajax
function reqAjax(type, url, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", cb);

    xhr.open(type, url);
    if (typeof data == "string") xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data)
}

function majMenu() {
    let men = document.querySelector("nav>ul")
    men.innerHTML = ""
    if (idCo == 0) {
        for (let i in tabLiensNc) {
            let unLien = document.createElement("li")
            unLien.innerHTML = tabLiensNc[i].nom
            unLien.addEventListener('click', tabLiensNc[i].cb)
            men.appendChild(unLien)
        }
    }
    else {
        for (let i in tabLiensCon) {
            let unLien = document.createElement("li")
            unLien.innerHTML = tabLiensCon[i].nom
            unLien.addEventListener('click', tabLiensCon[i].cb)
            men.appendChild(unLien)
        }

    }
}
// Evenement de fin de chargement de la page
window.addEventListener('load', () => {
    majMenu()

    // On lance la requête GET de la liste sur l'API et on mets en forme avec du DOM
    reqAjax("GET", "http://localhost/API/writers", "", (data2) => {
        let dataP2 = JSON.parse(data2.target.response)
        tabWriters = []
        for (let i in dataP2) {
            tabWriters.push({ id: dataP2[i].id, username: dataP2[i].username })
        }
        recupListeArt("http://localhost/API/posts")
    })
})

function recupListeArt(url) {
    reqAjax("GET", url, "", (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            miseEnPageListeArt(dataP)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}

function recupListeCom(url, idPost) {
    reqAjax("GET", url, "", (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            miseEnPageListeCom(dataP, idPost)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}
function recupDetArt(url) {
    reqAjax("GET", url, "", (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            miseEnPageDetArt(dataP)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}

function miseEnPageDetArt(data) {
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

        if (idCo == data[i].writerid) {
            let contOut = document.createElement('div')
            //titre.innerHTML = data[i].title
            contOut.classList.add("menOutils")
            unEntete.appendChild(contOut)

            let edit = document.createElement('i')
            edit.classList.add("fas", "fa-edit")
            edit.addEventListener("click", closeclicEdit(data[i].id))
            contOut.appendChild(edit)
            let supp = document.createElement('i')
            supp.classList.add("fas", "fa-trash-alt")
            supp.addEventListener("click", closeclicSupp(data[i].id))
            contOut.appendChild(supp)
        }

        let content = document.createElement('div')
        content.classList.add('contenu')
        content.innerHTML = data[i].content
        unArt.appendChild(content)
        let writer = document.createElement('div')
        writer.classList.add('writer')
        writer.innerHTML = tabWriters[tabWriters.findIndex((element) => element.id == data[i].writerid)].username === undefined ? "écrit par : " + "utilisateur supprimé" : "écrit par : " + tabWriters[tabWriters.findIndex((element) => element.id == data[i].writerid)].username
        writer.addEventListener('click', closerecupListeArt("http://localhost/API/writers/" + data[i].writerid + "/posts"))
        unArt.appendChild(writer)


        monCont.appendChild(unArt)

        let titreCom = document.createElement('h2')
        titreCom.innerHTML = "Commentaires"
        monCont.appendChild(titreCom)

        recupListeCom("http://localhost/API/posts/" + data[i].id + "/comments", data[i].id)


    }
}

function miseEnPageListeCom(data, idPost) {
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
    ajoutCom.addEventListener("click", closeafficheFormAjCom(idPost))
    monCont.appendChild(ajoutCom)
}
function miseEnPageListeArt(data) {
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
        titre.addEventListener('click', closerecupDetArt("http://localhost/API/posts/" + data[i].id))
        unEntete.appendChild(titre)

        if (idCo == data[i].writerid) {
            let contOut = document.createElement('div')
            //titre.innerHTML = data[i].title
            contOut.classList.add("menOutils")
            unEntete.appendChild(contOut)

            let edit = document.createElement('i')
            edit.classList.add("fas", "fa-edit")
            edit.addEventListener("click", closeclicEdit(data[i].id))
            contOut.appendChild(edit)
            let supp = document.createElement('i')
            supp.classList.add("fas", "fa-trash-alt")
            supp.addEventListener("click", closeclicSupp(data[i].id))
            contOut.appendChild(supp)
        }

        let content = document.createElement('div')
        content.classList.add('contenu')
        content.innerHTML = data[i].content
        unArt.appendChild(content)
        let writer = document.createElement('div')
        writer.classList.add('writer')
        writer.innerHTML = tabWriters[tabWriters.findIndex((element) => element.id == data[i].writerid)].username === undefined ? "écrit par : " + "utilisateur supprimé" : "écrit par : " + tabWriters[tabWriters.findIndex((element) => element.id == data[i].writerid)].username
        writer.addEventListener('click', closerecupListeArt("http://localhost/API/writers/" + data[i].writerid + "/posts"))
        unArt.appendChild(writer)


        monCont.appendChild(unArt)

    }
}

function closerecupListeArt(url) {
    return function (e) {
        recupListeArt(url)
    }
}
function closerecupDetArt(url) {
    return function (e) {
        recupDetArt(url)
    }
}
function closeafficheFormAjCom(idPost) {
    return function (e) {
        afficheFormAjCom(idPost)
    }
}
function closeclicSupp(idart) {
    return function (e) {
        clicSupp(idart)
    }
}
function closeclicEdit(idart) {
    return function (e) {
        clicEdit(idart)
    }
}

function closeclicSuppUt(idart) {
    return function (e) {
        clicSuppUt(idart)
    }
}
function closeclicEditUt(idart) {
    return function (e) {
        clicEditUt(idart)
    }
}
function closetraiteFormEdArt(idArt) {
    return function (e) {
        traiteFormEdArt(idArt)
    }
}

function closetraiteFormEdUt(idUt) {
    return function (e) {
        traiteFormEdUt(idUt)
    }
}


function afficheFormAjCom(postId) {
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
    ajoutCom.addEventListener("click", traiteFormAjCom)
    monFrom.appendChild(ajoutCom)

    monCont.appendChild(monFrom)
}


function afficheFormConn() {
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

function afficheFormInsc(e = "", uname = "", idut = "") {
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
        ajoutCom.addEventListener("click", closetraiteFormEdUt(idut))
    }
    monFrom.appendChild(ajoutCom)

    monCont.appendChild(monFrom)
}

function afficheFormAjArt(e, titre = "", cont = "", idArt = "") {
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
        ajoutCom.addEventListener("click", traiteFormAjArt)
    }
    else {
        ajoutCom.addEventListener("click", closetraiteFormEdArt(idArt))
    }
    monFrom.appendChild(ajoutCom)

    monCont.appendChild(monFrom)

}

function traiteFormAjArt() {
    //  console.log('traitement du formulaire d\'ajout d\'article')
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);
    //let dataEnv = "title=" + document.getElementById('title').value + "&content=" + nl2br(document.getElementById('content').value)
    reqAjax("POST", "http://localhost/API/posts/?idUser=" + idCo + "&cle=" + cleApi, formData, (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            recupDetArt("http://localhost/API/posts/" + dataP[0].id)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}
function traiteFormEdArt(idArt) {
    //console.log('traitement du formulaire d\'ajout d\'article')
    var formElement = document.querySelector("form");
    var formData = new FormData(formElement);
    //let dataEnv = "title=" + document.getElementById('title').value + "&content=" + nl2br(document.getElementById('content').value)
    reqAjax("PUT", "http://localhost/API/posts/" + idArt + "?idUser=" + idCo + "&cle=" + cleApi, formData, (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            recupDetArt("http://localhost/API/posts/" + dataP[0].id)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}
function deco() {
    idCo = 0
    cleApi = ""
    majMenu()
    recupListeArt("http://localhost/API/posts")
}

function traiteFormAjCom() {
    let dataEnv = "username=" + document.getElementById('username').value + "&content=" + nl2br(document.getElementById('content').value) + "&postid=" + document.getElementById('postId').value
    reqAjax("POST", "http://localhost/API/comments/", dataEnv, (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            recupDetArt("http://localhost/API/posts/" + dataP[0].postid)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })

}
function traiteFormInsc() {
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
                idCo = dataP[0].id
                cleApi = dataP[0].cle
                majMenu()
                recupListeArt("http://localhost/API/posts")
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }

}
function traiteFormEdUt(idUt) {
    let valUname = document.getElementById('username').value
    let valPass = document.getElementById('password').value
    let valConf = document.getElementById('conf').value
    if (valPass !== valConf) {
        alert("Les mots de passes ne correspondent pas")
    }
    else {
        let dataEnv = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value
        reqAjax("PUT", "http://localhost/API/writers/" + idUt + "?idUser=" + idCo + "&cle=" + cleApi, dataEnv, (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                idCo = dataP[0].id
                cleApi = dataP[0].cle
                majMenu()
                recupListeArt("http://localhost/API/posts")
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }

}
function traiteFormConn() {
    // console.log('traitement du formulaire de conexion')
    let dataEnv = "username=" + document.getElementById('username').value + "&password=" + document.getElementById('password').value
    //console.log(dataEnv)
    reqAjax("POST", "http://localhost/API/connect/", dataEnv, (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            idCo = dataP.id
            cleApi = dataP.cle
            majMenu()
            recupListeArt("http://localhost/API/posts")
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })

}

function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function clicSupp(idart) {
    if (confirm("Etes vous sur de vouloir supprimer l'article : " + idart)) {
        reqAjax("DELETE", "http://localhost/API/posts/" + idart + "?idUser=" + idCo + "&cle=" + cleApi, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                recupListeArt("http://localhost/API/posts")
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
}

function clicEdit(idart) {
    reqAjax("GET", "http://localhost/API/posts/" + idart, "", (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            afficheFormAjArt("", dataP[0].title, dataP[0].content, dataP[0].id)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}

function afficheProfil() {
    if (idCo == 0) {
        alert("Vous n'etes pas connecté")
    }
    else {
        reqAjax("GET", "http://localhost/API/writers/" + idCo, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                afficheFicheUt(dataP)
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
}

function afficheFicheUt(data) {
    // console.log(data)
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

        if (idCo == data[i].id) {
            let contOut = document.createElement('div')
            //titre.innerHTML = data[i].title
            contOut.classList.add("menOutils")
            unEntete.appendChild(contOut)

            let edit = document.createElement('i')
            edit.classList.add("fas", "fa-edit")
            edit.addEventListener("click", closeclicEditUt(data[i].id))
            contOut.appendChild(edit)
            let supp = document.createElement('i')
            supp.classList.add("fas", "fa-trash-alt")
            supp.addEventListener("click", closeclicSuppUt(data[i].id))
            contOut.appendChild(supp)
        }

        let content = document.createElement('div')
        content.classList.add('contenu')
        content.innerHTML = data[i].username
        unArt.appendChild(content)


        monCont.appendChild(unArt)

    }
}

function clicSuppUt(idut) {
    if (confirm("Etes vous sur de vouloir supprimer l'utilisateur : " + idut)) {
        reqAjax("DELETE", "http://localhost/API/writers/" + idut + "?idUser=" + idCo + "&cle=" + cleApi, "", (data) => {
            let dataP = JSON.parse(data.target.response)
            if (data.target.status == 200) {
                deco()
            }
            else {
                let messP = JSON.parse(data.target.response)
                alert(messP.mess)
            }
        })
    }
}

function clicEditUt(idut) {
    reqAjax("GET", "http://localhost/API/writers/" + idut, "", (data) => {
        let dataP = JSON.parse(data.target.response)
        if (data.target.status == 200) {
            afficheFormInsc("", dataP[0].username, dataP[0].id)
        }
        else {
            let messP = JSON.parse(data.target.response)
            alert(messP.mess)
        }
    })
}