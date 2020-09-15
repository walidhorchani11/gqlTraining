const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let c = 0;

      setInterval(() => {
        c++;
        // publiser ce qu on veut dans le chanel
        // publish prend le nom du channel dans laquelle on injecte les data comme 2eme params
        pubsub.publish('count', {
          x: 'walidos',
          c,
        });
      }, 1000);

      return pubsub.asyncIterator('count');
    },
  },

  comment: {
    subscribe(parent, { postId }, { pubsub, db }, info) {
      // on verify si le post existe existe
      const post = db.pts.find((post) => post.id === postId);
      if (!post) {
        throw new Error('post not found !');
      }
      //il reste seulement de chooisir le bon endroit pour faire publier ce qu on veut dans la chaine
      //dans notre cas le bon endroit c'est le moemetn ou on va creer un nouveau comment alors dans createComment mutation

      //le nom de la chaine doit contenir l id du post, car on ecoute les comments for a specefic post
      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },

  post: {
    subscribe(parent, args, { pubsub, db }, info) {
      return pubsub.asyncIterator('post');
    },
  },
};

module.exports = Subscription;
