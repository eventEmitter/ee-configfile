# ee-configfile

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-configfile.svg)](https://greenkeeper.io/)

config file loader

loads one of the following config file in the dir specified:

- config.dev.js when the apps was started with the --dev flag
- config.testing.js when the apps was started with the --testing flag
- config.staging.js when the apps was started with the --staging flag
- config.live.js when the apps was started with the --live flag

it tries also to load the config.js file, if found it applies it to the config found in one of the other files.

the config files must export an objet with keys.



## installation

	npm install ee-configfile

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-configfile.png?branch=master)](https://travis-ci.org/eventEmitter/ee-configfile)


## usage

	var ConfigLoader = require('ee-configfile');

	var config = new ConfigLoader(__dirname);