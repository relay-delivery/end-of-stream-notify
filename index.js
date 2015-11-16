var endOfStream = require('end-of-stream');

module.exports = function(stream, opt){
	opt = Object(opt);

	var growl = (function(label){
		return !process.env.GROWL ? function(){} : function growl(data) {
			var notifier = require('node-notifier');
			data.title = '[' + label.toUpperCase() + '] ' + (data.title || '');
			notifier.notify(data);
		};
	})(opt.label || 'The stream');

	return new Promise(function(resolve, reject){
		endOfStream(stream, function(err){
			if (err){
				console.log(opt.label + ' ended with an error.');
				console.error(err);
				growl({
					title : 'bundle error',
					icon : 'face-angry',
					message : err.toString()
				});
				return reject(err);
			}

			console.log(opt.label + ' finished successfully!');
			growl({
				message : 'build OK',
				icon : 'emblem-default',
				expire : 2000
			});
			resolve();
		});
	});
};
