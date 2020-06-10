const BackupData = require('../../schema/BackupData/index.js');
let BackupDataService = {
	save(data , cb ) {
		let api = new BackupData(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	detail(conditions , cb ) {
		BackupData.findOne( conditions , function(err , data) { 
			if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	update(conditions , update , cb ) {
		BackupData.findOneAndUpdate( conditions ,  update , { upsert:false }, function(err, success){
			if (err) return cb(err ,null);
			if (success==null) return cb('Data Not Found' ,null);
			return cb(null , success);
		}); 
	},
}
module.exports = BackupDataService ;