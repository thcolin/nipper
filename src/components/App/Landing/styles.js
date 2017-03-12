import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    background: 'linear-gradient(rgba(255, 23, 68, 0.9), rgba(197, 17, 98, 0.7))'
  },
  logo: {
    margin: '30px',
    '@media (min-width: 810px)': {
      maxWidth: '140px'
    }
  }
})
