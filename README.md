# NHS Wales User Guide Publisher(s)

TL;DR: Use the `node-processor`

This repo contains tools to generate User Guide pages for the [NHS Wales Developer Portal](https://github.com/nwisbeta/api-management-developer-portal).

The user guide content comes from the [API Catalogue](https://github.com/nwisbeta/api-catalogue), written in Markdown

This is then merged with the rest of the Developer Portal website, created using [Paperbits](https://paperbits.io/) - because Azure made us!

There are two versions of the publisher:
 - a [Jekyll one](jekyll-processor), which requires a lot of manual copying, pasting, typing, clicking and heavy sighing
 - a [Node one](node-processor), which has been written to drop easily into an auotmated pipeline

