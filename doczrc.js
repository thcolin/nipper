import path from 'path'
import theme from './src/theme'

export default {
  themeConfig: {
    colors: {
      primary: theme.colors.primary,
      link: theme.colors.primary,
    }
  },
  modifyBundlerConfig: (config) => {
    // Resolve `src`
    config.resolve.modules.push(path.join(__dirname, 'src'))
    config.module.rules[0].include.push(path.join(__dirname, 'src'))

    // CSS
    config.resolve.extensions.push('.css')

    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    })

    return config
  }
}
