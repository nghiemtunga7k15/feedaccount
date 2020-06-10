const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
let api  = require('../../api/');

/*----------- SERVICE -----------------*/
let serviceLogTool = require('../../service/Feed/log_tool.js');
let serviceAppCode = require('../../service/Feed/app_code.js');

module.exports = {
	create : function(req, res, next) {
		let app_code = req.params.id;
		let json = JSON.stringify(req.body);
		json = JSON.parse(json);
		serviceAppCode.detail({app_code : app_code} , function (err , detailAppCode) {
			if(err)  return res.json( {code : 404 , data : {err : err , msg: 'Error'} } );
			if(detailAppCode == null)  return res.json( {code : 404 , data : {err : err , msg: 'App Code Null'} } );
				let data = { 
					user_id              :      json.user_id ,
					owner                :		detailAppCode.user_id ,
					app_code             :		app_code ,
					message              :		json.message ,
					time_create          :		new Date().getTime() ,
				}
				serviceLogTool.save( data, function (err , api) {
					if(err)  {
						return res.json( {code : 404 ,data : {err : err , msg: 'Error'} } );
					} else { 
						return res.json( {code : 200 , data :  { data : api , msg :'Success' } } );
					}
				})
			})
	},
	detail : function(req, res, next) {
		let token    = req.params.id;
		let app_code = req.params.app_code;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let owner = success.data.user_id;
			serviceLogTool.list(  { owner : owner , app_code : app_code } ,  function ( err , data){
				if(err)  {
					return res.json( {code : 404 , err : err } );
				} else { 
					return res.json( {code : 200 , data : data } );
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	// save_tool : function(req, res, next) {
	// 	var string_generate = crypto.randomBytes(10).toString('hex');
	// 	let time = new Date().getTime();

	// 	let data = { code_user : `${string_generate}${time.toString()}` }
	// 	let token = req.query.token;
	// 	api.requestUrl(`${process.env.VNP_API_URL}/api/users/update/bk` , 'POST'  , {} , data  , token ).then(success=>{
	// 		return res.json( {code : 200 , data : { code_user : `${string_generate}${time.toString()}` , data : success }   } );
	// 	}).catch(err=>{
	// 		return res.json( {code : 404 , data : {err : err} } );
	// 	})
	// },
	download : function(req, res, next) {
		let absPath = path.join(__dirname, '../../public/', 'Download/RunnerCore.zip');
 		res.download(absPath);
	}
}  