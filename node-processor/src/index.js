const fs = require('fs')
const path = require('path')
const { getHtmlFromMarkdown, applyTemplate, forEachFile } = require('./module')

forEachFile(
    "./data/user-guides/", 
    ".md", 
    function (filePath) {

        const content = getHtmlFromMarkdown(filePath);
    
        const page = applyTemplate("./data/api-details/index.html", content)

        const outFile = filePath.replace("user-guides","api-guides").replace(".md", ".html")
        fs.mkdirSync(path.dirname(outFile), { recursive: true})
        console.log("writing " + outFile)

        fs.writeFile(outFile, page.innerHTML, (err) => { console.log( err || "done" )})
    }
)

