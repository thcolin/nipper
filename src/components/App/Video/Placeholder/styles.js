import { StyleSheet } from 'aphrodite';

export default StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    boxShadow: '0px 0px 0px 1px #eaeaea inset',
    borderRadius: '20px',
    padding: '20px',
    margin: '10px 0',
    '@media (min-width: 810px)': {
      flexDirection: 'row'
    }
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
  },
  thumbnail: {
    // should implement real behavior (responsive design)
  },
  about: {
    '@media (min-width: 810px)': {
      flex: '0 0 180px'
    }
  },
  description: {
    flex: 1
  },
  actions: {
    '@media (min-width: 810px)': {
      flex: '0 0 260px'
    }
  },
  placeholder: {
    display: 'block',
    background: '#eaeaeaea'
  },
  image: {
    height: '160px',
    width: '210px'
  },
  line: {
    width: '100%',
    height: '20px',
    margin: '0 0 10px'
  }
})
