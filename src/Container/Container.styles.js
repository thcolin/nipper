import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    background: 'white'
  },
  element: {
    margin: '10px 0'
  },
  more: {
    minWidth: '140px',
    '@media (max-width: 810px)': {
      width: '100%'
    }
  }
})
