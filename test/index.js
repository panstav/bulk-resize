const fs = require('fs');

const assert = require('power-assert');
const mkdirp = require('mkdirp');
const download = require('download');
const del = require('del');

const bulkResize = require('../lib/bulk-resize');
const getSizeOf = require('../lib/get-width-and-height');

before(() => {
	return del('temp').then(createTestDirectories);
});

after(() => {
	return del('temp');
});

describe('BulkResize', () => {

	it('Should require a measurement to resize to', () => {

		return bulkResize().catch(err => {
			assert(err.includes('One measurement is required'));
		});

	});

	it('Should prompt if no images were found', () => {

		const options = {
			destination: process.cwd() + '/temp/dist',
			source: process.cwd() + '/temp/src',
			bigger: 100
		};

		return bulkResize(options).catch(err => {
			assert(err.message.indexOf('No images found at') === 0);
		});

	});

	it('Should be able to resize an image', () => {

		return downloadLoremAndName(50, 50)
			.then(() => {

				const options = {
					destination: process.cwd() + '/temp/dist',
					source: process.cwd() + '/temp/src',
					aimSize: 10,
					height: 10
				};

				return bulkResize(options)
					.then(() => getSizeOf(`${options.destination}/50.jpg`))
					.then(newSize => {
						assert(newSize.height === '10')
					});

			});

	});

	it('Should resize by bigger when image is horizontal', () => {

		return downloadLoremAndName(40, 20)
			.then(() => {

				const options = {
					destination: process.cwd() + '/temp/dist',
					source: process.cwd() + '/temp/src',
					aimSize: 10,
					bigger: 20
				};

				return bulkResize(options)
					.then(() => getSizeOf(`${options.destination}/20.jpg`))
					.then(newSize => {
						assert(newSize.height === '10')
					});

			});

	});

	it('Should resize by bigger when image is vertical', () => {

		return downloadLoremAndName(20, 40)
			.then(() => {

				const options = {
					destination: process.cwd() + '/temp/dist',
					source: process.cwd() + '/temp/src',
					aimSize: 10,
					bigger: 20
				};

				return bulkResize(options)
					.then(() => getSizeOf(`${options.destination}/40.jpg`))
					.then(newSize => {
						assert(newSize.height === '20')
					});

			});

	});

});

describe('Download', () => {

	it('Should be able to download an tiny image from lorempixel.com', () => {

		return downloadLorem(2, 2)
			.then(() => {
				fs.stat(process.cwd() + '/temp/src/2', (err, stats) => {
					assert(!err);
					assert(stats.size < 1000);
					return Promise.resolve();
				});
			});

	});

	it('Should be able to download a large image from lorempixel.com', () => {

		return downloadLorem(40, 80)
			.then(() => {
				fs.stat(process.cwd() + '/temp/src/80', (err, stats) => {
					assert(!err);
					assert(stats.size > 1000);
					return Promise.resolve();
				});
			});

	});

});

function createTestDirectories(){

	return makeDir('temp/src')
		.then(() => makeDir('temp/dist'));

	function makeDir(path){
		return new Promise(resolve => {
			mkdirp(path, err => {
				assert(!err);
				resolve();
			})
		});
	}

}

function downloadLorem(width, height){
	return download(`http://lorempixel.com/${width}/${height}/`, 'temp/src');
}

function downloadLoremAndName(width, height){

	return downloadLorem(width, height).then(renameFile);

	function renameFile(){
		return new Promise((resolve, reject) => {

			fs.rename(`temp/src/${height}`, `temp/src/${height}.jpg`, err => {
				if (err) return reject(err);
				resolve();
			});

		});
	}

}