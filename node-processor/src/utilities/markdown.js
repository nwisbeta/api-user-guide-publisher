
const remark = require('remark')
const html = require('remark-html')
const splitFrontmatter = require('front-matter')

function getHtmlFromMarkdown(markdown){

    const md = splitFrontmatter(markdown);

    const frontmatter = md.attributes
    const content = remark().use(html).processSync(md.body).contents.toString()

    return { frontmatter, content }

}

exports.getHtmlFromMarkdown = getHtmlFromMarkdown