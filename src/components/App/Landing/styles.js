import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(160deg, rgba(255, 23, 68, 0.9), rgba(197, 17, 98, 0.7))'
  },
  subcontainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '10px'
  },
  element: {
    margin: '10px'
  },
  headbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    flex: 1,
    '@media (min-width: 810px)': {
      maxWidth: '140px'
    }
  },
  reset: {

  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
