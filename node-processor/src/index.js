const fs = require('fs')
const path = require('path')
const { forEachFile } = require('./utilities/fs')
const { getHtmlFromMarkdown } = require('./utilities/markdown')
const { applyTemplate } = require('./template')
const { argv } = require('process')

if(argv.length < 4){
    console.log("Usage index.js userGuidesPath targetSite")
    return;
}   

processUserGuides(argv[2], argv[3])

async function processUserGuides(userGuidesPath, targetSite){
    try {

        const userGuides = {}
        let started = false;
        let inProgress = 0;
        forEachFile(
            userGuidesPath, 
            ".md", 
            function (filePath) {
                
                inProgress++ 
                started = true
    
                const ugItem = extractUserGuideDoc(filePath, userGuidesPath, targetSite)
    
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
                const document = applyTemplate(path.join(targetSite, "api-details/index.html"), userGuide, userGuides[api])
      
                console.log(`writing... ${userGuide.outFile}`)
                fs.mkdirSync(path.dirname(userGuide.outFile), { recursive: true})        
                fs.writeFile(userGuide.outFile, document.innerHTML, (err) => { if (err) console.error(err) })
    
            }
        }

        updateConfig(apis, targetSite);
    }
    catch(err){
        console.log(err)
    }

}

function extractUserGuideDoc(filePath, userGuidesPath, targetSite) {
    const href = path.join("/api-guides", path.relative(userGuidesPath, filePath).replace(".md", "/")).replace(/\\/g, "/")
    const api = href.split("/")[2]
    const html = getHtmlFromMarkdown(fs.readFileSync(filePath).toString())
    const outFile = path.join(targetSite, href, "index.html")

    return { 
        api, 
        title: html.frontmatter.title || path.basename(filePath, ".md"),
        href, 
        content: html.content,
        outFile 
    }
}

function updateConfig(apis, targetSite){
    const configFile = path.join(targetSite, "config.json");

    file = fs.readFileSync(configFile)
    config = JSON.parse(file);

    config["apisWithGuides"] = apis;

    fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
}
