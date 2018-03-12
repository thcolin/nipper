import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  element: {
    margin: '5px 0'
  },
  form: {
    display: 'flex',
    flex: 1
  },
  input: {
    flex: 1,
    border: 'none',
    boxSizing: 'border-box',
    outline: 'none',
    borderRadius: '30px',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
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
    }
  },
  button: {
    padding: '15px 20px',
    fontSize: 'large',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  }
})
