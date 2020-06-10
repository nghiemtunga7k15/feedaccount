const RunSetting = require('../../schema/Feed/Run_Setting.js');
let RunSettingService = {
	save(data , cb ) {
		let api = new RunSetting(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	update( user_id , data , cb ) {
		let conditions   = { user_id : user_id };
		const update     =  data ;
		RunSetting.findOneAndUpdate(  conditions , update , { upsert: false } , function(err , updateSuccess) { 
			if ( updateSuccess == null ) {
				return cb(true ,null);
			} 
			if (err) return cb(err ,null);
        	return cb(null , updateSuccess )
		});
	},
	detail(  user_id ,  cb ) {
		RunSetting.findOne( { user_id : user_id } )
			.exec(function(err, data){
				if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	update_tool(  user_id  , data  ,  cb ) {
		let query  = { user_id : user_id } ;  
		let update = data ;  
		RunSetting.findOneAndUpdate( query , update , { upsert:false }, function(err, detail){
			if (err) return cb(err ,null);
        	return cb(null , detail )
		}); 
	},
}
module.exports = RunSettingService ;