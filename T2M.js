"use strict";

let fs = require("fs");
let exec = require("child_process").exec;

class T2M {
  constructor() {
    this.init();
  }

  getRequestOptions(body) {
    return {
      title: body.Title,
      text: body.Text,
      preciseSearch: body.PreciseSearch,
      optionsDropDown: body.OptionsDropDown
    };
  }

  createSoundFile(req, callback) {
    if (req.text.length < 1) {
      return callback("No Text provided", null);
    }

    let that = this;
    this._createFile(req, (error, textpath) => {
      if (error !== null) {
        return callback("Error creating file: " + error, null);
      }

      that._executeT2M(textpath, req, (error, soundpath) => {
        if (error !== null) {
          return callback("Error executing T2M: " + error, null);
        }
        return callback(null, soundpath);
      });
    });
  }

  _createFile(req, callback) {
    let fileName = req.title.replace(/ /g, "") + ".txt";
    let path = "public/textfiles/" + fileName;
    fs.writeFile(path, req.text, error => {
      if (error) {
        return callback("Cannot create File. FS Error: " + error, null);
      }
      return callback(null, "public/textfiles/" + fileName);
    });
  }

  _executeT2M(path, req, callback) {
    //articleFile outputFile -db databaseFile -[output] [mp3 wav midi play ] -[precise] -db databaseFile

    let textpath = path.replace(/ /g, "") + " ";
    let exportPath = "public/soundfiles/";
    let filnename = req.title.replace(/ /g, "") + ".wav";
    let database = " wordsDB.csv";
    let output = " -o wav";

    let command = textpath + exportPath + filnename + database + output;

    console.log(command);

    if (req.preciseSearch) {
      command = command + " -precise";
    }

    exec("java -jar t2m.jar " + command, (error, stdout, stderr) => {
      console.log("stdout: " + stdout);
      console.log("stderr: " + stderr);

      if (error !== null) {
        return callback(error, null);
      }

      return callback(null, "soundfiles/" + filnename);
    });
  }

  init() {}
}

module.exports = T2M;
