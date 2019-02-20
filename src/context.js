import React from 'react';
import { buildClient } from './client';
import { buildCheckout } from './checkout';

const ClientContext = React.createContext(buildClient());
// const CheckoutContext = React.createContext(buildCheckout());

export {
   ClientContext,
   // CheckoutContext
}
