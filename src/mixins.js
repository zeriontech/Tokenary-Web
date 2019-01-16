import makeBlockie from 'ethereum-blockies-base64'
import utils from 'web3-utils'

export default {
  methods: {
    formattedTotal: (number, decimalsMin, decimalsMax) => {
      if (number !== null && number !== '' && typeof number !== 'undefined') {
        let result = number.toFixed(decimalsMin)
        if (result === '0.' + '0'.repeat(decimalsMin)) {
          result = number.toFixed(decimalsMax)
          if (result === '0.' + '0'.repeat(decimalsMax)) {
            return 0
          }
        }
        return result
      } else {
        return 0
      }
    },
    formattedTime: (seconds) => {
      let min = Math.floor(seconds / 60) > 0 ? Math.floor(seconds / 60) + 'm' : ''
      let sec = seconds % 60 > 0 ? seconds % 60 + 's' : ''

      return min + sec
    },
    getBlockie: (data) => {
      if (data !== null && data !== '') {
        const img = new Image()
        img.src = makeBlockie(data)
        return img.src
      }
    },
    tokenToStr: (token) => {
      let str = ''
      if (token.title) {
        str = token.title + ' ' + token.balance + ' ' + token.symbol
      }
      return str
    },
    tokenToStrTotal (token, currency) {
      if (token && this.formattedTotal(token.total_value_usd, currency.decimals_min, currency.decimals_max) > 0) {
        return '= ' + this.formattedTotal(token.total_value_usd, currency.decimals_min, currency.decimals_max) + currency.symbol
      } else {
        return ''
      }
    },
    fromWei (value, unit) {
      if (value) {
        return utils.fromWei(value, unit)
      }
    }
  }
}

Number.prototype.round = function (places) {
  return +(Math.round(this + 'e+' + places) + 'e-' + places)
}
