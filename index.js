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
		growl({
			title : 'Build running...',
			message: 'please wait',
			icon : 'computer',
			expire : 700
		});

		endOfStream(stream, function(err){
			if (err){
				console.log(opt.label + ' ended with an error.');
				console.error(err);
				growl({
					title : 'Build Failure.',
					icon : 'dialog-error',
					message : err.toString()
				});
				return reject(err);
			}

			console.log(opt.label + ' finished successfully!');
			growl({
				title : 'Build Success.',
				message: 'great job',
				icon : 'emblem-default',
				expire : 700
			});
			resolve();
		});
	});
};
