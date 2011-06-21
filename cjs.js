define(function () {
	var commentRegExp = /(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,
		cjsRequireRegExp = /require\(["']([^'"\s]+)["']\)/g;

	return {
		load: function (target, require, load) {
			// fetch the raw text
			require(['text!' + target + '.js'], function (source) {
				// start with the "standard" dependencies
				var deps = ['require', 'exports', 'module'];

				// scan the source for other dependencies
				source.replace(commentRegExp, '').replace(cjsRequireRegExp, function (match, dep) {
					deps.push('cjs!' + dep);
				});

				// simulate injecting the wrapped source
				load.fromText('cjs!' + target, "define(['" + deps.join("','") + "'],function (req, exports, module) {" + 
					"function require(id) {" +
						"return req('cjs!'+ id);" +
					"}" + 
					source + 
				'});\n//@ sourceURL=' + require.toUrl(target));

				// get the module we just defined and return it via load
				require(['cjs!' + target], load);
			});
		}
	};
});
