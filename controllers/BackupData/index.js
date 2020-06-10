let api  = require('../../api/');

/*----------- SERVICE -----------------*/
let serviceBackupData = require('../../service/BackupData/index.js');
let serviceAppCode = require('../../service/Feed/app_code.js');

module.exports = {
	save : function(req, res, next) {
		let app_code = req.params.id ? req.params.id : null;
		serviceAppCode.detail({ app_code : app_code } , function(err , detail){
			if ( err ) {
				return res.json( {code : 404 , data : { err : err , msg : 'Error App Code'} } );
			}
			if ( detail == null ) {
				return res.json( {code : 404 , data : { err : err , msg : 'Error App Code Not Found'} } );
			}
			let json = JSON.stringify(req.body);
			json = JSON.parse(json);
			let data = {
				owner       	  : detail.user_id,
				user_id     	  : json.backup_user.id,
				name        	  : json.backup_user.name,
				username          : json.backup_user.username,
				birthday   	      : json.backup_user.birthday,
				email       	  : json.backup_user.email,
				gender      	  : json.backup_user.gender,
				cookie      	  : json.backup_user.cookie,
				backup_photo      : json.backup_photo,
				backup_message    : json.backup_message,
				backup_comment    : json.backup_comment,
				time_create       : new Date().getTime() 
			};
			let  conditions = { owner : detail.user_id ,  user_id :  json.backup_user.id };
			serviceBackupData.detail( conditions , function (err , detail ) {
					if ( err ) {
						 res.json( {code : 404 , data : {err : err , msg : 'Error Data'} } );
					}
					if ( !detail || detail == null ) {
						serviceBackupData.save(data , function (err ,api) {
								if ( err ) {
									return res.json( {code : 404 , data : { err : err , msg : 'Error Save'} } );
								}else{
									return res.json( {code : 200 } );
								}
						})
					} else {
						serviceBackupData.update( conditions ,  data , function (err ,api) {
								if ( err ) {
									return res.json( {code : 404 , data : { err : err , msg : 'Error Update'} } );
								}else{
									return res.json( {code : 200 } );
								}
						})
					}
			})
		})
	},
	detail : function(req, res, next) {
		let token   = req.query.token;
		let user_id = req.params.id ;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success == null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			if ( success.code == 200 ) {
				let conditions = { user_id : user_id , owner : success.data.user_id };
				serviceBackupData.detail( conditions , function (err , detail ) {
					if ( err ) {
						return res.json( {code : 404 , data : {err : err , msg : 'Error Data'} } );
					}
					if ( !detail && detail == null ){
						return res.json( {code : 404 , data : {err : err , msg : 'Error Data Not Found'} } );
					}
					else{
						return res.json( {code : 200  ,  data : detail } );
					}
				})
			}
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	}
}  