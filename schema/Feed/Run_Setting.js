var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var RunSettingSchema =  mongoose.Schema({
    user_id                 :   { type: String , required: true  , unique: true  },  /* Owner */
    thread                  :   { type: Number , required: true  , "default": 5 },
    time_run                :   { type: Number , required: true  , "default": 30 },
    time_backup             :   { type: String , "default": "01/01/2020"},
    version                 : 	{ type: Number , "default": 1 },
    last_time_run           :   { type: Number , "default": 0 },
    block_image             : 	{ type: Number , "default": 1 },
    status                  :   { type: Number , default : 0 },
    auto_run                :   { type: String , default : '4' },
    time_delay_min          :   { type: Number , default : 5},
    time_delay_max          :   { type: Number , default : 10},
    like_count              :   { type: Number , default : 0 },
    comment_count           :   { type: Number , default : 0 },
    post_count              :   { type: Number , default : 0 },
    accept_friend_count     :   { type: Number , default : 0 },
    send_request_friend_count     :   { type: Number , default : 0 },
    post_status             :   { type: String },
    post_index              :   { type: Number  , default : 0 },
    newsfeed_comment        : 	{ type: String },
    newsfeed_like           : 	{ type: Number },
    limit_like              :   { type: Number  , default : 0 },
    limit_comment           :   { type: Number  , default : 0 },
    limit_read_notify       :   { type: Number  , default : 0 },
    limit_accept_friend     :   { type: Number  , default : 0 },
    limit_send_request_friend:  { type: Number , default : 0 },
    limit_post_status       :   { type: Number  , default : 0 },
    read_notify             : 	{ type: Number },
    accept_friend           : 	{ type: Number },
    send_request_friend     : 	{ type: Number },
    share_post              : 	{ type: Number },
    time_create        	    :   { type: Number },
    time_reset              :   { type: Number },
} , { versionKey: false }  );

mongoose.model('run_setting', RunSettingSchema).collection.dropAllIndexes(function (err, results) {
  if (err) console.log('Not Success');
});


RunSettingSchema.plugin(AutoIncrement, {inc_field: 'run_setting'});

module.exports = mongoose.model('run_setting', RunSettingSchema);
