var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolvers';
import connectDB from './db';
const app = express();
app.use(express.json());
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    const server = new ApolloServer({ typeDefs, resolvers });
    yield server.start();
    server.applyMiddleware({ app });
    app.get('/', (req, res) => {
        res.send('GraphQL API running...');
    });
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`);
    });
});
startServer();
