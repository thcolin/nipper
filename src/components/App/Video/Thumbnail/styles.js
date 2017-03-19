import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    position: 'relative'
  },
  image: {
    display: 'flex',
    maxHeight: '100%',
    maxWidth: '100%',
    '@media (min-width: 810px)': {
      maxHeight: '160px'
    }
  },
  time: {
    position: 'absolute',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: '10px 15px',
    color: 'white',
    textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black'
  }
})
