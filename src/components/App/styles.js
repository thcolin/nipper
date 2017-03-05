import { StyleSheet } from 'aphrodite';

require('bootstrap/dist/css/bootstrap.css')
require('typeface-titillium-web')

export default StyleSheet.create({
  global: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Titillium Web', sans-serif"
  }
})
