const { GraphQLServer } = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Post = require('./resolvers/Post');
const Comment = require('./resolvers/Comment');
const User = require('./resolvers/User');

// const { coms, pts, users } = require('./db');
// ceci n'est pas la bonne solution car le resolver, mution et query seront mis dans autres files
//solution est dutiliser le context qui existe deja dans tous les methodes du resolver
const db = require('./db');

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    Comment,
    User,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.log('server lance avec succes...');
});
