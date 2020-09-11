const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.author);
  },
  post(parent, args, { db }, info) {
    return db.pts.find((post) => post.id == parent.post);
  },
};

module.exports = Comment;
