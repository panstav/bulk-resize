const fs = require('fs');
const path = require('path');

const glob = require('glob');
const extend = require('extend');

const resizeToAim = require('./resize-to-aim');
const getFileSize = require('./get-file-size');
const getWidthAndHeight = require('./get-width-and-height');
const isImage = require('./is-image');

module.exports = bulkResize;

function bulkResize(options = {}){

	return validateArguments()
		.then(ensureSourceExistsAndDir)
		.then(ensureDestinationExistsAndDir)
		.then(findFilesAtPath)
		.then(validateSizes)
		.then(resizeEach);

	function resizeEach(filePaths){

		return Promise.all(filePaths.map(resizeFileAtPath));

		function resizeFileAtPath(srcPath){

			const imOptions = {
				dstPath: `${options.destination}/${path.parse(srcPath).base}`,
				aimSize: options.toSize,
				debug: options.debug,
				srcPath
			};

			return resizeToAim(extend({}, imOptions, options));
		}

	}

	function validateArguments(){
		return new Promise((resolve, reject) => {

			if (!options.bigger && !options.width && !options.height) {
				return reject('One measurement is required, enter either -w [pixels] or -h [pixels] or -b [pixels]');
			}

			if (options.width) {
				delete options.height;
				return resolve();
			}

			delete options.width;
			resolve();

		});
	}

	function ensureSourceExistsAndDir(){
		return new Promise((resolve, reject) => {

			options.source = absolutizePath(options.source);

			fs.lstat(options.source, (err, stats) => {
				if (err) return reject(err);

				if (!stats.isDirectory()) return reject(new Error(`${options.source} is not a directory.`));

				resolve();
			});

		});
	}

	function ensureDestinationExistsAndDir(){
		return new Promise((resolve, reject) =>{

			options.destination = absolutizePath(options.destination);

			fs.lstat(options.destination, (lstatErr, stats) => {
				if (lstatErr) {

					if (lstatErr.code === 'ENOENT') return fs.mkdir(options.destination, mkdirErr => {
						if (mkdirErr) return reject(mkdirErr);
						return resolve();
					});

					return reject(lstatErr);
				}

				if (!stats.isDirectory()) return reject(new Error(`${options.destination} is not a directory.`));

				resolve();
			});

		});
	}

	function findFilesAtPath(){
		return new Promise((resolve, reject) =>{

			glob(`${options.source}/*.*`, (err, filePaths) => {
				if (err) return reject(err);

				const imagePaths = filePaths.filter(isImage);
				if (!imagePaths.length) return reject(new Error(`No images found at ${options.source}`));

				resolve(imagePaths);
			});

		});
	}

	function validateSizes(imagePaths){

		return Promise.all(imagePaths.map(pathAndSize))
			.then(ensureEnoughKilobytes)
			.then(() => Promise.all(imagePaths.map(pathWidthAndHeight)))
			.then(ensureEnoughPixels)
			.then(() => imagePaths);

		function ensureEnoughKilobytes(imageObjs){

			const imagesSmallerThanAim = imageObjs.filter(img => img.size < options.toSize);

			if (imagesSmallerThanAim.length){
				throw new Error(`Some files are smaller than aimed size (${options.toSize}kb):`, imagesSmallerThanAim
					.map(image => `\n${image.path} - ${image.size}`));
			}

			return imageObjs;
		}

		function ensureEnoughPixels(imageObjs){

			const imagesThatWouldBeEnlarged = imageObjs.filter(widthOrHeightSmallerThanArgv);

			if (imagesThatWouldBeEnlarged.length){
				throw new Error(`Some files are smaller than given ${options.width ? 'width' : 'height' } (${options.width || options.height}px): ${ imagesThatWouldBeEnlarged
					.map(image => `\n${image.path} - ${image.size}`) }`);
			}

			return imageObjs;

			function widthOrHeightSmallerThanArgv(img){
				if (options.width) return img.width < options.width;
				if (options.height) return img.height < options.height;
				if (options.bigger) {
					if (img.width > img.height) return img.width < options.bigger;
					return img.height < options.bigger;
				}
			}

		}

		function pathAndSize(imagePath){
			return getFileSize(imagePath).then(imageSize => ({ path: imagePath, size: imageSize }));
		}

		function pathWidthAndHeight(imagePath){
			return getWidthAndHeight(imagePath).then(image => ({ path: imagePath, width: image.width, height: image.height }));
		}

	}

	function absolutizePath(dirPath){

		if (!path.isAbsolute(dirPath)){
			if (dirPath.indexOf(0) !== '/') dirPath = '/' + dirPath;
			dirPath = path.resolve(process.cwd() + dirPath);
		}

		return dirPath;
	}

}