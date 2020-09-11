const Post = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => parent.author === user.id);
  },
};
module.exports = Post;
