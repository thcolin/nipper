import { StyleSheet } from 'aphrodite';

require('normalize.css')
require('typeface-titillium-web')

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
