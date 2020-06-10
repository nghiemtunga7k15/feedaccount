const fs = require('fs');
const path = require('path');
const crypto = require("crypto");

let api  = require('../../api/');
/*----------- SERVICE -----------------*/
let serviceAppCode = require('../../service/Feed/app_code.js');
let serviceRunSetting = require('../../service/Feed/run_setting.js');
module.exports = {
	create : function(req, res, next) {
		let token = req.query.token;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			var string_generate = crypto.randomBytes(10).toString('hex');
			let time = new Date().getTime();
			let data = {
				app_code	         : `${string_generate}${time.toString()}` ,
				user_id              : success.data.user_id,
				tag                  : "R1",
				time_create          : new Date().getTime() ,
			}
			serviceAppCode.list( { user_id : success.data.user_id } , function ( err  , detail){
				if ( err ) {
					return res.json( {code : 404 , data : { err : err , msg : 'Error Detail AppCode'} } );
				} else if ( !detail || detail == null ){
					serviceAppCode.save(  data, function (err , api) {
						if(err)  {
							return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
						} else { 
							return res.json( {code : 200 ,  data : { app_code : api.app_code , tag : api.tag , msg : 'Success'} }  );
						}
					})
				} else {
					data.tag = `R${detail.length + 1}`;
					serviceAppCode.save(  data, function (err , api) {
						if(err)  {
							return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
						} else { 
							return res.json( {code : 200 ,  data : { app_code : api.app_code , tag : api.tag , msg : 'Success'} }  );
						}
					})				
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	list : function(req, res, next) {
		let token = req.query.token;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let conditions   =  { user_id : success.data.user_id }
			serviceAppCode.list(  conditions, function (err , data) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
				} else { 
					return res.json( {code : 200 ,  data : data.length > 0  ? data : null  }  );
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	check_id_user : function(req, res, next) {
		let app_code    = req.params.id;
		let json = JSON.stringify(req.body);
		json = JSON.parse(json);
		let conditions = { app_code : app_code };
		let data = {  active : json.active ,  pc_name : json.pc_name };
		serviceAppCode.update(  conditions , false  ,data, function (err , data) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
				} else { 
					return res.json( {code : 200  }  );
				}
		})
	},
	update : function(req, res, next) {
		let app_code    = req.params.app_code;
		let json = JSON.stringify(req.body);
		json = JSON.parse(json);
		serviceAppCode.detail({app_code : app_code , active : 1 } , function (err , detail) {
			if ( err  || detail == null )  {
				return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
			} else {
				let user_id    = detail.user_id;
				let data       = {  time_backup : json.time_backup  };
				serviceRunSetting.update(  user_id, data, function (err , data) {
						if(err)  {
							return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
						} else { 
							return res.json( {code : 200  }  );
						}
				})
			} 
		})
	},
	update_tag : function(req, res, next) {
		let app_code    = req.params.app_code;
		let json = JSON.stringify(req.body);
		json = JSON.parse(json);
		serviceAppCode.update({app_code : app_code , active : 1 } , true  , json ,   function (err , detail) {
			if ( err  || detail == null )  {
				return res.json( {code : 404 , data : { err : err , msg : 'Error'} } );
			} else {
				return res.json( {code : 200 } );
			} 
		})
	},
}  