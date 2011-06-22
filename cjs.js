define(function () {
	var commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,
		cjsRequireRegExp = /require\(["']([^'"\s]+)["']\)/g;

	return {
		load: function (target, require, load) {
			// fetch the raw text
			require(['text!' + target + '.js'], function (source) {
				// start with the "standard" dependencies
				var deps = ['require', 'exports', 'module'],
					wrapped;

				// scan the source for other dependencies
				source.replace(commentRegExp, '').replace(cjsRequireRegExp, function (match, dep) {
					deps.push('cjs!' + dep);
				});

				wrapped = "define(['" + deps.join("','") + "'],function (req, exports, module) {" + 
					"function require(id) {" +
						"return req('cjs!'+ id);" +
					"}" + 
					source + 
				'});';

				// workaround IE conditional comments
				/*@if (@_jscript) @else @*/
				wrapped += '\n//@ sourceURL=' + require.toUrl(target);
				/*@end@*/

				// simulate injecting the wrapped source
				load.fromText('cjs!' + target, wrapped);

				// get the module we just defined and return it via load
				require(['cjs!' + target], load);
			});
		}
	};
});
