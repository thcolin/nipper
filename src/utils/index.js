import queryString from 'query-string'

function capitalize(str){
  return str.toLowerCase()
    .split(' ')
    .filter((word) => !!word)
    .map((word, index) => {
      // filter words like 'a', 'an', 'the', 'and', 'or'
      if(index !== 0 && word.length < 4){
        return word
      } else if(word.match(/feat/)){
        return 'ft.'
      } else{
        return word.replace(word[0], word[0].toUpperCase())
      }
    })
    .join(' ')
}

function unquerify(query){
  return queryString.parse(query)
}

export {
  capitalize,
  unquerify
}
