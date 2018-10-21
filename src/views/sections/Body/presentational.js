import React from 'react'
import { PropTypes } from 'prop-types'
import { css } from 'glamor'
import theme from 'theme'
import Message from 'components/blocks/Message'
import Illustration from 'components/blocks/Illustration'
import MessageErrors from './containers/MessageErrors'
import ListTracks from './containers/ListTracks'
import TrackLibrary from './containers/TrackLibrary'
import Empty from 'resources/empty.svg'
import Loading from 'resources/loading.svg'

const suitup = (props = {}, state = {}) => ({
  element: css({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.colors.icecube
  }),
  message: css({
    width: '100%',
    fontSize: '0.875em'
  }),
  collection: css({
    width: '100%',
    maxWidth: '50em',
    margin: '1em'
  }),
  track: css({
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  }),
  illustration: css({
    height: '100%',
    maxWidth: '38em',
    margin: '3em 2em'
  })
})

const Body = (props) => {
  const classes = suitup(props)
  const { empty, done } = props

  return (
    <div id='body' className={classes.element}>
      <Message className={classes.message}>
        Keep in mind this project is <strong>experimental</strong> and that <strong>downloading</strong> or <strong>converting</strong> into specific codec, are directly made by <strong>your browser</strong> !
      </Message>
      <MessageErrors className={classes.message} />
      {!empty ? (
        <ListTracks
          className={classes.collection}
          height={((theme.ratio.height * 1.5) + 1.5) * theme.fonts.sizes.base}
          render={(uri, index, style) => (
            <div key={uri} className={classes.track} style={style}>
              <TrackLibrary uri={uri} />
            </div>
          )}
        />
      ) : (
        done ? (
          <Illustration
            svg={Empty}
            title='Oops, no videos was found'
            message="Something went wrong, the service didn't find any video available from provided URL, playlist may be empty or the video may have restrictions"
            className={classes.illustration}
          />
        ) : (
          <Illustration
            svg={Loading}
            title='Hmm, working on your request'
            message='You will be able to annotate metadata for each video before downloading them, separately or as an archive, simply by selecting the ones you want'
            className={classes.illustration}
          />
        )
      )}
    </div>
  )
}

Body.propTypes = {
  empty: PropTypes.bool.isRequired,
  done: PropTypes.bool.isRequired
}

export default Body
