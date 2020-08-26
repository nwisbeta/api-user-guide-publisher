const fs = require('fs')
const path = require('path')
const { forEachFile } = require('./utilities/fs')
const { getHtmlFromMarkdown } = require('./utilities/markdown')
const { applyTemplate } = require('./template')

processUserGuides()

async function processUserGuides(){
    try {

        const userGuides = {}
        let started = false;
        let inProgress = 0;
        forEachFile(
            "./data/user-guides/", 
            ".md", 
            function (filePath) {
                
                inProgress++ 
                started = true
    
                const ugItem = extractUserGuideDoc(filePath)
    
                userGuides[ugItem.api] = userGuides[ugItem.api] || []
                userGuides[ugItem.api].push(ugItem)
    
                inProgress--
            }
        )

        console.log("reading user guide content...")
        while(!started || inProgress){
            console.log("...still reading... ")
            await new Promise((r) => setTimeout(()=> r(true),100))
        }
        console.log("...done!")

        const apis = [];
        for(const api in userGuides){

            apis.push(api);

            for(const userGuide of userGuides[api]){

                const document = applyTemplate("./data/api-details/index.html", userGuide, userGuides[api])
      
                console.log(`writing... ${userGuide.outFile}`)
                fs.mkdirSync(path.dirname(userGuide.outFile), { recursive: true})        
                fs.writeFile(userGuide.outFile, document.innerHTML, (err) => { if (err) console.error(err) })
    
            }
        }

        updateConfig(apis);
    }
    catch(err){
        console.log(err)
    }

}



function extractUserGuideDoc(filePath) {
    const href = filePath.replace(/.*user-guides/, '/api-guides').replace(".md", "/").replace(/\\/g, "/")
    const api = href.split("/")[2]
    const html = getHtmlFromMarkdown(fs.readFileSync(filePath).toString())
    const outFile = filePath.replace("user-guides","api-guides").replace(".md", path.sep + "index.html")

    return { 
        api, 
        title: html.frontmatter.title || path.basename(filePath, ".md"),
        href, 
        content: html.content,
        outFile 
    }
}

function updateConfig(apis){
    let file = fs.readFileSync("./data/config.json")
    let config = JSON.parse(file);

    config["apisWithGuides"] = apis;

    fs.writeFileSync("./data/config.json", JSON.stringify(config, null, 2));
}