const LogTool = require('../../schema/Feed/Log_Tool.js');
let LogToolService = {
	list(  conditions ,  cb ) {
		LogTool.find(  )
			.limit()
			.select({ "message": 1, "user_id": 1 , "_id": 0})
			.exec(function(err, data){
				if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	save( data , cb){
		let api = new LogTool(data);
		let conditions = { user_id : data.user_id , owner :data.owner};
		LogTool.findOne(conditions , function ( err , detail ) {
			if (err) return cb(err , null);	
			if (detail == null) {
				api.save(function (err, api) {
			      if (err) return cb(err , null);
			      return cb(null, api);
			    });
			}else{
				LogTool.findOneAndUpdate( conditions , data , { upsert:false }, function(err, detail){
					if (err) return cb(err ,null);
		        	return cb(null , detail )
				}); 
			}
		})
	}
}
module.exports = LogToolService ;