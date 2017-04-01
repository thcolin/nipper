export default {
  // WARNING : security breach, because this code will be executed
  // in user browser, the API Key should not be secured by IP or domain,
  // and so, anyone who would look closely will be able to use it
  apiKey: '',
  // WARNING : if universal, all epyd process will be executed in user browser and proxified by server (CORS policy)
  // download entire (possibly HD) video on client side, just to extract audio, could be painful for user with small bandwidth
  // therefore, in production, you'll should prefer to let the server handle epyd process and set this to `false`
  universal: true
}
