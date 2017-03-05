import React, { Component, PropTypes } from 'react'
import { css } from 'aphrodite'
import Button from 'components/Shared/Button'
import styles from './styles'

const propTypes = {
  onAnalyze: PropTypes.func.isRequired
}

class Search extends Component{
  constructor(props){
    super(props)
    this.state = {
      error: false,
      link: ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleChange(e){
    this.setState({error: false, link: e.target.value})
  }

  handleClick(e){
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
      <div className={css(styles.global)}>
        <input type="text" className={css(styles.element, styles.input)} value={this.state.link} onChange={this.handleChange} placeholder="Youtube link (playlist or video)" />
        <Button className={css(styles.element, styles.button)} onClick={this.handleClick}>Analyze</Button>
        <p className={css(styles.element, styles.subtitle)}>
          {this.state.error ?
            'Submited link is not valid (not a Youtube video or a playlist)'
            :
            '\u00A0' // keep line height
          }
        </p>
      </div>
    )
  }
}

Search.propTypes = propTypes

export default Search
