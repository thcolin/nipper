import { connect } from 'react-redux'
import Select from 'components/atoms/Select'
import { setPreference } from 'store/ducks/preferences'
import CODECS from 'store/codecs'

const mapStateToProps = (state, props) => ({
  title: CODECS[state.preferences.format].children,
  value: state.preferences.format,
  options: CODECS
})

const mapDispatchToProps = (dispatch) => ({
  onChange: (value) => dispatch(setPreference('format', value)),
  onBlur: (e) => dispatch(setPreference('format', e.target.value))
})

export default connect(mapStateToProps, mapDispatchToProps)(Select)
