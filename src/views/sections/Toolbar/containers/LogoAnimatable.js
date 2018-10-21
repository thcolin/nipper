import { connect } from 'react-redux'
import Logo from 'components/atoms/Logo'

export default connect(
  (state) => ({
    animate: !(Object.values(state.digger).pop() || {}).done
  }),
  (dispatch) => ({
    onClick: () => document.querySelector('#landing').scrollIntoView({ behavior: 'smooth' })
  })
)(Logo)
