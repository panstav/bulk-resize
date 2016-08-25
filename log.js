const debug = false;

module.exports = debug
	? console.log
	: ()=>{};