var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var LogTool =  mongoose.Schema({
    user_id             :   { type: String , required: true , unique: false },
    owner               :   { type: String , required: true , unique: false },
    // fb_id               :   { type: String , required: true , unique: false },
    message             : 	{ type: String  },
    app_code        	:   { type: String },

    time_create        	:   { type: Number },
    time_update        	:   { type: Number },
} , { versionKey: false } );


mongoose.model('log_tool', LogTool).collection.dropAllIndexes(function (err, results) {
  if (err) console.log('Not Success');
});

LogTool.plugin(AutoIncrement, {inc_field: 'log_tool'});

module.exports = mongoose.model('log_tool', LogTool);
