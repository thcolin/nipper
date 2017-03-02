import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  image: {
    minHeight: '100%',
    maxWidth: '100%',
    maxHeight: 'none',
    '@media (max-width: 810px)': {
      minHeight: 'none',
      maxWidth: 'none',
      maxHeight: '100%'
    }
  }
})
