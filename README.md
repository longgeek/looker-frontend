# Looker Front-end

## Getting Started

If you'd like to run from the master branch, you can clone the git repo:

    git clone git@git.pyindex.com:reviewdev/looker.git

## References

* http://wiki.pyindex.com

## How to use

    apt-get install npm nodejs-legacy

    npm install bower gulp -g

    vim /etc/profile
    export NODE_PATH="/usr/local/lib/node_modules/"

    cd looker/front-web
    bower install --allow-root
    npm install

## Build static files

    cd looker/front-web
    gulp

## Start Web -- src

    cd looker/front-web
    gulp serve

## Start Web -- dist

    cd looker/front-web
    gulp serve:dist
