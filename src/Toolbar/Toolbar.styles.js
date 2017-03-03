import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #eee',
    background: 'white',
    '@media (min-width: 810px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  },
  element: {
    margin: '15px 20px'
  },
  text: {
    margin: 0,
    textAlign: 'center'
  }
})
