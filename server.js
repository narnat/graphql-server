const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');
require('dotenv/config');
const itemsSchema = new mongoose.Schema({
  id:
  {
      type: Number,
      required: true
  },
  title: {
      type: String,
      required: true
  },
  routeName: {
      type: String,
      required: true
  },
  items: [{
      id: {
          type: Number,
          required: true
      },
      name: {
          type: String,
          required: true
      },
      imageUrl: {
          type: String,
          required: true
      },
      price: {
          type: mongoose.Number,
          required: true
      }
  }]
});

const Item = mongoose.model('Item', itemsSchema);

mongoose.connect(process.env.DB_CONNECTION, 
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }
)
.then (con => {
    Item.find((err, res) => {
      if (err) return console.log("err");
      const typeDefs = `
  type Query {
    all: [Items!]!
  }

  type Items {
    id: Int!
    title: String!
    routeName: String!
    items: [Item!]!
  }

  type Item {
    id: Int!
    name: String!
    imageUrl: String!
    price: Int!
  }
`;
      const resolvers = {
        Query: {
         all: () => res,
        },
      };
     
      const options = {
        port: 4000,
        endpoint: '/graphql',
        subscriptions: '/subscriptions',
        playground: '/playground',
      }
     
     const server = new GraphQLServer({ typeDefs, resolvers });
     server.start(options, () => console.log('Server is running on localhost:4000'));
    });
})
.catch (err=> {
  console.log(err);
});
