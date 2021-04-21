const fs = require('fs')
const domino = require('domino')

const templateCache = {};
function getTemplate(templateFile){
    if(!templateCache[templateFile]){
        const html = fs.readFileSync(templateFile).toString()
        const document = domino.createWindow(html).document
        templateCache[templateFile] = document;       
    }
    return templateCache[templateFile].cloneNode(true);
}

function createSideNav(document, userGuideDoc, userGuide){

    const sidebar = getTemplate(__dirname + "/side-menu.html").querySelector("#api-guides-sidebar")
    
    sidebar.querySelector(".api-nav-tabs a").setAttribute("href",`/api-details/#api=${userGuideDoc.api}`)

    const template = document.createElement('template')
    for(const doc of userGuide) {
        const activeFlag = doc.href === userGuideDoc.href ? "nav-link-active" : ""
        template.innerHTML += `<li class="nav-item"><a class="nav-link ${activeFlag}" href="${doc.href}" >${doc.title}</a></li>\n`         
    }
    sidebar.querySelector("ul.nav").appendChild(template.content)

    document.adoptNode(sidebar);
    return sidebar

}

function applyTemplate(templateFile, userGuideDoc, userGuide){

    const page = getTemplate(templateFile)

    page.title = "APIs: User Guide - NHS Wales Developer Portal"
        
    page.querySelector("api-details").remove()
    page.querySelector("operation-details").remove()

    const meta = page.querySelector("meta[property=\"og:url\"]")
    meta.setAttribute("content",userGuideDoc.href)

    const operationList = page.querySelector("operation-list")
    operationList.parentNode.replaceChild(createSideNav(page, userGuideDoc, userGuide), operationList)

    const proseBlock = page.querySelector(".block > .ProseMirror")
    proseBlock.innerHTML = userGuideDoc.content
    proseBlock.classList.add("userguide-content")

    return page
}

exports.applyTemplate = applyTemplate


