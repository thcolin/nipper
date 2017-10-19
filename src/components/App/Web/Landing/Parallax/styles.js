import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
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
    objectFit: 'cover',
    height: '100%',
    width: '100%'
  }
})
