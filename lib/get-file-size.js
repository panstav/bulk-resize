const fs = require('fs');

const mathjs = require('mathjs');

module.exports = getFileSize;

function getFileSize(filePath){
	return new Promise((resolve, reject) => {

		fs.stat(filePath, (err, stats) => {
			if (err) return reject(err);
			resolve(mathjs.divide(stats.size, 1000));
		});

	});
}