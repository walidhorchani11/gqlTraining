const Query = {
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
};

module.exports = Query;
