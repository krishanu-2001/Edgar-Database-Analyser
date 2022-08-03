import React, { useState } from 'react';
import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/router/App';
import './fontawesome';
import { ApolloProvider } from '@apollo/client';
import client from '@/apollo/index';
import AuthContext from './context/context-config';

function App() {
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const setCompany = (companies) => setSelectedCompanies(companies);

  return (
    <>
      <Suspense fallback={<></>}>
        <ApolloProvider client={client}>
          <Router>
            <AuthContext.Provider
              value={{
                selectedCompanies: selectedCompanies,
                setSelectedCompanies: setCompany
              }}
            >
              <AppRoutes />
            </AuthContext.Provider>
          </Router>
        </ApolloProvider>
      </Suspense>
    </>
  );
}

export default App;
