const User = {
  comments(parent, args, { db }, info) {
    return db.coms.filter((comment) => comment.author == parent.id);
  },
};
module.exports = User;
