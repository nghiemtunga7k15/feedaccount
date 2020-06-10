var mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var UserBackup =  mongoose.Schema({
    user_id                 :   { type: String , required: true },
    owner                   :   { type: String , required: true },
    name                    :   { type: String },
    username                :   { type: String },
    birthday                :   { type: String },
    email                   :   { type: String },
    gender                  :   { type: String },
    cookie                  :   { type: String },
    time_backup             :   { type: String },
    backup_photo            :   {
        friend_count   :   { type: Number },
        data           :   { type: Array , "default": []},
    },
    backup_message          :   {
        message_count  :   { type: Number },
        messages       :   { type: Array , "default": []},
    },
    backup_comment          :   {
        comment_count  :   { type: Number },
        comments       :   { type: Array , "default": []},
    },
    time_create        	    :   { type: Number },
} , { versionKey: false }  );

mongoose.model('user_backup', UserBackup).collection.dropAllIndexes(function (err, results) {
  if (err) console.log('Not Success');
});

UserBackup.plugin(AutoIncrement, {inc_field: 'user_backup_id'});

module.exports = mongoose.model('user_backup', UserBackup);
