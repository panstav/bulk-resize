#! /usr/bin/env node

const debug = require('./lib/debug');

const bulkResize = require('./lib/bulk-resize');

const argv = require('yargs')
	.usage('Usage: bulk-resize -s [kb] -d [path]')

	.demand('t')

	.option('s', {
		alias: 'source',
		default: process.cwd(),
		describe: 'Path to input file/s.',
		type: 'string'
	})

	.option('d', {
		alias: 'destination',
		default: process.cwd() + '/resized',
		describe: 'Path to output file/s.',
		type: 'string'
	})

	.option('t', {
		alias: 'aimSize',
		describe: 'Size to aim for when tinkering image quality.',
		type: 'number'
	})

	.option('b', {
		alias: 'bigger',
		describe: 'Width for horizontal images and height for vertical images, of output file/s in pixels',
		type: 'number'
	})

	.option('h', {
		alias: 'height',
		describe: 'Height of output file/s in pixels',
		type: 'number'
	})

	.option('w', {
		alias: 'width',
		describe: 'Width of output file/s in pixels',
		type: 'number'
	})

	.option('debug', {
		describe: 'Show debugging info',
		type: 'boolean',
		default: false
	})

	.help('help')
	.wrap()
	.argv;

const log = debug(argv.debug);
log({argv});

bulkResize(argv)
	.catch(err => {
		if (argv.debug) return log(err.stack);
		console.error(err.message)
	});