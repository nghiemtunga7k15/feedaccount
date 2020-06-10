var express = require('express');
var router = express.Router();

/*----------------- CONTROLLERS---------------------*/
var controllerFeed = require('../controllers/Feed/index.js');
var controllerRunSetting = require('../controllers/Feed/run_setting.js');
var controllerLogTool = require('../controllers/Feed/log_tool.js');
var controllerAppCode = require('../controllers/Feed/app_code.js');
/*----------------- BACKUP DATA --------------------*/
var controllerBackupData = require('../controllers/BackupData/index.js');



/* FEED (Get List , Create , Delete Cookie)*/ 
router.get('/fb_accounts/list-account/:id', controllerFeed.list);
router.post('/fb_accounts/create-many/:id', controllerFeed.create_many);
// router.put('/fb_accounts/update/:app_code', controllerFeed.update);
router.delete('/fb_accounts/list-account/delete/:id/:fb_id', controllerFeed.delete);

/* RUN SETTING */
// Update By Token UI 
router.put('/fb_accounts/run-setting/:id', controllerRunSetting.update);
// Update Lasttime Run By AppCode Service and status Account and status Setting = 1  , Update Data Respons Like ,  Comment , Post còn lại sau khi chạy 
router.put('/fb_accounts/run-setting/update/:app_code', controllerRunSetting.update_by_service);
// Save
router.get('/fb_accounts/run-setting/:id', controllerRunSetting.detail);
// User Cick Run Tool and Update setting and status = 1 
router.put('/fb_accounts/run-tool/:id', controllerRunSetting.update_tool);
router.put('/fb_accounts/run-tool2/:id', controllerRunSetting.update_tool_v2);
// Service Scan and status = 2 ,
router.get('/fb_accounts/run/:id', controllerRunSetting.start_feed);
// Update User { fb_dtsg : user_agent  } Cho  Tool
router.put('/fb_accounts/update-fbuser/:app_code/:user_id', controllerRunSetting.update_fb_user);
// Update User { fb_dtsg : user_agent  } Cho User
router.put('/fb_accounts/update/:token/:user_id', controllerRunSetting.update_fb_user_from_web);
// Update Time Backup Setting
router.put('/fb_accounts/update/:app_code',  controllerAppCode.update);


/* LOG TOOL */
router.put('/fb_accounts/log-tool/:id', controllerLogTool.create);
router.get('/fb_accounts/log-tool/:id/:app_code', controllerLogTool.detail);
/* SAVE TOLL */
router.get('/fb_accounts/save-tool',  controllerLogTool.download);
/* APP CODE */
router.post('/fb_accounts/save-tool',  controllerAppCode.create);
router.get('/fb_accounts/app-code/list',  controllerAppCode.list);
// Check App Code và chuyển value Active 
router.put('/fb_accounts/check-app/:id',  controllerAppCode.check_id_user);
// Update Tag 
router.put('/fb_accounts/update-tag/:app_code',  controllerAppCode.update_tag);

/* BACKUPDATA */
router.post('/fb_accounts/backup/create/:id',  controllerBackupData.save);
router.get('/fb_accounts/backup/detail/:id',  controllerBackupData.detail);

module.exports = router;
