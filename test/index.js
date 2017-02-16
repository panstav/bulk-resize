const assert = require('assert');

const bulkResize = require('../lib/bulk-resize');

describe('BulkResize', () => {

	it('Should require a measurement to resize to', () => {

		bulkResize().catch(err => {
			assert(err.includes('One measurement is required'));
		});

	});

	it('Should prompt if no images were found', () => {

		const options = {
			destination: process.cwd(),
			source: process.cwd(),
			bigger: 100
		};

		bulkResize(options).catch(err => {
			assert(err.message.indexOf('No images found at') === 0);
		});

	});

});