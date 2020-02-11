import { buildClient } from './client'
import { buildCheckout } from './checkout'

const ClientContext = wp.element.createContext(buildClient())
const CheckoutContext = wp.element.createContext(buildCheckout())

export { ClientContext, CheckoutContext }
