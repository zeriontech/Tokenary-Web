import axios from 'axios/index'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export default {
  instance: axios.create({
    baseURL: process.env.VUE_APP_TOKENARY_API_URL,
    timeout: process.env.VUE_APP_TOKENARY_API_TIMEOUT,
    headers: {
      'x-api-key': process.env.VUE_APP_TOKENARY_API_KEY,
      'Accept': 'application/json'
    }
  })
}
