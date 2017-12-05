var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../');
	
module.exports = {
	development: {
//            "facebook_api_key"      :     "1899964336922371",
//            "facebook_api_secret"   :     "c39ae58aa549d1dbd527b23affb7192e",
//            "callback_url"          :     "http://localhost:3000/auth/facebook/callback",
            rootPath: rootPath,
//            db: 'mongodb://simerjit_fwrk:simerjit@ds141464.mlab.com:41464/wedding',
            db: 'mongodb://honey_fwrk:honey@ds129966.mlab.com:29966/dost',
            port: process.env.PORT ||8080
	},
	production: {
		rootPath: rootPath,
		db: process.env.MONGOLAB_URI || 'you can add a mongolab uri here ($ heroku config | grep MONGOLAB_URI)',
		port: process.env.PORT || 80
	},
         'googleAuth' : {
            'clientID'      : '754405338360-ojco8jggpmm2faq8vul10le1d2qsolfg.apps.googleusercontent.com',
            'clientSecret'  : 'foKphh6MtTsE7480-GkIVokb',
            'callbackURL'   : 'http://localhost:8080/auth/google/callback'
        }
};