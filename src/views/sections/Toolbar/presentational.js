import React from 'react'
import { PropTypes } from 'prop-types'
import { css } from 'glamor'
import Belt from 'components/blocks/Belt'
import Button from 'components/atoms/Button'
import ButtonSyncing from './containers/ButtonSyncing'
import ButtonSelect from './containers/ButtonSelect'
import SelectFormat from './containers/SelectFormat'
import LogoAnimatable from './containers/LogoAnimatable'
import ButtonDownload from './containers/ButtonDownload'

const suitup = (props = {}, state = {}) => ({
  element: css({
    justifyContent: 'space-between',
    padding: '0.625em 0.5em'
  }),
  check: css({
    margin: '1em'
  }),
  logo: css({
    position: 'absolute',
    height: '100%',
    top: 0,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0.25em',
    cursor: 'pointer',
    zIndex: -1
  }),
  left: css({
    display: 'flex',
    alignItems: 'center'
  }),
  right: css({
    display: 'flex',
    alignItems: 'center'
  }),
  select: css({
    margin: '0 0 0 0.4em'
  }),
  dots: css({
    margin: '0 0 0 0.25em'
  })
})

const Toolbar = (props) => {
  const classes = suitup(props)
  const { done } = props

  return (
    <Belt id='toolbar' className={classes.element}>
      <div className={classes.left}>
        {done ? (
          <ButtonSelect
            icon='check'
            size={0.625}
            className={classes.check}
          />
        ) : (
          <ButtonSyncing
            appearance='none'
            icon='spinner'
            size={1.25}
            animate
          />
        )}
        <SelectFormat className={classes.select} />
      </div>
      <LogoAnimatable title='🌶 💽' className={classes.logo} />
      <div className={classes.right}>
        <ButtonDownload
          appearance='light'
          icon='download'
          size={0.625}
        />
        <Button
          appearance='none'
          icon='dots'
          title='Options'
          className={classes.dots}
        />
      </div>
    </Belt>
  )
}

Toolbar.propTypes = {
  done: PropTypes.bool.isRequired
}

export default Toolbar
