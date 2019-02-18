import React from 'react';
import { buildClient } from './client';

const ClientContext = React.createContext( buildClient() );

export {
  ClientContext
}
