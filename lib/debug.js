module.exports = debug;

function debug(really){

	return really
		? console.log
		: ()=>{};

}