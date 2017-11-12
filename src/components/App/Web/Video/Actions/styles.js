import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: '0 0 260px'
  },
  text: {
    margin: 0
  },
  icon: {
    padding: '0 0 0 15px',
    cursor: 'pointer',
    width: '16px',
    textAlign: 'center'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  },
  select: {
    width: '110px',
    margin: '0 5px 0 0'
  },
  group: {
    display: 'flex',
    flex: 1,
    margin: '0 0 0 5px'
  },
  download: {
    flex: 1,
    width: '105px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px'
  }
})
