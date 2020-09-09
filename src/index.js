const {GraphQLServer} = require('graphql-yoga');
const {randomBytes} = require('crypto');

// fake data
const users = [
  {id: "1", name: "walid", job: 'juoueur', address:"ca", email: 'walidhorchani@gmail.com'},
  {id: "2", name: "mayssa", job: 'prof', address:"est", email: 'horchani@gmail.com'},
  {id: "3", name: "arwa", job: 'teacher', address:"css", email: 'tout@gmail.com'},
  {id: "4", name: "mohamed", job: 'avion', address:"ess", email: 'doq@gmail.com'},
];

const pts = [
  {id :"1", title: "good food", body : "this is a greate foods hello", published: true, author: "1"},
  {id :"2", title: "plage bizete", body : "fait une randone ensuite camping au palge biz", published: true, author: "2"},
  {id :"3", title: "parapente", body : "ail du ciele magnifique experirnece", published: true, author: "1"},

];

const coms = [
  {id: "1", content: "my first comment", author: "2", post: "1"},
  {id: "2", content: "my 2eme comment", author: "2", post: "1"},
  {id: "3", content: "my troisieme comment", author: "1", post: "2"},
]

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
  createUser(name: String!, email: String!, age: Int): User!
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
`


const resolvers = {
  Query:{

    comment(parent, args, ctx, info) {
       return coms.find((comment) => {
        console.log('coooooo::', args.id);
        return comment.id * 1  == args.id * 1;
       }
          
       )
      //return coms[args.id];
    },

    comments() {
      return coms;
    },


    posts(parent, args, ctx, info){
      if (!args.query){
        return pts;
      }
      return pts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) || post.body.toLowerCase().includes(args.query.toLowerCase())
      })

    },

    users(parent, args, ctx, info) {
      if (!args.query){
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    me () {
      return {
        id: '123456789',
        name: 'walidos',
        job: 'devdouv',
        address: 'badezvieald cote mer rue 12'
      }
    },

    post () {
      return {
        id: "151515454",
        title: 'learning graphql',
        body: 'formation gratuit  pour apprendre graphql ',
        published: true,
      }
    }
  },

  Mutation: {
    createUser(parent, args, ctx, info){
      const emailTaken = users.some(user => user.email === args.email); 
      if(emailTaken) {
        throw Error('email taken !');
      }
      const newUser = {
        id : randomBytes(4).toString('hex'),
        name: args.name,
        job: args.job, 
        address: args.adress, 
        email: args.email
      }
      users.push(newUser);
      
      return newUser;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      console.log('nu par is;;;', parent)
      return users.find(user =>  parent.id === user.id)
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      console.log('author id is :::', parent.author);
      return users.find(user => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return pts.find(post => post.id == parent.post)
    }
  },
  User: {
    comments (parent, args, ctx, info){
      return coms.filter(comment => comment.author == parent.id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
}) 

server.start(()=> {
  console.log('server lance avec succes...')
})

