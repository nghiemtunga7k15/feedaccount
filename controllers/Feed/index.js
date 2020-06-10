let api  = require('../../api/');
/*----------- SERVICE -----------------*/
let serviceAppCode = require('../../service/Feed/app_code.js');
let serviceRunSetting = require('../../service/Feed/run_setting.js');

module.exports = {
	list : function(req, res, next) {
		let token = req.params.id;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let obj = {  owner : success.data.user_id   }
			let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/list?owner=${success.data.user_id }`;
			api.requestUrl(url , 'GET'  , obj , {}).then(list_cookie=>{
						return res.json( {code : 200 , data : list_cookie.data } );
			})
			.catch(err=>{
				return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
			})	
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	create_many : function(req, res, next) {
		let token = req.params.id;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let jsonData = JSON.stringify(req.body);
			let arrData = JSON.parse(jsonData);
			function getUnique(arr, comp) {
			  const unique = arr
			       .map(e => e[comp])
			    .map((e, i, final) => final.indexOf(e) === i && i)
			    .filter(e => arr[e]).map(e => arr[e]);
			   return unique;
			}
			arrData = (getUnique(arrData,'user_id'));
			let	owner = success.data.user_id;
			let data = {
				accounts             :      arrData
			}
			let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/add?owner=${owner}`;
			api.requestUrl(url , 'POST' , owner   ,data).then(success=>{
				return res.json( {code : 200 , data : success } );
			})
			.catch(err=>{
				return res.json( {code : 404 , err : err } );
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	delete : function(req, res, next) {
		let token = req.params.id;
		let user_id = (req.params.fb_id);
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/delete?owner=${success.data.user_id }`;
			let obj = {owner : success.data.user_id   , user_id : user_id};
			api.requestUrl(url , 'GET'  , obj , {}).then(success=>{
				return res.json( {code : 200 , data : success.data } );
			})
			.catch(err=>{
				return res.json( {code : 404 , err : err } );
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})	
	},
	// update : function(req, res, next) {
	// 	let json = JSON.stringify(req.body);
	// 	json     = JSON.parse(json);
	// 	let app_code = req.params.app_code;
	// 	serviceAppCode.detail( { app_code : app_code  } , function (err , detail_app_code) {
	// 		if ( err ||  !detail_app_code || detail_app_code == null ) {
	// 			return res.json( {code : 404 , data : { err : err , msg : 'Error App Code Not Found'} } );
	// 		} else {
	// 			let update =  { 
	// 				"$inc": 
	// 				{ 
	// 					"accept_friend_count"       : - json.accept_friend ,
	// 				 	"send_request_friend_count" : - json.send_request_friend , 
	// 				 	"comment_count"             : - json.comment , 
	// 				 	"like_count"                : - json.like , 
	// 				 	"post_count"                : - json.post  , 
	// 				 	"post_index"                : json.idx_post
	// 				} 
	// 			}
	// 			serviceRunSetting.update (  detail_app_code.user_id ,  update , function (err , success_update) {
	// 				if( err  )  {
	// 					return res.json( {code : 404 , data : {err : err , msg : 'Error Update Setting'} } );
	// 				} else {
	// 										return res.json( { code : 200 } );
	// 				}
	// 			})
	// 		}
	// 	})
	// },
}  