const baseURL = "http://localhost/API/"

let tabLiensNc = []
let tabLiensCon = []



//Fonction de mise à jour du menu
function majMenu(id) {
    let men = document.querySelector("nav>ul")
    men.innerHTML = ""
    if (id == 0) {
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

// Fonction front de génération d'une requete Ajax
function reqAjax(type, url, data, cb) {
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("load", cb);

    xhr.open(type, url);
    if (typeof data == "string") xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data)
}


// Fonction de transformation de new lig=ne en html br
function nl2br(str, is_xhtml) {
    if (typeof str === 'undefined' || str === null) {
        return '';
    }
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

export { reqAjax, nl2br, majMenu, baseURL, tabLiensNc, tabLiensCon };