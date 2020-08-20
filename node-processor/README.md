# NHS Wales API User Guide Page Generator (Node Version)

A node script to generate User Guide pages that can be added the the NHS Wales Developer Portal site.

Run `npm test` to generate the User Guides, they will be output to `data/api-guides/`.

You can then copy the whole `api-guides` folder into the published Azure API Management Developer Portal site (in `dist/website/` after you run the paperbits publisher)


### Update/Add user guide content 

Go the the latest [GitHub Action run of the API catalogue ](https://github.com/nwisbeta/api-catalogue/actions) and download the *user-guides* build artifact.
Unzip it and place it in the `data` folder

### Update the design when the Developer Portal is changed

The layout is based on the API Details page from the developer portal (published using paperbits).

- First publish the latest version of the portal:
  - Use the **nhs-customisations** branch from https://github.com/nwisbeta/api-management-developer-portal
  - run `npm install`
  -  update the config files for the correct APIM instance 
  - run `npm run publish`  
    The published site will be published to the `dist/website` folder

- Copy `dist/website/api-details/index.html` into `data/api-details/index.html` in this repo