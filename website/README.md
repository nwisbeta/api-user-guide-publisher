# NHS Wales API User Guide Page Generator

A small Jekyll site to generate User Guide pages that can be added the the NHS Wales Developer Portal site.

See below for advice on performing common tasks


### Preview User Guides using Jekyll dev server

If you have docker dekstop, just run `docker-compose -f "website\docker-compose.yml" up -d --build`

This will use a docker image with Jekyll installed, mount the website files and run Jekyll. 
Alternatively you can install Jekyll locally (ask Google how...)

### Build the User Guide pages and add them to the Developer Portal
After running the Jekyll dev server, you'll have `_site` folder containing the published user guide pages.

You can also just run jekyll build if you don't need to run the dev server, e.g.
```shell
docker run --rm --volume="$PWD/website:/srv/jekyll" -it jekyll/jekyll jekyll build
```

Copy the `_site/api-guides` folder and place it alongside the reset of the files in the papebits published portal.

### Update/Add user guide content 

The API user guides are markdown files in the API Catalogue (https://github.com/nwisbeta/api-catalogue/)

The location of the the catalogue will be something like: `/catalogue/{system}/{api-name}/user-guide`

Copy the files across to `/website/api-guides/{system-name}-{api-name}/`

You'll need to add front matter to the top of each markdown file
```yml
---
api: wrds-fhir-reference-data
order: 1
---
```
 - `api` should be set to `{system-name}-{api-name}`
 - `order` determines where the pages are sorted in the side menu 

### Update the design when the Developer Portal is changed

The layout is based on the API Details page from the developer portal (published using paperbits).

- First publish the latest version of the portal:
  - Use the **nhs-customisations** branch from https://github.com/nwisbeta/api-management-developer-portal
  - run `npm install`
  -  update the config files for the correct APIM instance 
  - run `npm run publish`  
    The published site will be published to the `dist/website` folder

- Copy `dist/website/api-details/index.html` into this repository as `_layouts/default.html` but make the following changes:
    - Update the title and `og:url` meta element in the head as show below:
        ```html
        <title>APIs: User Guide - NHS Wales Developer Portal</title>
        ...
        <meta property="og:url" content="{{ page.url }}">
        ```

    - Replace `<api-list-dropdown>` and its contents with `{% include dropdown.html %}`
    - Replace `<operation-list>` and its contents with `{% include side-menu.html %}`
    - Replace everything inside `<div class="block ProseMirror">` with `{{ content }}`
    - Remove `<api-details>` and `<operation-details>`

> NOTE: If you want the pages to display properly when you preview in Jekyll dev server you'll also need to copy across these files from the published site:  
> `/content/*`  
> `/styles/*`  
> `/api-details/styles.css`  
 
