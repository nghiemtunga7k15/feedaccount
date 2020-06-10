let api  = require('../../api/');
/*----------- SERVICE -----------------*/
let serviceRunSetting = require('../../service/Feed/run_setting.js');
let serviceAppCode = require('../../service/Feed/app_code.js');
let serviceBackupData = require('../../service/BackupData/index.js');

module.exports = {
	update : function(req, res, next) {
		let token = req.params.id;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			let data = req.body;
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			serviceRunSetting.update( success.data.user_id , data, function (err , api) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
				} else { 
					return res.json( {code : 200 , msg : 'Success Update' }  );
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})

	},
	start_feed : function(req, res, next) {
		let app_code = (req.params.id);
		serviceAppCode.detail({app_code : app_code , active : 1 } , function (err , detail) {
			if( err )   return res.json( {code : 404 , data : {err : err , msg : 'Error Detail App Code'} } );
			if( detail == null )   return res.json( {code : 404 , data : {err : err , msg : 'Error Detail App Code'} } );
			let owner = detail.user_id ;
			let today   = new Date();
			let time    = new Date().getTime();
			let update = {};
			// Reset Limit
			serviceRunSetting.detail( detail.user_id ,   function (err , detailRunSetting) {
				if( err || detailRunSetting == null )  {
					return res.json( {code : 404 , data : {err : err , msg : 'Error Detail Run Setting'} } );
				} else if ( ((( time  - detailRunSetting.time_reset ) / 1000) / 60 / 60 / 24 ) >= 1 ){
					update = {
						comment_count : detailRunSetting.limit_comment , 
						post_count    : detailRunSetting.limit_post_status  , 
						like_count    : detailRunSetting.limit_like ,  
						send_request_friend_count    : detailRunSetting.limit_send_request_friend ,  
						accept_friend_count          : detailRunSetting.limit_accept_friend ,  
						time_reset                   : new Date().getTime(),
						post_index                   : 0
					}
					serviceRunSetting.update (  owner ,  update , function (err , success) {
						if( err  )  {
							return res.json( {code : 404 , data : {err : err , msg : 'Error Reset Setting'} } );
						} else {
							return res.json( {code : 404 , data : { msg : 'Reset Setting Success'} } );
						}
					})
				} else {
					// Check Time Auto Run
					let timestamp =  ( time  - detailRunSetting.last_time_run ) / 1000;
					let  hours    =  timestamp / parseInt(process.env.TIME) ;
					if ( hours >= parseFloat(detailRunSetting.auto_run) ) {	
						let _post ;
						// Post 
						let post      =  detailRunSetting.post_status.toString();
						post          =  post.split(";");
						_post         =  post;
						for ( let idx =  detailRunSetting.post_index ; idx <=  post.length; i ++ ) {
							post = post[idx];
							break; 
						}
						// Comment
						let comment   =  detailRunSetting.newsfeed_comment.toString();
						comment       =  comment.split(";");
						comment       =  comment.length;
						comment       =  detailRunSetting.comment_count  >= comment ? comment : detailRunSetting.comment_count;
						// Like 
						let like      = detailRunSetting.like_count >= detailRunSetting.newsfeed_like ? detailRunSetting.newsfeed_like : detailRunSetting.like_count;
						// Index Post 
						let idx_post
						if ( detailRunSetting.post_index < _post.length - 1  ) {
							idx_post = detailRunSetting.post_index + 1;
						} else {
							idx_post =0;
						}
						let setting   =  { 
							like             : like    >= 0  ? like : 0 ,
							comment          : comment >= 0  ? comment  : 0,
							post             : detailRunSetting.post_count > 0 ? 1 : 0,
							accept_friend    : detailRunSetting.accept_friend_count >=  detailRunSetting.accept_friend && detailRunSetting.limit_accept_friend - detailRunSetting.accept_friend_count   > detailRunSetting.accept_friend ? detailRunSetting.accept_friend : detailRunSetting.accept_friend_count ,
							send_request_friend   : detailRunSetting.send_request_friend_count >=  detailRunSetting.send_request_friend && detailRunSetting.limit_send_request_friend - detailRunSetting.send_request_friend_count   > detailRunSetting.send_request_friend ? detailRunSetting.send_request_friend : detailRunSetting.send_request_friend_count ,
							idx_post         : idx_post,
							thread           : detailRunSetting.thread,
							time_run         : detailRunSetting.time_run,
							time_backup      : detailRunSetting.time_backup,
							time_delay_min   : detailRunSetting.time_delay_min,
							time_delay_max   : detailRunSetting.time_delay_max,
							version          : detailRunSetting.version,
							last_time_run    : detailRunSetting.last_time_run,
							block_image      : detailRunSetting.block_image,
							status           : detailRunSetting.status,
							auto_run         : detailRunSetting.auto_run,
							read_notify      : detailRunSetting.read_notify,
							newsfeed_like    : detailRunSetting.newsfeed_like,
							newsfeed_comment : detailRunSetting.newsfeed_comment,
							post_status      : post != undefined ? post : 'null',
							time_create      : detailRunSetting.time_create,
						}
						let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/list?owner=${detail.user_id}`;
						let obj = { owner : detail.user_id  , status_care : 1 };
						api.requestUrl(url , 'GET'  , obj , {}).then(list_cookie=>{
								if ( detailRunSetting == null ||  list_cookie.data.length == 0 ) {
										return res.json( { code : 404 , data : { setting : null  , account :  null  } } );
									}else{
										serviceAppCode.list( { user_id : detail.user_id }, function ( err  , list_app) {
											if ( err ) {
												return res.json( {code : 404 , data : {err : err , msg : 'Error Get List App Code'} } );
											} else {
												let idx_for_list_app = 0;
												// Promise Update Array user_id
												function promise ( arr , idx_app_code ) {
													return new Promise(function(resolve , reject) { 
															serviceAppCode.update_promise({ app_code : list_app[idx_app_code].app_code , active : 1 } , arr , function ( err , update_success ) {
																if ( err ) {
																	return reject(err);
																}else{
																	return resolve(update_success);
																}
															})
													})
												}
												let arr_account = [];
												let total = parseInt( parseInt(list_cookie.data.length) / parseInt(list_app.length) );
												let number = total;
												let number_loop_down = parseInt(list_app.length) * total;
												let promise_all = [];
												//  Chia Token 
												for (let idx = 0 ; idx <= parseInt(list_cookie.data.length) ; idx++) {
													if (list_cookie.data[idx] != undefined) {
														arr_account.push(list_cookie.data[idx].user_id);
													}
													if ( idx  == total -1   ) {
														total = total + number;
														if ( total - parseInt(list_cookie.data.length) >= 0  ) {
															for (let idx = parseInt(list_cookie.data.length - 1) ; idx > number_loop_down  - 1  ; idx--) {
																if (list_cookie.data[idx] != undefined) {
																	arr_account.push(list_cookie.data[idx].user_id);
																}
															}
														}
														promise_all.push(promise(arr_account , idx_for_list_app));
														idx_for_list_app++;
														arr_account   = [];
													}
												}
												// Gọi tới Promise 
												Promise.all(promise_all)
													.then(success=>{
														return res.json( {code : 200 , data : { setting : setting  , account :  list_cookie } } );
													})
													.catch(err=>{
														return res.json( {code : 404 , data : { err : err , msg : 'Error Promise Update'} } );
												})
											}
										})
									}
								})
						.catch(err=>{
							return res.json( {code : 404 , data : {err : err , msg : 'Error Get List Cookie'} } );
						})
					} else {
						return res.json( {code : 404 , data : {err : err , msg : 'Error Time Limit'} } );
					}
				}
			})
		})
	},
	update_tool : function(req, res, next) {
		let token = req.params.id;
		let json = JSON.stringify(req.body);
		json     = JSON.parse(json);
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let owner = (success.data.user_id);
			serviceRunSetting.update_tool( owner  ,  { status :  parseInt(json.status) ,  last_time_run : parseInt(json.last_time_run) } , function (err , detailRunSetting) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err  , msg : 'Error'}} );
				} else { 
						let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update_many?owner=${owner}`;
						let data = { status_care : parseInt(json.status) }
						api.requestUrl(url , 'PUT' , owner  ,data).then(success=>{
							return res.json( {code : 200 , data : success } );
						})
						.catch(err=>{
							return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
					})
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	update_tool_v2 : function(req, res, next) {
		let app_code = req.params.id;
		let json = JSON.stringify(req.body);
		json     = JSON.parse(json);
		serviceAppCode.detail({app_code : app_code , active : 1 } , function (err , detail) {
			if ( detail == null ) return res.json( {code : 404 , data : { err : err  , msg : 'Error App Code'} } );
			let owner =  detail.user_id;
			serviceRunSetting.update_tool( owner  , { status :  parseInt(json.status)} , function (err , detailRunSetting) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
				} else { 
						let data = { status_care : parseInt(json.status) }
						if ( req.query.user_id ) {
							let user_id = req.query.user_id;
							let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update/${user_id}?owner=${owner}`;
							api.requestUrl(url , 'PUT' , owner  ,data).then(success=>{
								return res.json( {code : 200 , data : success } );
							})
							.catch(err=>{
								return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
							})
						} else {
							let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update_many?owner=${owner}`;
							api.requestUrl(url , 'PUT' , owner  , data ).then(success=>{
								return res.json( {code : 200 , data : success } );
							})
							.catch(err=>{
								return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
							})
						}
				}
			})
		})
	},
	update_fb_user : function(req, res, next) {
		let app_code = req.params.app_code;
		let user_id = req.params.user_id;
		let json = JSON.stringify(req.body);
		json     = JSON.parse(json);
		serviceAppCode.detail({app_code : app_code , active : 1 } , function (err , detail) {
			if ( detail == null ) return res.json( {code : 404 , data : { err : err  , msg : 'Error App Code'} } );
			let owner =  detail.user_id;
			let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update/${user_id}?owner=${owner}`;
			let data = { fb_dtsg : json.fb_dtsg , user_agent : json.user_agent , cookie : json.cookie , token : json.token , last_time_fb_dtsg : json.last_time_fb_dtsg , last_time_check : json.last_time_check  , status : json.status }
			api.requestUrl(url , 'PUT' , owner  ,data).then(success=>{
				return res.json( {code : 200 , data : success } );
			})
			.catch(err=>{
				return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
			})
		})
	},
	update_fb_user_from_web : function(req, res, next) {
		let token   = req.params.token;
		let user_id = req.params.user_id;
		let json = JSON.stringify(req.body);
		json     = JSON.parse(json);
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let owner = success.data.user_id ;
			let data =  json;
			data.status_care = 2;
			let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update/${user_id}?owner=${owner}`;
			api.requestUrl(url , 'PUT' , owner  ,data).then(success=>{
				return res.json( {code : 200  } );
			})
			.catch(err=>{
				return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	detail : function(req, res, next) {
		let token = req.params.id;
		api.requestUrl(`${process.env.VNP_API_URL}/api/users/detail/bk` , 'GET'  , {} , {} , token).then(success=>{
			if ( !success || success ==null ) {
				return res.json( {code : 404 , data : {err : err , msg : 'Error User'} } );
			}
			let owner = (success.data.user_id );
			serviceRunSetting.detail(  owner ,  function ( err , detail){
				if (detail == null) {
					let data = {};
					data.user_id = owner;
					data.time_create = new Date().getTime();
					data.time_reset  = new Date().getTime();
					serviceRunSetting.save(data, function (err , api) {
						if(err)  {
							return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
						} else { 
							return res.json( {code : 200 , data : api } );
						}
					})
				}else{
					if(err) {
						return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
					} else{
						return res.json( {code : 200 , data : detail } );
					}
				}
			})
		}).catch(err=>{
			return res.json( {code : 404 , data : { err : err , msg : 'User Not Found'} } );
		})
	},
	update_by_service : function(req, res, next) {
		let app_code = req.params.app_code;
		let json = JSON.stringify(req.body);
		json     = JSON.parse(json);
		let update =  { 
					"$inc": 
					{ 
						"accept_friend_count"       : - json.accept_friend ,
					 	"send_request_friend_count" : - json.send_request_friend , 
					 	"comment_count"             : - json.comment , 
					 	"like_count"                : - json.like , 
					 	"post_count"                : - json.post  , 
					} ,
					last_time_run : new Date().getTime(),
					post_index    : json.idx_post

		}
		serviceAppCode.detail({app_code : app_code , active : 1 } , function (err , detail) {
			if ( detail == null ) return res.json( {code : 404 , data : { err : err  , msg : 'Error App Code'} } );
			let owner =  detail.user_id;
			serviceRunSetting.update( owner  ,  update , function (err , update_success) {
				if(err)  {
					return res.json( {code : 404 , data : { err : err  , msg : 'Error'}} );
				} else { 
					serviceRunSetting.update_tool( owner  , 1, function (err , detailRunSetting) {
						if(err)  {
							return res.json( {code : 404 , data : { err : err  , msg : 'Error'}} );
						} else { 
								let url = `${process.env.GET_TOKEN_URL}/api/v2/profile_care/update_many?owner=${owner}`;
								let data = { status_care : 1 }
								api.requestUrl(url , 'PUT' , owner  ,data).then(success=>{
									return res.json( {code : 200 , data : { msg : 'Success'}} );
								})
								.catch(err=>{
									return res.json( {code : 404 , data : { err : err  , msg : 'Error'} } );
							})
						}
					})
				}
			})
		})
	},
}  