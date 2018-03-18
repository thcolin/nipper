import { StyleSheet } from 'aphrodite'

export default StyleSheet.create({
  wrapper: {
    height: '240px',
    transition: 'all 0.50s ease-in-out',
  },
  toggled: {
    height: '50px'
  },
  header: {
    textAlign: 'right',
    cursor: 'pointer',
    padding: '15px 20px',
  },
  hidden: {
    visibility: 'hidden'
  },
  button: {
    color: 'white'
  },
  body: {
    display: 'flex',
    overflowY: 'scroll',
    padding: '0 0 20px'
  },
  // WTF CSS ?!
  separator: {
    ':before': {
      content: '""',
      display: 'block',
      width: '1px'
    }
  },
  card: {
    flex: '0 0 200px',
    width: '200px',
    margin: '1px 20px',
  },
  thumbnail: {
    width: '100%',
    margin: '-10.5% 0 -13%',
    clipPath: 'polygon(0 14%, 100% 14%, 100% 86%, 0% 86%)',
  },
  heading: {
    padding: '10px 20px'
  },
  title: {
    margin: 0,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  author: {
    color: '#999',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
})
