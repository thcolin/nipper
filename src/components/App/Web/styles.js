import { StyleSheet } from 'aphrodite'

require('normalize.css')
require('resources/fonts/typeface-open-sans.css')
require('resources/fonts/typeface-titillium-web.css')
require('resources/fonts/font-awesome-light.less')

export default StyleSheet.create({
  container: {
    fontFamily: "'Titillium Web', sans-serif",
    fontSize: '14px',
    lineHeight: 1.42857143,
    color: '#333'
  },
  floor: {
    display: 'flex',
    flexDirection: 'column'
  }
})
