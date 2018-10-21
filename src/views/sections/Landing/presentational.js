import React from 'react'
import { css } from 'glamor'
import topography from 'resources/topography.svg'
import theme from 'theme'
import Parallax from 'react-rellax'
import Logo from 'components/atoms/Logo'
import Heading from 'components/atoms/Heading'
import FormLink from './containers/FormLink'
import StepperError from './containers/StepperError'
import CurtainTale from './containers/CurtainTale'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    background: `linear-gradient(-45deg, ${theme.colors.shadows.primary}, ${theme.colors.shadows.secondary})`,
    overflow: 'hidden'
  }),
  parallax: css({
    position: 'absolute',
    height: '100%',
    width: '100%',
    zIndex: -1
  }),
  picture: css({
    height: '100%',
    width: '100%',
    backgroundImage: `url(${topography})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }),
  logo: css({
    alignSelf: 'start',
    width: '100%',
    maxWidth: '9em',
    margin: '1em 1.75em',
    [theme.breakpoints.mobile]: {
      alignSelf: 'center',
      maxWidth: '12em'
    }
  }),
  body: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 0,
    textAlign: 'center',
    padding: '1.5em 0',
    width: '100%'
  }),
  heading: css({
    maxWidth: '70em',
    backgroundColor: theme.colors.white,
    padding: '0 0.2em !important',
    margin: '0 0 0.35em !important'
  }),
  form: css({
    width: '100%',
    maxWidth: '30em',
    padding: '2em 1em'
  }),
  curtain: css({
    width: '100%',
    flexShrink: 0,
    [theme.breakpoints.portrait]: {
      fontSize: '0.75em'
    }
  })
})

const Landing = (props) => {
  const classes = suitup(props)

  return (
    <div id='landing' className={classes.element}>
      <Parallax speed={-5} className={classes.parallax}>
        <div className={classes.picture} />
      </Parallax>
      <Logo inverted title='🌶 💽' className={classes.logo} />
      <div className={classes.body}>
        <Heading level={1} className={classes.heading}>Nipper</Heading>
        <div className={classes.form}>
          <FormLink icon='arrow' placeholder='Enter a Youtube video or playlist link' />
        </div>
        <StepperError name='stepper-error'>{[
          {
            key: 0,
            emoji: '🌐',
            label: 'Enter Youtube video or playlist link'
          },
          {
            key: 1,
            emoji: '🏚',
            label: 'Fix wrong tags (cover, artist, song)'
          },
          {
            key: 2,
            emoji: '🎩',
            label: 'Choose format (audio, video)'
          },
          {
            key: 3,
            emoji: '🚌',
            label: 'Select some videos...'
          },
          {
            key: 4,
            emoji: '💽',
            label: 'Download one-by-one or zipped !'
          }
        ]}</StepperError>
      </div>
      <CurtainTale className={classes.curtain} />
    </div>
  )
}

export default Landing
