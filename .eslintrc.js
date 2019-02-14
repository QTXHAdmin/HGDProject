// module.exports = {
//   root: true,// 当前项目是否是根目录
//   parserOptions: {
//     parser: 'babel-eslint'//对babel也进行一个校验
//   },
//   env: {//运行环境
//     browser: true,
//     amd: true
//   },
//   extends: [
//     // https://github.com/standard/standard/blob/master/docs/RULES-en.md
//     'standard'//非常出名的eslint规则
//   ],
//   globals: {
//     NODE_ENV: false//环境变量
//   },
//   rules: {//这里可以写很多的规则，但每次写那么多很麻烦，可以在上面extends扩展一个规则库，这里自定义的规则可以把上面继承的规则覆盖掉
//     // allow async-await
//     'generator-star-spacing': 'off',
//     // allow debugger during development
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     // 添加，分号必须，在standard中是不需要有分号，所以自定义一个
//     semi: ['error', 'always'],//是否要添加分毫
//     'no-unexpected-multiline': 'off',//可以有多个行
//     'space-before-function-paren': ['error', 'never'],//函数名字和括号之间不要有空格
//     // 'quotes': ["error", "double", { "avoidEscape": true }]
//     quotes: [//单引号
//       'error',
//       'single',
//       {
//         avoidEscape: true
//       }
//     ]
//   }
// };
