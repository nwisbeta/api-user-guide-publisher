const domino = require('domino')
const fs = require('fs')

const html = fs.readFileSync("./index.html").toString()
const document = domino.createWindow(html).document

document.title = "APIs: User Guide - NHS Wales Developer Portal"

const meta = document.querySelector("meta[property=\"og:url\"]")
meta.setAttribute("content","{{ page.url }}")

const apiDropdown = document.querySelector("api-list-dropdown")
apiDropdown.parentNode.replaceChild(document.createTextNode("{% include dropdown.html %}"), apiDropdown)

const operationList = document.querySelector("operation-list")
operationList.parentNode.replaceChild(document.createTextNode("{% include side-menu.html %}"), operationList)

const proseBlock = document.querySelector(".block.ProseMirror")
proseBlock.innerHTML = "{{ content }}"

document.querySelector("api-details").remove()
document.querySelector("operation-details").remove()

fs.writeFile("default.html",document.innerHTML, () => { console.log("done")})
