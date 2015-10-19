(function() {
	'use strict';


	let   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, path 			= require('path')
		, type 			= require('ee-types')
		, project 		= require('ee-project')
		, argv 			= require('ee-argv')
		;



	let environments = {
		  live 		: 'live'
		, staging 	: 'staging'
		, dev 		: 'dev'
		, testing 	: 'testing'
	};






	module.exports = new Class({


		// the name of the envirnoment
		environmentName: null

		// the public name of the environemnt
		, environment: null



		// the path where we can find the config files
		, basePath: null

		// the user may also provide a custom config file
		, userConfigPath: null




		/**
		 * sets up the class, determines the environment
		 */
		, init: function(basePath, userPath) {

			// check if an environent is loaded
			Object.keys(environments).some((env) => {
				if (process.env['EE_ENV_'+env.toUpperCase()] || process.env['ENV_'+env.toUpperCase()] || argv.has(env)) {
					this.environment = environments[env];
					this.environmentName = env;
					return true;
				}
			});



			// store options
			this.basePath = basePath;

			// maybe the user provided a custom config path
			if (userPath) this.userConfigPath = userPath;



			// set up a dummy config object, it should be overwritten later on
			this.config = {};


			// load the configfies
			this._load();
		}






		/**
		 * loads the config files
		 */
		, _load: function() {
			let filePath, userConfig;


			// try to load the config path for the loaded envirnoment
			if (this.environment === this.environmentName) {
				filePath = path.join(this.basePath, 'config.'+this.environment+'.js');
			}
			else if (this.environmentName) {
				filePath = path.join(this.basePath, 'config.'+this.environmentName+'.js');
			}


			// load the config
			try {
				this.config = require(filePath);
			} catch (err) {
				log.warn('Failed to load config «'+filePath+'»: '+err)
			}



			// try to load the user config
			if (this.userConfigPath) {

				try {
					userConfig = require(path.join(this.userConfigPath, 'config.js'));
				} catch (err) {
					userConfig = project.config;
				}
			}
			else userConfig = project.config;


			// overwrite the config with the usesrconfig path
			Object.keys(userConfig).forEach(function(key){
				this.config[key] = userConfig[key];
			}.bind(this));
		}






		/**
		 * returns the complete config object
		 */
		, getAll: function() {
			return this.config;
		}





		/**
		 * retuns a single config value
		 */
		, get: function(key) {
			return this.config[key];
		}





		/**
		 * checks if a given config key is present
		 */
		, has: function(key) {
			return !type.undefined(this.config[key]);
		}
	});






	/**
	 * the user may register custom environments
	 * 
	 * @param {string} the name of the env
	 * @param {string} the env should be an alias of another
	 * 				   env or itself
	 */
	module.exports.add = function(name, alias) {
		environments[name] = alias || name;
	};

})();
