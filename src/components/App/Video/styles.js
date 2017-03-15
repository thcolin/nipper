import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    border: '1px solid #eaeaea',
    borderRadius: '20px',
    padding: '20px',
    margin: '20px 0',
    '@media (min-width: 810px)': {
      flexDirection: 'row'
    }
  },
  selected: {
    border: '1px solid #ff1744'
  },
  element: {
    '@media (max-width: 810px)': {
      margin: '10px 0'
    },
    '@media (min-width: 810px)': {
      margin: '0 10px'
    }
  },
  firstElement: {
    '@media (max-width: 810px)': {
      margin: '0 0 10px 0'
    },
    '@media (min-width: 810px)': {
      margin: '0 10px 0 0'
    }
  },
  lastElement: {
    '@media (max-width: 810px)': {
      margin: '10px 0 0 0'
    },
    '@media (min-width: 810px)': {
      margin: '0 0 0 10px'
    }
  }
})
