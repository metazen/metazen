/*global zscript zs*/

// I know, it's ugly, but needs to happen this way until I get zscript into a 
// real package.
global.zscript = require("../../zscript/dist/zscript/zscript.js");
global.zs = new zscript.Context();

// Add modules
console.log('global zs defined');
var path = require("path");
zscript.core.packages["metazen"] = path.join(__dirname, "../lib/metazen.zs");
