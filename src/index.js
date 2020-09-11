const { GraphQLServer } = require('graphql-yoga');
const { randomBytes } = require('crypto');

// fake data
let users = [
  {
    id: '1',
    name: 'walid',
    job: 'juoueur',
    address: 'ca',
    email: 'walidhorchani@gmail.com',
  },
  {
    id: '2',
    name: 'Aya',
    job: 'prof',
    address: 'est',
    email: 'horchani@gmail.com',
  },
  {
    id: '3',
    name: 'arwa',
    job: 'teacher',
    address: 'css',
    email: 'tout@gmail.com',
  },
  {
    id: '4',
    name: 'mohamed',
    job: 'avion',
    address: 'ess',
    email: 'doq@gmail.com',
  },
];

let pts = [
  {
    id: '1',
    title: 'good food',
    body: 'this is a greate foods hello',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'plage bizete',
    body: 'fait une randone ensuite camping au palge biz',
    published: true,
    author: '2',
  },
  {
    id: '3',
    title: 'parapente',
    body: 'ail du ciele magnifique experirnece',
    published: true,
    author: '1',
  },
];

let coms = [
  { id: '1', content: 'my first comment', author: '2', post: '1' },
  { id: '2', content: 'my 2eme comment', author: '2', post: '1' },
  { id: '3', content: 'my troisieme comment', author: '1', post: '2' },
];

// Type Query and Mutation

const typeDefs = `
type Query {
  me: User
  post: Post
  users(query: String): [User]
  posts(query: String): [Post]
  comment(id: ID!) : Comment
  comments: [Comment]
}
type Mutation {
  createUser(data: CreateUserInput): User!
  deleteUser(id:ID!):User!
  createPost(data: CreatePostInput): Post!
  deletePost(id: ID!): Post!
  createComment(data: CreateCommentInput) : Comment!
  deleteComment(id:ID!) : Comment!
}

input CreateUserInput {
  name: String!
  email: String!
  age: Int
}

input CreatePostInput {
  title: String!
  body : String!
  published: Boolean
  author: ID!
}

input CreateCommentInput {
  content: String!
  author: ID!
  post: ID!
}

type Comment {
  id: ID!
  content: String!
  author: User
  post: Post
}

type User {
  id: ID!
  email: String!
  name: String!
  job: String
  address: String
  posts: [Post]
  comments: [Comment]
}

type Post {
  id : ID!
  title: String!
  body : String!
  published: Boolean!
  author: User
}
`;

const resolvers = {
  Query: {
    comment(parent, args, ctx, info) {
      return coms.find((comment) => {
        console.log('coooooo::', args.id);
        return comment.id * 1 == args.id * 1;
      });
      //return coms[args.id];
    },

    comments() {
      return coms;
    },

    posts(parent, args, ctx, info) {
      if (!args.query) {
        return pts;
      }
      return pts.filter((post) => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },

    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    me() {
      return {
        id: '123456789',
        name: 'walidos',
        job: 'devdouv',
        address: 'badezvieald cote mer rue 12',
      };
    },

    post() {
      return {
        id: '151515454',
        title: 'learning graphql',
        body: 'formation gratuit  pour apprendre graphql ',
        published: true,
      };
    },
  },

  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw Error('email taken !');
      }
      const newUser = {
        id: randomBytes(4).toString('hex'),
        ...args.data,
      };
      users.push(newUser);

      return newUser;
    },
    deleteUser(parent, args, ctx, info) {
      //get index of wanted user to delete it with splice methode
      const indexUser = users.findIndex((user) => user.id === args.id);
      // throw error if user nexist pas
      if (indexUser === -1) {
        throw new Error('user not found!');
      }
      // delete this user from array
      const deletedUsers = users.splice(indexUser, 1);
      console.log('user deleted!', deletedUsers);
      console.log('users restants:::', users);

      //delete tous les posts de ce user avec leurs commentaires
      pts = pts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          //if le post appartient au user to delete, delete comments de ce post
          coms = coms.filter((comment) => comment.post !== post.id);
        }
        return !match;
      });

      coms = coms.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      //check if user exist
      const userExist = users.some((user) => user.id === args.data.author);
      if (!userExist) {
        throw new Error('user not found !');
      }

      const post = {
        id: randomBytes(4).toString('hex'),
        ...args,
        published: args.data.published || true,
      };

      pts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      //delete post the delete all comments belong to this post
      const indexPost = pts.findIndex((post) => post.id === args.id);
      if (indexPost === -1) {
        throw new Error('post not found !');
      }
      const postDeleted = pts.splice(indexPost, 1);
      //delete comments appartient a ce post
      coms = coms.filter((comment) => comment.post !== args.id);

      return postDeleted[0];
    },
    createComment(parent, args, ctx, info) {
      //le commentaire doit etre sur un post existant et publie, et le user doit etre existant le createur du comment
      const userExist = users.some((user) => user.id === args.author);
      const postExistAndPublish = pts.some(
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

      coms.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const indexComment = coms.findIndex((comment) => comment.id === args.id);
      if (indexComment === -1) {
        throw new Error('comment not found !');
      }
      comDeleted = coms.splice(indexComment, 1);

      return comDeleted[0];
    },
  },

  Post: {
    author(parent, args, ctx, info) {
      console.log('nu par is;;;', parent);
      return users.find((user) => parent.author === user.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      console.log('author id is :::', parent.author);
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return pts.find((post) => post.id == parent.post);
    },
  },
  User: {
    comments(parent, args, ctx, info) {
      return coms.filter((comment) => comment.author == parent.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('server lance avec succes...');
});
