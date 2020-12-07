# Local User Guide Developer Build Script

This is a BASH script to simplify the task of making a change to the *user guides* on the DHEW developer portal on your local machine

This script means you can make required user guide changes and after running this view the changes in the DHEW Developer Portal locally in a web browser.

### Required Local Paths 

This script requires the paths to 3 local repositories to be set in the build script before it will run successfully. These repositories must exist on your local build environment. They can be cloned or forked to you local env. They are :

-   *GITHUB_WORKSPACE*: Location of your local clone of [The api catalogue](https://github.com/nwisbeta/api-catalogue)
        This path variable should end with  `/api-catalogue`
-   *DEV_PORTAL_PATH*: Location of your local clone of [The DHEW developer portal](https://github.com/nwisbeta/api-management-developer-portal)  
        This path variable should end with `/api-management-developer-portal`
-   *PUBLISHER_PATH*: Location of your local clone of [The api user guide publisher](https://github.com/nwisbeta/api-user-guide-publisher)         
        This path variable should end with `/api-user-guide-publisher`

### Running the script

1. Make and save your changes in the api catalogue as you normally would by adding markdown files in the directory structures. See the [api catalogue readme on how to do this](https://github.com/nwisbeta/api-catalogue/blob/master/README.md) 
2. Run this script by navigating to it's location and entering `./{name of the script.sh}`

### Result

The script should complete by either reporting an error or by launching the [The DHEW developer portal](https://github.com/nwisbeta/api-management-developer-portal) on your localhost by returning an http web address like 127.0.0.1:8080. Navigate in a web browser to this 
location and the DHEW developer portal should be running with your user guides additions or changes included. 

Once you make more changes stop the web server running in your terminal by entering *ctrl+c* and run the script again. The updates will be applied and the DNEW Developer Portal lauched again.

