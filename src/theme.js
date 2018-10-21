export default {
  colors: {
    primary: 'hsl(348, 100%, 55%)',
    dark: 'hsl(348, 100%, 50%)',
    darken: 'hsl(348, 100%, 48%)',
    darker: 'hsl(348, 100%, 40%)',
    light: 'hsl(348, 100%, 95%)',
    lighten: 'hsl(348, 100%, 96%)',
    lighter: 'hsl(348, 100%, 97%)',
    secondary: 'hsl(333, 84%, 42%)',
    iceblack: 'hsl(200, 40%, 10%)',
    black: 'hsl(225, 25%, 2%)',
    vantablack: '#000000',
    transablack: 'hsla(0, 0%, 0%, 0.4)',
    silver: '#e5e5e5',
    porcelain: '#f6f7f8',
    shimmer: `linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)`,
    icecube: 'hsl(200, 40%, 98%)',
    icegray: 'hsl(200, 5%, 70%)',
    gray: '#999999',
    white: '#ffffff',
    shadows: {
      primary: 'hsla(348, 100%, 55%, 0.9)',
      dark: 'hsla(348, 100%, 25%, 0.6)',
      secondary: 'hsla(333, 84%, 42%, 0.7)',
      icecube: 'hsla(200, 5%, 60%, 0.4)'
    }
  },
  fonts: {
    families: {
      primary: "'Open Sans', sans-serif",
      secondary: "'Titillium Web', sans-serif"
    },
    sizes: {
      base: 16,
      small: '0.75em',
      regular: '1em',
      large: '1.125em',
      h1: '3.5em',
      h2: '3em',
      h3: '2.5em',
      h4: '2em',
      h5: '1.5em',
      h6: '1.25em'
    },
    weights: {
      light: 300,
      regular: 400,
      semi: 600,
      bold: 700,
      black: 900
    }
  },
  breakpoints: {
    mobile: '@media (max-width: 599px)',
    portrait: '@media (max-height: 599px) and (orientation: portrait)'
  },
  // usefull for YouTube thumbnail
  ratio: {
    width: 11,
    height: 6
  }
}
