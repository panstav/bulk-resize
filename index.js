const fs = require('fs');

const async = require('async');
const im = require('imagemagick');
const mathjs = require('mathjs');
const extend = require('extend');

const log = require('./log');

module.exports = resize;

var imOptions = {};

function resize(brOptions){

	// imOptions = {
	// 	srcPath: brOptions.filePath,
	// 	dstPath: brOptions.dstPath,
	// 	aimSize: 160,
	// 	width: 500
	// };

	imOptions = extend({}, { quality: 1, modifier: -0.1 }, brOptions);

	return resizeFile()
		.then(iterate)
		.then(changeDirection)
		.then(iterate)
		.then(getFileSize())
		.catch(err => {
			console.error(err);
			console.error(err.stack);
		});

}

function iterate(){

	return new Promise((resolve, reject) => {

		async.during(yet_to_pass, resizeFile, err => {
			if (err) return reject(err);
			resolve();
		});

	});

	function yet_to_pass(callback){

		getFileSize().then(checkSize).catch(callback);

		function checkSize(fileSize){

			var didpass;

			if (imOptions.modifier < 0){
				// we're going down
				didpass = fileSize < imOptions.aimSize;
			} else {
				// we're backing up
				didpass = fileSize > imOptions.aimSize;
			}

			// if it has yet to pass - apply the modifier
			// this is basically the counter of our iterator
			if (!didpass) imOptions.quality = mathjs.round(mathjs.eval('quality + modifier', imOptions), 2);

			callback(null, !didpass);
		};
	}
}

function resizeFile(done){

	const p = new Promise(resize);

	return done
		? p.then(() => done()).catch(done)
		: p;

	function resize(resolve, reject){

		im.resize(imOptions, err =>{
			if (err) return reject(err);
			resolve();
		});

	}

}

function getFileSize(){
	return new Promise((resolve, reject) => {

		fs.stat(imOptions.dstPath, (err, stats) => {
			if (err) return reject(err);
			const size = mathjs.eval('size / 1000', stats);
			log('Quality', imOptions.quality);
			log('Size', size);
			resolve(size);
		});

	});
}

function changeDirection(){
	log('changing direction');
	imOptions.modifier = 0.01;
}