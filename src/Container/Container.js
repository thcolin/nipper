import React, { Component } from 'react'
import { css } from 'aphrodite'

import Error from 'Shared/Error'
import Button from 'Shared/Button'
import Video from 'Video/Video'

import styles from './Container.styles'

class Container extends Component{
  render(){
    return(
      <section className={css(styles.global)}>
        {false &&
          <Error className={css(styles.element)} message="Error" />
        }
        {false &&
          <Error className={css(styles.element)} message="Nunc semper vel justo sit amet convallis. Sed sit amet diam lacinia, euismod diam vel, accumsan velit" />
        }
        <Video />
        <Video />
        {true &&
          <Button className={css(styles.more)} icon="fa-caret-down">More</Button>
        }
        {false &&
          <Button className={css(styles.more)} icon="fa-circle-o-notch fa-spin fa-fw" appearance="light" disabled>Loading</Button>
        }
      </section>
    )
  }
}

export default Container
