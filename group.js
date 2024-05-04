import fs from "fs";

import { program } from "commander";

program.option("-p, --path <string>");
program.parse();

const options = program.opts();

// gets the items from the folder
const files = fs.readdirSync(options.path, { withFileTypes: true });

// iterates over each item found
files.map((currentFile) => {
  // build the file's full path
  let filePath = currentFile.path + currentFile.name;
  // get the file stats
  let fileStat = fs.statSync(filePath);
  // ignore directories
  if (fileStat.isFile()) {
    // build the subfolder path with the modified date
    let newFolderName = `${currentFile.path}${fileStat.mtime.getFullYear()} ${('00' + (fileStat.mtime.getMonth() + 1)).slice(-2)} ${('00' + fileStat.mtime.getDate()).slice(-2)}\\`
    // create the folder if it doesn't exist
    if (!fs.existsSync(newFolderName)) {
      fs.mkdirSync(newFolderName);
    }
    // build the file's new full path
    let newPath = `${newFolderName}${currentFile.name}`;

    // move the file to the subfolder
    fs.renameSync(filePath, newPath);
  }
});
