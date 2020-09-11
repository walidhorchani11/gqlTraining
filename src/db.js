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

module.exports = { coms, pts, users };
