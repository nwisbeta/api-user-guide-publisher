const fs = require('fs')
const path = require('path')
const domino = require('domino')
const remark = require('remark')
const html = require('remark-html')

const templateCache = {};
function applyTemplate(templateFile, content, navMenu){

    if(!templateCache[templateFile]) {
        const html = fs.readFileSync(templateFile).toString()
        const document = domino.createWindow(html).document
        
        document.title = "APIs: User Guide - NHS Wales Developer Portal"
        
        const meta = document.querySelector("meta[property=\"og:url\"]")
        meta.setAttribute("content","{{ page.url }}")
        
        document.querySelector("api-details").remove()
        document.querySelector("operation-details").remove()
    
        templateCache[templateFile] = document;       
    }

    const page = templateCache[templateFile].cloneNode(true)

    const operationList = page.querySelector("operation-list")
    operationList.parentNode.replaceChild(createSideNav(page, navMenu), operationList)

    page.querySelector(".block.ProseMirror").innerHTML = content

    return page
}

function createSideNav(document, navMenu){
    const html = fs.readFileSync(__dirname + "/side-menu.html").toString()
    const sidebar = document.adoptNode(domino.createWindow(html).document.querySelector("#api-guides-sidebar"));
    
    sidebar.querySelector(".api-nav-tabs a").setAttribute("href",`/api-details/#api=${navMenu.api}`)

    const template = document.createElement('template')
    for(navItem of navMenu) {
        template.innerHTML += `<li class="nav-item"><a class="nav-link ${"nav-link-active"}" href="${navItem.href}" >${navItem.text}</a></li>\n`         
    }
    sidebar.querySelector("ul.nav").appendChild(template.content)

    return sidebar

}


function getHtmlFromMarkdown(mdFile){

    const md = fs.readFileSync(mdFile).toString();

    return remark().use(html).processSync(md).contents.toString()

}

function forEachFile(directory, extension, callback) {

    fs.readdir(directory, { withFileTypes : true }, (err, dirents) => {

        if (err) throw err;
    
        for(const dirent of dirents){

            const direntPath = path.join(directory, dirent.name);
            if (dirent.isDirectory()) {
                forEachFile(direntPath, extension, callback)
            }                
            
            if (dirent.isFile() && dirent.name.endsWith(extension)) {
                callback(direntPath)                
            }    

        }
    });
}

exports.applyTemplate = applyTemplate
exports.getHtmlFromMarkdown = getHtmlFromMarkdown
exports.forEachFile = forEachFile

