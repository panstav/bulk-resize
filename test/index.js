const assert = require('assert');

const bulkResize = require('../lib/bulk-resize');

describe('BulkResize', () => {

	it('Should require a measurement to resize to', () => {

		bulkResize().catch(err => {
			assert(err.includes('One measurement is required'));
		});

	});

});