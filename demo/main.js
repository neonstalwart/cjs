require({
	packages: [
		{
			name: 'uglify',
			location: 'uglify',
			main: 'uglify-js'
		}
	],
	paths: {
		cjs: '../cjs',
		text: 'requirejs/text'
	}
}, ['cjs!uglify'], function (uglify) {
	console.log('uglify', uglify);
});
