const requestify = require('requestify');
let api = {
	requestUrl(  url ,  method , obj  , params , token = '') {
		return new Promise(function(resolve, reject) { 
			requestify.request( url , {
				method : method,
				body   : params,
				data   : params,
				params : method == 'GET'  ? obj : {},
				headers: {
			        'Authorization': `${process.env.TOKEN}`,
			        'authorizations': `JWT ${token}`,
			    },
				})
				.then(function(response) {
				  	return resolve(JSON.parse(response.body))
				})
				.catch(err=>{
					return reject(err)
				})
		});
	}
}
module.exports = api ;