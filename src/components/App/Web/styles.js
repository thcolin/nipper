import { StyleSheet } from 'aphrodite';

require('normalize.css')
require('typeface-titillium-web')

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Titillium Web', sans-serif",
    fontSize: '14px',
    lineHeight: 1.42857143,
    color: '#333'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  }
})
