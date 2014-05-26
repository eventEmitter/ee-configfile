!function(){

	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, type 			= require('ee-types')
		, project 		= require('ee-project')
		, argv 			= require('ee-argv');



	module.exports = new Class({

		init: function(basepath, userPath) {
			if (process.env.EE_ENV_LIVE) 	this.environment = 'live';
			if (process.env.EE_ENV_STAGING) this.environment = 'staging';
			if (process.env.EE_ENV_DEV) 	this.environment = 'dev';
			if (process.env.EE_ENV_TESTING) this.environment = 'testing';

			if (argv.has('live')) 			this.environment = 'live';
			if (argv.has('staging')) 		this.environment = 'staging';
			if (argv.has('dev')) 			this.environment = 'dev';
			if (argv.has('testing')) 		this.environment = 'testing';

			this._configPath  		= basepath+'/config.'+this.environment+'.js';
			this.config  			= {};

			if (userPath) this._userConfigPath = userPath+'/config.js';

			this._load();
		}


		, _load: function() {
			if (this.environment) {
				try {
					this.config = require(this._configPath);
				} catch (err) {
					log.warn('Failed to load config «'+this._configPath+'»: '+err)
				}
			}

			try {
				if (this._userConfigPath) {
					userConfig = require(this._userConfigPath);
				}
				else userConfig = project.config;

				Object.keys(userConfig).forEach(function(key){
					this.config[key] = userConfig[key];
				}.bind(this));
			} catch (err) {}
		}


		, getAll: function() {
			return this.config;
		}


		, get: function(key) {
			return this.config[key];
		}


		, has: function(key) {
			return !type.undefined(this.config[key]);
		}
	});
}();
