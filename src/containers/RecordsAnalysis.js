import { connect } from 'react-redux'
import Records from 'layout/Landing/Records'
import { inspectSubject } from 'ducks/context'

const mapStateToProps = (state) => ({
  records: state.records.result.map(key => state.records.entities[key])
})

const mapDispatchToProps = (dispatch) => ({
  onRecordClick: (record) => dispatch(inspectSubject(record.subject))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Records)
