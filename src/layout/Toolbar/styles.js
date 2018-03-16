import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    position: 'sticky',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    top: '-1px',
    zIndex: 1,
    padding: '15px',
    borderBottom: '1px solid #eee',
    background: 'white'
  },
  buttons: {
    display: 'flex'
  },
  download: {
    width: '175px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px'
  },
  logo: {
    height: '55px',
    margin: '-10px',
    cursor: 'pointer'
  }
})
