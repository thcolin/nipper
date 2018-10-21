import React from 'react'
import { css } from 'glamor'
import { Counter } from 'react-powerplug'
import theme from 'theme'
import PropTypes from 'prop-types'

const suitup = (props = {}, state = {}) => ({
  steps: css({
    display: 'flex',
    overflow: 'hidden',
    width: '100%'
  }),
  step: css({
    width: `100%`,
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0 1em',
    color: `${theme.colors.white} !important`,
    fontWeight: `${theme.fonts.weights.light} !important`,
    transform: `translateX(-${props.count * 100}%)`,
    transition: 'transform 0.4s ease'
  }),
  emoji: css({
    fontSize: '1.5em',
    lineHeight: '1.25em'
  }),
  label: css({
    margin: '0 0 0.25em 0.5em'
  }),
  radio: css({
    display: 'flex',
    margin: '1em 0 0'
  }),
  hide: css({
    visibility: 'hidden'
  }),
  choice: css({
    appearance: 'none',
    height: '0.5em',
    width: '0.5em',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: '0 0.25em',
    padding: 0,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    ':checked': {
      backgroundColor: 'rgba(255, 255, 255, 1)'
    }
  })
})

const Stepper = (props) => {
  const { children, name, ...crumbs } = props

  return (
    <Counter initial={0}>
      {({ count, set }) => {
        const classes = suitup({ ...props, count: Math.min(children.length - 1, count) })

        return [
          <div {...crumbs} key='steps' className={[classes.steps, crumbs.className].join(' ')}>
            {children.map(({ emoji, label, ...props }) => (
              <div {...props} className={[props.className, classes.step].join(' ')}>
                <span className={classes.emoji}>{emoji}</span>
                <em className={classes.label}>{label}</em>
              </div>
            ))}
          </div>,
          <div key='radio' onChange={e => set(e.target.value)} className={[classes.radio, children.length <= 1 && classes.hide].join(' ')}>
            {children.map((child, index) => (
              <input
                type='radio'
                name={name}
                value={index}
                key={index}
                className={classes.choice}
                defaultChecked={count === index}
              />
            ))}
          </div>
        ]
      }}
    </Counter>
  )
}

Stepper.propTypes = {
  children: PropTypes.arrayOf(PropTypes.shape({
    emoji: PropTypes.any.isRequired,
    label: PropTypes.any.isRequired,
    key: PropTypes.any.isRequired
  })).isRequired,
  name: PropTypes.string.isRequired
}

export default Stepper
