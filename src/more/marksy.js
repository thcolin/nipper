import React from 'react'

export default {
  createElement: React.createElement,
  elements: {
    p: (props) => <span>{props.children}</span>, // eslint-disable-line react/prop-types
    codespan: (props) => <code>{props.children}</code> // eslint-disable-line react/prop-types
  }
}
