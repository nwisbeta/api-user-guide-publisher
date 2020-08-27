# Node User Guide Publisher

A node script to add user guide pages to the NHS Wales Developer Portal.

Run `node src/index.js {/path/to/user-guides} {/path/to/website/files}` to add the user guides (see below for info on what the paths should be)


### Get {/path/to/user-guides}

1. Go to the the latest [GitHub Action run of the API catalogue ](https://github.com/nwisbeta/api-catalogue/actions) and download the *user-guides* build artifact.
2. Unzip it to a location of your choice
3. Use the path as the first argument when running the script


### Get {/path/to/website/files}

The layout is based on the API Details page from the developer portal (published using paperbits).

1. Publish the latest version of the portal:
  - Use the **nhs-customisations** branch from https://github.com/nwisbeta/api-management-developer-portal
  - run `npm install`
  - update the config files for the correct APIM instance 
  - run `npm run publish`  
    The published site will be published to the `{location-of-your-repo}/dist/website` folder

2. Use `{location-of-your-repo}/dist/website` as the second argument when running the script