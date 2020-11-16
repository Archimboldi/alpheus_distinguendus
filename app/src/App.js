import './App.css';
import 'rsuite/dist/styles/rsuite-default.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Shebei from './main/shebei';


const client = new ApolloClient({
  uri: 'http://127.0.0.1:8000/graphql',
  cache: new InMemoryCache()
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Shebei />
    </ApolloProvider>
  );
}

export default App;