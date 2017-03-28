import queryString from 'query-string'

function unqueryfy(query){
  return queryString.parse(query)
}

export {
  unqueryfy
}
