(function() {
	'use strict';



	var   Class 		= require('ee-class')
		, log 			= require('ee-log')
		, assert 		= require('assert')
		;




	process.env.EE_ENV_TESTING = true;



	var ConfigLoader = require('../')
		, instance;



	describe('The ConfigLoader', function() {
		it('should not crash when instantiated', function() {
			instance = new ConfigLoader(__dirname, __dirname);
		});	

		it('should return the correct values', function() {
			assert.equal(JSON.stringify(instance.getAll()), '{"a":1,"b":10}');
		});

		it('should report the correct status', function() {
			assert.equal(instance.get('a'), 1);
		});		




		it('should report the correct status', function() {
			ConfigLoader.add('custom', 'live');

			delete process.env.EE_ENV_TESTING;
			process.env.EE_ENV_CUSTOM = true;

			let instance = new ConfigLoader(__dirname, __dirname);

			assert.equal(JSON.stringify(instance.getAll()), '{"c":999,"b":10}');
		});
	});	
})();

	
	