import { connect } from 'react-redux'
import Select from 'components/atoms/Select'
import { setPreference } from 'store/ducks/preferences'
import formats from 'store/formats'

const mapStateToProps = (state, props) => ({
  title: formats[state.preferences.format].children,
  value: state.preferences.format,
  options: formats
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (value) => dispatch(setPreference('format', value)),
  onBlur: (e) => dispatch(setPreference('format', e.target.value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Select)
