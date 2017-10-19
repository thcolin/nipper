import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '@media (min-width: 810px)': {
      flex: '0 0 260px'
    }
  },
  text: {
    margin: 0
  },
  inputs: {

  },
  buttons: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '@media (min-width: 810px)': {
      flexDirection: 'row'
    }
  },
  select: {
    margin: '5px 0',
    '@media (min-width: 810px)': {
      width: '110px',
      margin: '0 5px 0 0'
    }
  },
  group: {
    display: 'flex',
    flex: 1,
    margin: '5px 0',
    '@media (min-width: 810px)': {
      margin: '0 0 0 5px'
    }
  },
  download: {
    flex: 1,
    width: '105px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px'
  }
})
