const fs = require('fs')
const path = require('path')
const domino = require('domino')
const remark = require('remark')
const html = require('remark-html')

const templateCache = {};
function applyTemplate(templateFile, content){

    if(!templateCache[templateFile]) {
        const html = fs.readFileSync(templateFile).toString()
        const document = domino.createWindow(html).document
        
        document.title = "APIs: User Guide - NHS Wales Developer Portal"
        
        const meta = document.querySelector("meta[property=\"og:url\"]")
        meta.setAttribute("content","{{ page.url }}")
        
        const apiDropdown = document.querySelector("api-list-dropdown")
        apiDropdown.parentNode.replaceChild(document.createTextNode("{% include dropdown.html %}"), apiDropdown)
        
        const operationList = document.querySelector("operation-list")
        operationList.parentNode.replaceChild(document.createTextNode("{% include side-menu.html %}"), operationList)
        
        document.querySelector("api-details").remove()
        document.querySelector("operation-details").remove()
    
        templateCache[templateFile] = document;       
    }
    const page = templateCache[templateFile].cloneNode(true)

    page.querySelector(".block.ProseMirror").innerHTML = content

    return page
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

