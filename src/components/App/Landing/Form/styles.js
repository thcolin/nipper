import { StyleSheet } from 'aphrodite';

require('typeface-open-sans')
require('typeface-titillium-web')

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexWrap: 'wrap',
    margin: '30px 10px 40px',
    '@media (min-width: 810px)': {
      flexDirection: 'row',
      margin: '30px 10px 60px'
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
    padding: '18px 30px',
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 'large',
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
    padding: '18px 20px',
    fontSize: 'large',
    '@media (min-width: 810px)': {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
  },
  subtitle: {
    flex: '0 1 100%',
    margin: '10px 0 0',
    textAlign: 'center',
    color: 'white',
    fontSize: 'small',
    fontStyle: 'italic'
  }
})
