const { randomBytes } = require('crypto');

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
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
  createPost(parent, args, { db, pubsub }, info) {
    //check if user exist
    const userExist = db.users.some((user) => user.id === args.data.author);
    if (!userExist) {
      throw new Error('user not found !');
    }

    const post = {
      id: randomBytes(4).toString('hex'),
      ...args.data,
    };

    console.log('post created :', post);

    db.pts.push(post);
    //publish new post to our chanel here
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    //delete post the delete all comments belong to this post
    const indexPost = db.pts.findIndex((post) => post.id === args.id);
    if (indexPost === -1) {
      throw new Error('post not found !');
    }
    const [post] = db.pts.splice(indexPost, 1);
    //delete comments appartient a ce post
    db.coms = db.coms.filter((comment) => comment.post !== args.id);
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    //le commentaire doit etre sur un post existant et publie, et le user doit etre existant le createur du comment
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExistAndPublish = db.pts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExist) {
      throw new Error('user inexistant');
    }
    if (!postExistAndPublish) {
      throw new Error('post inexistant ou pas encore publier');
    }

    const comment = {
      id: randomBytes(4).toString('hex'),
      ...args.data,
    };
    //call publish here to publie data on concerned chanel

    db.coms.push(comment);
    pubsub.publish(`comment ${args.data.post}`, { comment });

    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const indexComment = db.coms.findIndex((comment) => comment.id === args.id);
    if (indexComment === -1) {
      throw new Error('comment not found !');
    }
    comDeleted = db.coms.splice(indexComment, 1);

    return comDeleted[0];
  },

  //pour les mutation update :
  // au niveau du subscription, on test si update a modifier le champs published to false , alors mutation sera 'DELETED' , au cas contraire c'est avec mutation 'CREATED'
  // todo
};
module.exports = Mutation;
