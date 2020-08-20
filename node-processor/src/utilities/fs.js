
const fs = require('fs')
const path = require('path')

function forEachFile(directory, extension, callback) {

    fs.readdir(directory, { withFileTypes : true }, (err, dirents) => {

        if (err) throw err;
    
        for(const dirent of dirents){

            const direntPath = path.join(directory, dirent.name);
            if (dirent.isDirectory()) {
                forEachFile(direntPath, extension, callback)
            }                
            
            if (dirent.isFile() && dirent.name.endsWith(extension)) {
                callback(direntPath)                
            }    

        }
    });
}

exports.forEachFile = forEachFile