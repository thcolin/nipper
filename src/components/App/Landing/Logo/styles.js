import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  global: {
    '@media (max-width: 810px)': {
      display: 'flex',
      justifyContent: 'center'
    }
  },
  image: {
    height: '75px',
    margin: '30px',
    maxHeight: '150px',
    maxWidth: '240px',
    '@media (max-width: 810px)': {
      height: '100%'
    }

  }
})
