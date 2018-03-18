import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    boxSizing: 'border-box',
    alignItems: 'center',
    padding: '20px',
    background: 'white',
    zIndex: 1,
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
