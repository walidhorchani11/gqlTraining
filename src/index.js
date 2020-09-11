const { GraphQLServer } = require('graphql-yoga');
const { randomBytes } = require('crypto');
const { coms, pts, users } = require('./db');
// ceci n'est pas la bonne solution car le resolver, mution et query seront mis dans autres files
//solution est dutiliser le context qui existe deja dans tous les methodes du resolver
const db = require('./db');

// Type Query and Mutation

const resolvers = {
  Query: {
    comment(parent, args, { db }, info) {
      return db.coms.find((comment) => comment.id === args.id);
    },

    comments(parent, args, { db }, info) {
      return db.coms;
    },

    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.pts;
      }
      return db.pts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },

    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
  },

  //MUTATION
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(
        (user) => user.email === args.data.email
      );
      if (emailTaken) {
        throw Error('email taken !');
      }
      const newUser = {
        id: randomBytes(4).toString('hex'),
        ...args.data,
      };
      db.users.push(newUser);

      return newUser;
    },
    deleteUser(parent, args, { db }, info) {
      //get index of wanted user to delete it with splice methode
      const indexUser = db.users.findIndex((user) => user.id === args.id);
      // throw error if user nexist pas
      if (indexUser === -1) {
        throw new Error('user not found!');
      }
      // delete this user from array
      const deletedUsers = db.users.splice(indexUser, 1);

      //delete tous les posts de ce user avec leurs commentaires
      db.pts = db.pts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          //if le post appartient au user to delete, delete comments de ce post
          db.coms = db.coms.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });

      db.coms = db.coms.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, { db }, info) {
      //check if user exist
      const userExist = db.users.some((user) => user.id === args.data.author);
      if (!userExist) {
        throw new Error('user not found !');
      }

      const post = {
        id: randomBytes(4).toString('hex'),
        ...args,
        published: args.data.published || true,
      };

      db.pts.push(post);

      return post;
    },
    deletePost(parent, args, { db }, info) {
      //delete post the delete all comments belong to this post
      const indexPost = db.pts.findIndex((post) => post.id === args.id);
      if (indexPost === -1) {
        throw new Error('post not found !');
      }
      const postDeleted = db.pts.splice(indexPost, 1);
      //delete comments appartient a ce post
      db.coms = db.coms.filter((comment) => comment.post !== args.id);

      return postDeleted[0];
    },
    createComment(parent, args, { db }, info) {
      //le commentaire doit etre sur un post existant et publie, et le user doit etre existant le createur du comment
      const userExist = db.users.some((user) => user.id === args.author);
      const postExistAndPublish = db.pts.some(
        (post) => post.id === args.post && post.published
      );
      if (!userExist || !postExistAndPublish) {
        throw new Error(
          'user inexistant or post inexistant ou pas encore publier'
        );
      }

      const comment = {
        id: randomBytes(4).toString('hex'),
        ...args,
      };

      db.coms.push(comment);

      return comment;
    },
    deleteComment(parent, args, { db }, info) {
      const indexComment = db.coms.findIndex(
        (comment) => comment.id === args.id
      );
      if (indexComment === -1) {
        throw new Error('comment not found !');
      }
      comDeleted = db.coms.splice(indexComment, 1);

      return comDeleted[0];
    },
  },

  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => parent.author === user.id);
    },
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => user.id === parent.author);
    },
    post(parent, args, { db }, info) {
      return db.pts.find((post) => post.id == parent.post);
    },
  },
  User: {
    comments(parent, args, { db }, info) {
      return db.coms.filter((comment) => comment.author == parent.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
  },
});

server.start(() => {
  console.log('server lance avec succes...');
});
