(function() {
    'use strict';


    const path = require('path');
    const rootpath = require('app-root-path').path;
    const log = require('ee-log');



    const environments = {
          live      : 'live'
        , staging   : 'staging'
        , dev       : 'dev'
        , testing   : 'testing'
    };






    module.exports = class {

        /**
         * sets up the class, determines the environment
         */
        constructor(basePath, userPath) {
            this.environmentName = null;
            this.environment = null;
            this.basePath = null;
            this.userConfigPath = null;


            // check if an environent is loaded
            Object.keys(environments).some((env) => {
                if (process.env['EE_ENV_'+env.toUpperCase()] || process.env['ENV_'+env.toUpperCase()] || process.argv.includes(`--${env}`)) {
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
        _load() {
            let userConfig;

            // collect all possible paths 
            const configPaths = [
                  path.join(`config.${this.environment}.js`)
                , path.join(`config.${this.environmentName}.js`)
                , path.join('config', `config.${this.environment}.js`)
                , path.join('config', `config.${this.environmentName}.js`)
            ];


            configPaths.forEach((filePath) => {
                try {
                    this.config = require(path.join(this.basePath, filePath));
                } catch (err) {
                    if (err.code !== 'MODULE_NOT_FOUND') {
                    log.warn(`Failed to load env config file ${path.join(this.basePath, filePath)}!`);
                    log(err);
                }
                }
            });


            if (!this.config) log.warn(`Failed to load environmment based config from the following files: ${configPaths.join(', ')} ..`);


            try {
                userConfig = require(path.join(rootpath, 'config.js'));
            } catch (err) {
                if (err.code !== 'MODULE_NOT_FOUND') {
                    log.warn(`Failed to load config file ${path.join(rootpath, 'config.js')}!`);
                    log(err);
                }
            }


            // try to load the user config
            if (this.userConfigPath) {
                try {
                    userConfig = require(path.extname(this.userConfigPath, '.js') ? this.userConfigPath : path.join(this.userConfigPath, 'config.js'));
                } catch (err) {}
            }


            // overwrite the config with the usesrconfig path
            Object.keys(userConfig).forEach((key) => {
                this.config[key] = userConfig[key];
            });
        }






        /**
         * returns the complete config object
         */
        getAll() {
            return this.config;
        }





        /**
         * retuns a single config value
         */
        get(key) {
            return this.config[key];
        }





        /**
         * checks if a given config key is present
         */
        has(key) {
            return this.config[key] !== undefined;
        }
    };






    /**
     * the user may register custom environments
     * 
     * @param {string} the name of the env
     * @param {string} the env should be an alias of another
     *                 env or itself
     */
    module.exports.add = (name, alias) => {
        environments[name] = alias || name;
    };

})();
