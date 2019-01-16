import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Pages/Dashboard'
import Index from '@/components/Pages/Index'
import Transaction from '@/components/Pages/Transaction'
import store from '../store'
import { ACCOUNT_UPDATE_ADDRESS } from '../store/modules/actions.type'

const ifNotAuthenticated = (to, from, next) => {
  next()
}

const ifAuthenticated = (to, from, next) => {
  if (store.state.account.address === '' && to.params.address) {
    if (to.params.token) {
      if (to.params.token === 'ethereum') {
        store.dispatch(ACCOUNT_UPDATE_ADDRESS, {
          address: to.params.address,
          type: 'WATCH',
          selectedToken: '0x0000000000000000000000000000000000000000'
        })
      } else {
        store.dispatch(ACCOUNT_UPDATE_ADDRESS, {
          address: to.params.address,
          type: 'WATCH',
          selectedToken: to.params.token
        })
      }
    } else {
      store.dispatch(ACCOUNT_UPDATE_ADDRESS, {
        address: to.params.address,
        type: 'WATCH'
      })
    }

    next()
    return
  } else {
    if (store.state.account.address !== '') {
      next()
      return
    }
  }

  next({ name: 'index' })
}

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '',
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      beforeEnter: ifNotAuthenticated
    },
    {
      name: 'transaction',
      path: '/tx/:hash',
      component: Transaction
    },
    {
      name: 'dashboard',
      path: '/:address',
      component: Dashboard,
      beforeEnter: ifAuthenticated,
      children: [
        {
          name: 'token',
          path: 'token/:token',
          component: Dashboard
        }
      ]
    }
  ]
})
