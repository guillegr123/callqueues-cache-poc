import React, { createContext, useEffect, useState } from 'react';
import { ApolloProvider } from '@apollo/client';

import { graphqlClient, connectToWebSocket } from './miniSdk';

export const MiniSdkContext = createContext({
  ws: null
});

const MiniSdkProvider = ({ children }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const ws = connectToWebSocket();
    setWs(ws);
    return () => ws.then(instance => instance.close());
  }, []);

  return (
    <MiniSdkContext.Provider value={{ ws }}>
      <ApolloProvider client={graphqlClient}>
        {children}
      </ApolloProvider>
    </MiniSdkContext.Provider>
  );
};

export default MiniSdkProvider;
