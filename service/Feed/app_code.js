const AppCode = require('../../schema/Feed/App_code.js');
let AppCodeService = {
	save( data , cb){
		let api = new AppCode(data);
		api.save(function (err, api) {
	      if (err) return cb(err , null);
	      return cb(null, api);
	    });
	},
	list(conditions ,  cb ) {
		AppCode.find( conditions , function(err , data) { 
			if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	detail(conditions ,  cb ) {
		AppCode.findOne( conditions , function(err , data) { 
			if (err) return cb(err ,null);
        	return cb(null , data )
		});
	},
	update(conditions , is_tag = false,  data ,  cb ) {
		let update = data;
		if ( is_tag == true ) {
			update = { $push: { tag: data.tag }}
		}
		AppCode.findOneAndUpdate( conditions , update , { upsert:false }, function(err, success){
			if (err) return cb(err ,null);
			if (success==null) return cb('Data Not Found' ,null);
			return cb(null , success);
		}); 
	},
	update_promise(conditions ,   data ,  cb ) {
		// let update = { $push: { list_account: data } }
		let update = { list_account: data } 
		AppCode.findOneAndUpdate( conditions , update , { upsert:false }, function(err, success){
			if (err) return cb(err ,null);
			if (success==null) return cb('Data Not Found' ,null);
			return cb(null , success);
		}); 
	},
}
module.exports = AppCodeService ;