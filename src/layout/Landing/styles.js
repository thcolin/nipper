import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
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
    maxWidth: '140px'
  },
  form: {
    width: '560px',
    alignSelf: 'center'
  },
  buttons: {
    alignSelf: 'flex-start'
  },
  button: {
    background: 'transparent',
    color: 'white',
    boxShadow: 'inset 0 0 0 2px white'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
