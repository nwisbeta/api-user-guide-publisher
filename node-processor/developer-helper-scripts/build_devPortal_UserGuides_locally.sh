#!/bin/bash

#
# This script is a BASH script to simplify the task of making a change to the User Guides on the DHEW developer portal 
# on your local machine. The aim of the script is that you make a change to a userguide locally (in the userguide catalogue) 
# then run this script and view the result in the DHEW developer portal in your web browser. 
#
# This : 
#
#   * gathers the UserGuide files using export-user-guides.sh, 
#   * publishes the portal as a complete site (see https://github.com/nwisbeta/api-user-guide-publisher) to ...dist/website 
#   * starts the portal in a web server locally (http-server)
#
# At the end of the script you should see http-server starting:

# Starting up http-server, serving <DEV_PORTAL_PATH>
# Available on:
#   http://127.0.0.1:<free port>
#   http://<other ipaddress>:<free port>
# Hit CTRL-C to stop the server

# A 3 local paths are key to this working as indicated below. 
#   * GITHUB_WORKSPACE  : Location of your clone/fork of https://github.com/nwisbeta/api-catalogue                    (.../api-catalogue)
#   * DEV_PORTAL_PATH   : Location of your clone.fork of https://github.com/nwisbeta/api-management-developer-portal  (.../api-management-developer-portal)
#   * PUBLISHER_PATH    : Location of your clone/fork of https://github.com/nwisbeta/api-user-guide-publisher         (.../api-user-guide-publisher)

# Abort script on non zero return codes
set -e

# Please set your local paths here as explained above
GITHUB_WORKSPACE=/mnt/c/development/Git/bmcd77/api-catalogue
DEV_PORTAL_PATH=/mnt/c/Development/Git/api-management-developer-portal
PUBLISHER_PATH=/mnt/c/Development/Git/api-user-guide-publisher/node-processor

if [[ ! -d $GITHUB_WORKSPACE || ! -d $DEV_PORTAL_PATH || ! -d $PUBLISHER_PATH ]]
then
  echo "you are missing one of the 3 required directories (GITHUB_WORKSPACE / DEV_PORTAL_PATH / PUBLISHER_PATH. Please check your settings."
  exit 1
fi

# derived paths
USERGUIDES_PATH=$GITHUB_WORKSPACE/user-guides
DEV_PORTAL_PATH=$DEV_PORTAL_PATH/dist/website

cd $GITHUB_WORKSPACE || exit

# source - https://askubuntu.com/a/53179 - Call script to assemble all the user guides into a folder
source $GITHUB_WORKSPACE/.github/actions/export-user-guides.sh

# first time you run the script the User Guide Directory is created.
[ -d $USERGUIDES_PATH ] && echo "Directory $USERGUIDES_PATH exists." || echo "Error: Directory $USERGUIDES_PATH does not exist."

echo "calling node to run the publisher ..."

# See the ReadMe.md https://github.com/nwisbeta/api-user-guide-publisher/tree/master/node-processor

# Note : There is a poss bug here. Sometimes multiple (6 etc) lines(.html) are written as being processed by the publisher but 
# on other occasions a lot less(2). I've not established if this is just node writing inconsistently -> stdout via BASH or an actual bug
# with the publisher script. I'm presuming the former unless I discover otherwise.
node $PUBLISHER_PATH/src/index.js $USERGUIDES_PATH $DEV_PORTAL_PATH

# TODO : can't seem to capture node return codes reliably (BASH just returns 0 regardless)
echo "Publisher Return value is : $?"

# Capture Return value
#if [ $? != 0 ]; then                   
#   echo "${?}\n". 1>&2 && exit 1
#fi

# quick check of the installed http-server
pkgs="http-server"
VERSION=$(npm $pkgs --version)
if [[ -z "$VERSION" ]] 
then 
  echo "http-server is not installed"
  npm i $pkgs  
fi

echo "starting http-server ver" $VERSION " ... "

bash -c "http-Server $DEV_PORTAL_PATH"

# Open your local browser and view the site - works from bash
#sensible-brower http://127.0.0.1:8080



