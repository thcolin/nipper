import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, rgba(255, 23, 68, 0.9), rgba(197, 17, 98, 0.7))'
  },
  element: {
    margin: '20px 20px 0'
  },
  logo: {
    '@media (min-width: 810px)': {
      maxWidth: '140px'
    }
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
