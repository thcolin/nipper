import React from 'react'

export default {
  p({children}){
    return <span>{children}</span>
  },
  codespan({children}){
    return <code style={{margin:'0 10px'}}>{children}</code>
  }
}
