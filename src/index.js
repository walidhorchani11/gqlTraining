const { GraphQLServer, PubSub } = require('graphql-yoga');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Post = require('./resolvers/Post');
const Comment = require('./resolvers/Comment');
const User = require('./resolvers/User');
const Subscription = require('./resolvers/Subscription');

// const { coms, pts, users } = require('./db');
// ceci n'est pas la bonne solution car le resolver, mution et query seront mis dans autres files
//solution est dutiliser le context qui existe deja dans tous les methodes du resolver
const db = require('./db');

//pour l utilisation du subscription :
// 1 - import PUbSub // 2- creer une instance PubSUb pour le passer dans le context du server

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    Comment,
    User,
  },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log('server lance avec succes...');
});
