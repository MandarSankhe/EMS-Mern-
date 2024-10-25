import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import EmployeeDirectory from './components/EmployeeDirectory';

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <EmployeeDirectory />
      </div>
    </ApolloProvider>
  );
}

export default App;
