const async = require('async');
const im = require('imagemagick');
const mathjs = require('mathjs');
const extend = require('extend');

const getFileSize = require('./get-file-size');

const debug = require('./debug');
var log;

module.exports = resizeToAim;

function resizeToAim(brOptions){

	log = debug(brOptions.debug);

	const imOptions = extend({}, { quality: 1, modifier: -0.1 }, brOptions);

	return resizeFile()
		.then(iterate)
		.then(changeDirection)
		.then(iterate);

	function iterate(){

		return new Promise((resolve, reject) => {

			async.during(yet_to_pass, resizeFile, err => {
				if (err) return reject(err);
				resolve();
			});

		});

		function yet_to_pass(callback){

			getFileSize(imOptions.dstPath).then(checkSize).catch(callback);

			function checkSize(fileSize){

				var didpass;

				if (imOptions.modifier < 0){
					// we're going down
					didpass = fileSize < imOptions.aimSize;
				} else {
					// we're backing up
					didpass = fileSize > imOptions.aimSize;
				}

				log({fileSize, quality: imOptions.quality, dstPath: imOptions.dstPath});

				// if it has yet to pass - apply the modifier
				// this is basically the counter of our iterator
				if (!didpass) imOptions.quality = mathjs.round(mathjs.eval('quality + modifier', imOptions), 2);

				callback(null, !didpass);
			};
		}
	}

	function resizeFile(done){

		const p = new Promise((resolve, reject) => {

			im.resize(imOptions, err =>{
				if (err) return reject(err);
				resolve();
			});

		});

		return done
			? p.then(() => done()).catch(done)
			: p;

	}

	function changeDirection(){
		log('changing direction');
		imOptions.modifier = 0.01;
	}

}