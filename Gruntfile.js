module.exports = function(grunt) {
	//配置grunt任务
	grunt.initConfig({
		//清理css与js文件
		clean: {
			stylesheets: ['public/stylesheets/*.css'],
			javascript: ['public/javascript/build.js', 'public/javascript/lib.min.js']
		},
		//合并css文件生成style.css
		less: {
			options: {
				paths: ['public/stylesheets']
			},

			compile: {
				files: {
					'public/stylesheets/style.css': 'public/stylesheets/**.less'
				}
			}
		},
		//合并js文件生成build.js
		concat: {
			options: {
				separator: ";"
			},

			javascripts: {
				src: ['public/javascripts/**/*.js', '!public/javascripts/build.js'],
				dest: 'public/javascripts/build.js'
			}
		},

		//压缩js代码
		// uglify: {
		// 	ASCIIOnly: {
		// 		src: 'public/javascripts/build.js',
		// 		dest: 'public/javascripts/lib.min.js',
		// 		options: {
		// 			mangle: false,
		// 			ASCIIOnly: true
		// 		}
		// 	},
		// },

		//对js文件进行即时语法检查
		jshint: {
			options: {
				ignores: ['node_modules/**/*', 'public/lib/**/*']
			},

			beforeConcat: ['**/*.js'],
			afterConcat: ['public/javascript/build.js']
		},
		//设置express启动配置
		express: {
			options: {
				port: 3000,
				debug: true
			},

			server: {
				options: {
					script: 'app.js'
				}
			}
		},
		//即时监控文件改动
		watch: {
			options: {
				spawn: false
			},

			stylesheets: {
				files: ['public/stylesheets/**/*.less'],
				tasks: ['less']
			},
			//前端js
			javascripts_frontend: {
				files: ['public/javascripts/**/*'],
				tasks: ['jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'express']
			},
			//服务器js
			javascripts_server: {
				files: ['**/*.js', '!public/**/*'],
				tasks: ['express']
			},

			jade: {
				files: ['views/**/*.jade'],
				tasks: ['express']
			}
		}
	});

	//加载grunt任务
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-express-server');

	//设置默认任务
	grunt.registerTask('default', ['clean', 'less', 'jshint:beforeConcat', 'concat', 'jshint:afterConcat', 'express', 'watch']);

	grunt.registerTask('clearDatabase', 'Clearing database...', function() {
		var db = require('./models/db');
		var done = this.async();

		db.clear(function() {
			done();
		});
	});

	grunt.registerTask('initialize', 'Initializing database...', function() {
		var db = require('./models/db');
		var done = this.async();

		db.initialize(function() {
			done();
		});
	});

	grunt.registerTask('reset', ['clearDatabase','initialize']);
};