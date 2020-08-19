const fs = require('fs')
const path = require('path')
const { getHtmlFromMarkdown, applyTemplate, forEachFile } = require('./module')

processUserGuides()

async function processUserGuides(){

    const navMenus = {}
    let started = false;
    let inProgress = 0;
    forEachFile(
        "./data/user-guides/", 
        ".md", 
        function (filePath) {
            
            inProgress++ 
            started = true

            const { api, documentTitle, documentHref } = processFilePath(filePath)


            navMenus[api] = navMenus[api] || []
            navMenus[api].api = api
            navMenus[api].push({text: documentTitle, href: documentHref })

            inProgress--
        }
    )
    console.log("building navigation...")
    while(!started || inProgress){
        console.log("...still building... ")
        await new Promise((r) => setTimeout(()=> r(true),100))
    }
    console.log("...done!")

    forEachFile(
        "./data/user-guides/", 
        ".md", 
        function (filePath) {

            const { api, outFile } = processFilePath(filePath)

            const content = getHtmlFromMarkdown(filePath);
        
            const page = applyTemplate("./data/api-details/index.html", content, navMenus[api])

            fs.mkdirSync(path.dirname(outFile), { recursive: true})
            console.log("writing " + outFile)

            fs.writeFile(outFile, page.innerHTML, (err) => { console.log( err || "done" )})
        }
    )

}

function processFilePath(filePath) {
    const documentHref = filePath.replace(/.*user-guides/, '/api-guides').replace(".md", "/").replace(/\\/g, "/")
    const documentTitle = path.basename(filePath, ".md")
    const api = documentHref.split("/")[2]
    const outFile = filePath.replace("user-guides","api-guides").replace(".md", "/index.html")
    return { api, documentTitle, documentHref, outFile }
}

