import queryString from 'query-string'

function unquerify(query){
  return queryString.parse(query)
}

export {
  unquerify
}
