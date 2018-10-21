import React, { PureComponent } from 'react'
import { css } from 'glamor'
import theme from 'theme'

const suitup = (props = {}, state = {}) => ({
  element: css({
    position: 'sticky',
    top: -1,
    zIndex: 1,
    '::after': {
      content: '""',
      position: 'absolute',
      zIndex: -1,
      boxShadow: '0 0 2.5em rgba(0, 0, 0, 0.15)',
      bottom: '0px',
      width: '100%',
      height: '50%',
      borderRadius: '100%'
    }
  }),
  container: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.colors.silver}`,
    background: theme.colors.white,
    zIndex: 0
  })
})

class Belt extends PureComponent {
  render () {
    const classes = suitup(this.props)
    const { children, ...props } = this.props

    return (
      <div className={classes.element}>
        <div {...props} className={[classes.container, props.className].join(' ')}>
          {children}
        </div>
      </div>
    )
  }
}

export default Belt
