var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var AppCodeSchema =  mongoose.Schema({
    user_id             :   { type: String , required: true },
    app_code            :   { type: String , required: true , unique: true },
    active              :   { type: Number , default : 0 }, // 0 Default , 1 Start , 2 Stop
    tag                 :   { type: Array  }, 
    list_account        :   { type: Array  }, 
    pc_name        	    :   { type: String },
    time_create        	:   { type: Number },
} , { versionKey: false } );

mongoose.model('care_app', AppCodeSchema).collection.dropAllIndexes(function (err, results) {
  if (err) console.log('Not Success');
});

AppCodeSchema.plugin(AutoIncrement, {inc_field: 'app_code_id'});

module.exports = mongoose.model('care_app', AppCodeSchema);
