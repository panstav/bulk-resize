const im = require('imagemagick');

module.exports = getWidthAndHeight;

function getWidthAndHeight(imagePath){
	return new Promise((resolve, reject) => {

		im.identify(['-format', '%wx%h', imagePath], (err, output) => {
			if (err) return reject(err);

			const size = output.trim().split('x');

			resolve({ width: size[0], height: size[1] });
		});

	});
}