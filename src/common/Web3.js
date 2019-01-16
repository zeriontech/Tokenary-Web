import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import abi from './json/erc20.abi'

export const web3Instance = new Web3(
  new Web3.providers.HttpProvider(process.env.VUE_APP_TOKENARY_URL_PROVIDER)
)

export const toWei = ether => web3Instance.utils.toWei(ether)

export const getTransactionCount = address =>
  web3Instance.eth.getTransactionCount(address, 'pending')

export const createSignableTransaction = (transaction) =>
  new Promise((resolve, reject) => {
    if (transaction.contractAddress) {
      transaction = getTransferTokenTransaction(transaction)
    }
    const _value = transaction.value ? toWei(transaction.value) : '0x00'
    const _data = transaction.data || '0x'
    createTransactionTx({
      from: transaction.from,
      to: transaction.to,
      data: _data,
      value: _value,
      gasPrice: transaction.gasPrice,
      gasLimit: transaction.gasLimit
    }).then(txDetails => resolve(txDetails))
      .catch(error => reject(error))
  })

export const getDataString = (func, arrVals) => {
  let val = ''
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64)
  const data = func + val
  return data
}

export const padLeft = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export const removeHexPrefix = hex => hex.toLowerCase().replace('0x', '')

export const getTransferTokenTransaction = transaction => {
  const transferMethodHash = '0xa9059cbb'
  const value = BigNumber(BigNumber(transaction.value).times(BigNumber(10).pow(transaction.decimals))).toString(16)
  const recipient = removeHexPrefix(transaction.to)
  const dataString = getDataString(transferMethodHash, [recipient, value])
  return {
    from: transaction.from,
    to: transaction.contractAddress,
    data: dataString,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit
  }
}

export const estimateGasContract = (from, to, value, gas, contractAddress, gasLimit = false) => {
  let contract = new web3Instance.eth.Contract(abi, contractAddress, { from: from })

  return new Promise((resolve, reject) => {
    if (gasLimit) {
      resolve(gasLimit)
    }

    contract.methods.transfer(to, value).estimateGas().then((estimateGas) => {
      resolve(estimateGas)
    }).catch(reject)
  })
}

export const estimateGasEth = (from, to, value, gas, gasLimit = false, data = false) => {
  return new Promise((resolve, reject) => {
    let transactionObject = {
      from: from,
      value: toWei(value),
      to: to,
      gasPrice: gas
    }
    if (gasLimit) {
      resolve(gasLimit)
    }
    if (data) {
      transactionObject.data = data
    }
    web3Instance.eth.estimateGas(transactionObject).then((estimateGas) => {
      resolve(estimateGas)
    }).catch(reject)
  })
}

export const createTransactionTx = async ({
  from,
  to,
  data,
  value,
  gasPrice,
  gasLimit
}) => {
  const _gasPrice = gasPrice || (await web3Instance.eth.getGasPrice())
  const estimateGasData = value === '0x00' ? { from, to, data } : { to, data }
  const _gasLimit =
    gasLimit || (await web3Instance.eth.estimateGas(estimateGasData))
  const nonce = await getTransactionCount(from)

  return {
    from: from,
    to: to,
    nonce: web3Instance.utils.toHex(nonce),
    gasPrice: web3Instance.utils.toHex(_gasPrice),
    gasLimit: web3Instance.utils.toHex(_gasLimit),
    gas: web3Instance.utils.toHex(_gasLimit),
    value: web3Instance.utils.toHex(value),
    data: data
  }
}

export const web3SendSignedTransaction = signedTx =>
  new Promise((resolve, reject) => {
    const serializedTx = typeof signedTx === 'string' ? signedTx : signedTx.raw
    web3Instance.eth
      .sendSignedTransaction(serializedTx)
      .once('transactionHash', txHash => resolve(txHash))
      .catch(error => reject(error))
  })

export const getBalance = (address, contractAddress = '0x0000000000000000000000000000000000000000') => {
  return new Promise((resolve) => {
    if (contractAddress !== '0x0000000000000000000000000000000000000000') {
      let contract = new window.web3.eth.Contract(abi, contractAddress)
      contract.methods.balanceOf(address).call().then((balance) => {
        contract.methods.decimals().call().then((decimals) => {
          resolve(balance / Math.pow(10, decimals))
        })
      })
    } else {
      window.web3.eth.getBalance(address).then((balance) => {
        resolve(window.web3.utils.fromWei(balance, 'ether'))
      })
    }
  })
}

export const getTransactionReceipt = hash => {
  return new Promise((resolve) => {
    web3Instance.eth.getTransactionReceipt(hash)
      .then(transaction => {
        resolve(transaction)
      })
      .catch(e => {
        console.log(e)
      })
  })
}
