import React, { PureComponent } from 'react'
import { css, keyframes } from 'glamor'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import PropTypes from 'prop-types'
import CODECS from 'store/codecs'
import theme from 'theme'
import Card from 'components/blocks/Card'
import Heading from 'components/atoms/Heading'
import Link from 'components/atoms/Link'
import Input from 'components/atoms/Input'
import Button from 'components/atoms/Button'
import Select from 'components/atoms/Select'

const placeholder = {
  backgroundColor: theme.colors.porcelain,
  backgroundImage: theme.colors.shimmer,
  backgroundSize: '50em 8em',
  animationDuration: '1s',
  animationFillMode: 'forwards',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
  animationName: keyframes({
    '0%': {
      backgroundPosition: '-25em 0'
    },
    '100%': {
      backgroundPosition: '25em 0'
    }
  })
}

const suitup = (props = {}, state = {}) => ({
  element: css({
    display: 'flex',
    color: `${theme.colors.shadows.icecube} !important`,
    height: `${theme.ratio.height * 1.5}em`,
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.mobile]: {
      height: `${theme.ratio.height * 1}em`
    }
  }),
  thumbnail: css({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    flexBasis: `${theme.ratio.width * 1.5}em`,
    overflow: 'hidden',
    borderTopLeftRadius: '0.25em',
    borderBottomLeftRadius: '0.25em',
    [theme.breakpoints.mobile]: {
      flexBasis: `${theme.ratio.width * 1}em`
    },
    ...(props.placeholder ? placeholder : {})
  }),
  image: css({
    width: '100%'
  }),
  body: css({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: theme.colors.white,
    padding: '0.75em 1em',
    borderTopRightRadius: '0.25em',
    borderBottomRightRadius: '0.25em',
    overflow: 'hidden'
  }),
  top: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start'
  }),
  headings: css({
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }),
  title: css({
    color: `${theme.colors.black} !important`,
    fontWeight: `${theme.fonts.weights.bold} !important`,
    textTransform: 'none !important',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    lineClamp: 2,
    overflow: 'hidden',
    ...(props.placeholder ? { ...placeholder, '::after': { content: '.', visibility: 'hidden' }, width: '15em' } : {})
  }),
  author: css({
    margin: '0.25em 0 0 !important',
    color: `${theme.colors.gray} !important`,
    fontSize: `${theme.fonts.sizes.small} !important`,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    ...(props.placeholder ? { ...placeholder, '::after': { content: '.', visibility: 'hidden' }, width: '8em' } : {})
  }),
  actions: css({
    alignSelf: 'start',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    margin: '0.5em 0 0.5em 1em',
    ...(props.placeholder ? placeholder : {})
  }),
  action: css({
    margin: '0 0.5em',
    ...(props.placeholder ? { visibility: 'hidden' } : {})
  }),
  select: css({
    margin: '0 0.25em',
    ...(props.placeholder ? { visibility: 'hidden' } : {})
  }),
  inputs: css({
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0 0.5em 0 0',
    ...(props.placeholder ? placeholder : {})
  }),
  input: css({
    flex: 1,
    ...(props.placeholder ? { visibility: 'hidden' } : {})
  }),
  switch: css({
    transform: 'rotate(90deg)',
    margin: '0 0.75em',
    color: theme.colors.silver,
    ':enabled:hover': {
      color: theme.colors.primary
    },
    ':enabled:focus': {
      color: theme.colors.primary
    },
    ...(props.placeholder ? { visibility: 'hidden' } : {})
  })
})

class Track extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      format: Object.keys(CODECS).shift(),
      artist: props.artist,
      song: props.song
    }

    this.debounceChange = new Subject().pipe(debounceTime(800))
    this.debounceChange.subscribe(({ key, value }) => this.props.onChange(key, value))

    this.handleToggle = this.handleToggle.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
  }

  componentDidUpdate (props) {
    /* eslint-disable react/no-did-update-set-state */
    if (props.artist !== this.props.artist) {
      this.setState({ artist: this.props.artist })
    }

    if (props.song !== this.props.song) {
      this.setState({ song: this.props.song })
    }
    /* eslint-enable react/no-did-update-set-state */
  }

  handleToggle () {
    this.props.onSelect(!this.props.selected)
  }

  handleChange (key, value, dispatch = true) {
    this.setState({ [key]: value })

    if (dispatch) {
      this.debounceChange.next({ key, value })
    }
  }

  handleSwitch () {
    this.setState({
      artist: this.state.song,
      song: this.state.artist
    })

    this.props.onChange('artist', this.state.song)
    this.props.onChange('song', this.state.artist)
  }

  handleDownload () {
    if (this.props.progress === null) {
      this.props.onDownload(this.state.format, {
        artist: this.state.artist,
        song: this.state.song,
        cover: this.props.thumbnail
      })
    } else {
      this.props.onAbort(this.state.format)
    }
  }

  render () {
    const classes = suitup(this.props)
    const { format, artist, song } = this.state
    const {
      selected,
      placeholder,
      progress,
      disabled,
      title,
      link,
      author,
      channel,
      thumbnail,
      onSelect,
      onChange,
      onDownload,
      ...props
    } = this.props

    return (
      <Card {...props} active={selected} className={[classes.element, props.className].join(' ')}>
        <div className={classes.thumbnail}>
          <img src={thumbnail} className={classes.image} />
        </div>
        <div className={classes.body}>
          <div className={classes.top}>
            <div className={classes.headings}>
              <Link href={link} title={title}>
                <Heading level={6} className={classes.title}>{title}</Heading>
              </Link>
              <Link className={classes.author} href={channel}>{author}</Link>
            </div>
            <div className={classes.actions}>
              <Button
                appearance={selected ? 'plain' : 'light'}
                icon='check'
                className={classes.action}
                size={0.5}
                onClick={this.handleToggle}
                disabled={disabled.selection}
              />
              <Button
                icon='download'
                className={classes.action}
                progress={progress}
                size={0.5}
                onClick={this.handleDownload}
                disabled={disabled.download}
              />
              <Select
                value={format}
                title={format}
                className={classes.select}
                onChange={value => this.handleChange('format', value, false)}
                options={CODECS}
              />
            </div>
          </div>
          <div className={classes.inputs}>
            <Input
              className={classes.input}
              placeholder='Artist'
              icon='artist'
              value={artist}
              onChange={e => this.handleChange('artist', e.target.value)}
              disabled={progress !== null}
            />
            <Button
              icon='switch'
              appearance='none'
              className={classes.switch}
              onClick={this.handleSwitch}
              disabled={progress !== null}
            />
            <Input
              className={classes.input}
              placeholder='Song'
              icon='music'
              value={song}
              onChange={e => this.handleChange('song', e.target.value)}
              disabled={progress !== null}
            />
          </div>
        </div>
      </Card>
    )
  }
}

Track.propTypes = {
  selected: PropTypes.bool,
  placeholder: PropTypes.bool,
  progress: PropTypes.number,
  disabled: PropTypes.shape({
    selection: PropTypes.bool,
    download: PropTypes.bool
  }),
  thumbnail: PropTypes.string,
  title: PropTypes.string,
  link: PropTypes.string,
  author: PropTypes.string,
  channel: PropTypes.string,
  description: PropTypes.string,
  artist: PropTypes.string,
  song: PropTypes.string,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  onDownload: PropTypes.func
}

Track.defaultProps = {
  placeholder: false,
  progress: null,
  disabled: { selection: false, download: false },
  artist: '',
  song: ''
}

export default Track
