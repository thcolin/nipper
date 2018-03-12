import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    width: '100%',
    boxShadow: '0px 0px 0px 1px #eaeaea inset',
    borderRadius: '20px',
    padding: '20px',
    margin: '10px 0'
  },
  selected: {
    boxShadow: '0px 0px 0px 1px #ff1744 inset'
  },
  element: {
    margin: '0 10px'
  },
  firstElement: {
    margin: '0 10px 0 0'
  },
  lastElement: {
    margin: '0 0 0 10px'
  }
})
