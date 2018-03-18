import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'aphrodite'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/fontawesome-free-solid'
import Button from 'components/Button'
import Card from 'components/Card'
import styles from './styles'

const propTypes = {
  records: PropTypes.array.isRequired,
  onRecordClick: PropTypes.func.isRequired
}

class Records extends Component {
  constructor (props) {
    super(props)

    this.state = {
      toggled: true
    }

    this.handleToggle = this.handleToggle.bind(this)
  }

  handleToggle () {
    this.setState({
      toggled: !this.state.toggled
    })
  }

  render () {
    let { toggled } = this.state
    let { records, onRecordClick } = this.props

    toggled = toggled || !records.length

    return (
      <div className={css(styles.wrapper, toggled && styles.toggled)}>
        <div onClick={this.handleToggle} className={css(styles.header, !records.length && styles.hidden)}>
          <FontAwesomeIcon icon={toggled ? faChevronUp : faChevronDown} className={css(styles.button)} />
        </div>
        <div className={css(styles.body)}>
          <div className={css(styles.separator)}></div>
          {
            records.map(record => (
              <Card
                key={record.id}
                className={css(styles.card)}
                header={
                  <img src={record.thumbnail} className={css(styles.thumbnail)} />
                }
                body={
                  <div className={css(styles.heading)}>
                    <h4 className={css(styles.title)}>{record.title}</h4>
                    <small className={css(styles.author)}>{record.author}</small>
                  </div>
                }
                onClick={() => onRecordClick(record)}
              />
            ))
          }
          <div className={css(styles.separator)}></div>
        </div>
      </div>
    )
  }
}

Records.propTypes = propTypes

export default Records
