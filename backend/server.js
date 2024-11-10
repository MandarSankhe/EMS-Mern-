const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { loadFilesSync } = require('@graphql-tools/load-files'); // Import loadFilesSync
const { mergeTypeDefs } = require('@graphql-tools/merge');
const path = require('path');
const resolvers = require('./resolvers/resolvers');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors({}));


// Load and merge GraphQL schema files from the graphql directory
const typesArray = loadFilesSync(path.join(__dirname, './schema'), {
  extensions: ['graphql'],
});
const typeDefs = mergeTypeDefs(typesArray); // Define typeDefs using merged schemas

async function startServer() {
// Initialize ApolloServer with typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();
server.applyMiddleware({ app });

const PORT = 5000;

// Connect to MongoDB and start the server
const uri =
	"mongodb+srv://mandarsankhe:mandar1231@cluster0.2y2ujpq.mongodb.net/EMS?retryWrites=true&w=majority&appName=Cluster0";
    
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
    });
  })
  .catch((err) => console.log(err));

}

startServer();