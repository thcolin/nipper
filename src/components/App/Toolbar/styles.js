import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    borderBottom: '1px solid #eee',
    background: 'white'
  },
  download: {
    width: '175px'
  },
  logo: {
    height: '55px',
    margin: '-10px',
    '@media (max-width: 810px)': {
      display: 'none'
    }
  }
})
