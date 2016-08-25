const isJpg = require('is-jpg');
const readChunk = require('read-chunk');

module.exports = isImage;

function isImage(pathToFile){
	return isJpg(readChunk.sync(pathToFile, 0, 3));
}