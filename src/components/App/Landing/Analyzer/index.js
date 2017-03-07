import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  onAnalyze: PropTypes.func.isRequired
}

class Analyzer extends Component{
  constructor(props){
    super(props)
    this.state = {
      error: false,
      link: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e){
    this.setState({error: false, link: e.target.value})
  }

  handleSubmit(e){
    e.preventDefault()
    
    // test link
    var link = this.state.link;
    var v = /(youtu\.?be(\.com)?\/)(watch|embed|v)?(\/|\?)?(.*?v=)?([^#\&\?\=]{11})/
    var p = /(youtube\.com\/)(watch|playlist)(.*?list=)([^#\&\?\=]{24})/

    if(!link){
      return
    }

    if(p.test(link)){
      // playlist
      this.props.onAnalyze('p', p.exec(link)[4])
    } else if(v.test(link)){
      // video
      this.props.onAnalyze('v', v.exec(link)[6])
    } else {
      this.setState({error: true})
      return
    }
  }

  render(){
    return(
      <form className={css(styles.global)} onSubmit={this.handleSubmit}>
        <input type="text" className={css(styles.element, styles.input)} onChange={this.handleChange} placeholder="Youtube link (playlist or video)" />
        <Button className={css(styles.element, styles.button)} type="submit">Analyze</Button>
        <p className={css(styles.element, styles.subtitle)}>
          {this.state.error ?
            'Submited link is not valid (not a Youtube video or a playlist)'
            :
            '\u00A0' // keep line height
          }
        </p>
      </form>
    )
  }
}

Analyzer.propTypes = propTypes

export default Analyzer
