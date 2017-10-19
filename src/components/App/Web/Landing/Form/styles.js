import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: '10px 0',
    '@media (min-width: 810px)': {
      flexDirection: 'row'
    }
  },
  element: {
    margin: '5px 0',
    '@media (max-width: 810px)': {
      width: '100%'
    }
  },
  input: {
    border: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius: '30px',
    padding: '15px 30px',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 'large',
    lineHeight: 1.42857143,
    transition: 'all 0.30s ease-in-out',
    '::-webkit-input-placeholder': {
      fontFamily: "'Titillium Web', sans-serif"
    },
    '::-moz-placeholder': {
      fontFamily: "'Titillium Web', sans-serif"
    },
    '@media (min-width: 810px)': {
      width: '450px',
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
  },
  button: {
    padding: '15px 20px',
    fontSize: 'large',
    '@media (min-width: 810px)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
  }
})
