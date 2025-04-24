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
import typeDefs from './graphql/typeDefs.js';
import resolvers from './graphql/resolvers.js';
import connectDB from './db.js';
import dotenv from 'dotenv';
import { getUserFromToken } from './utils/auth.js';
import logger from './utils/logger.js';
dotenv.config();
const app = express();
app.use(express.json());
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectDB();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req }) {
            const user = yield getUserFromToken(req);
            return { user };
        }),
        formatResponse: (res, req) => {
            const acceptHeader = req.request.http.headers.get('accept') || '';
            if (acceptHeader.includes('application/graphql-response+json')) {
                logger.info('Header testing');
            }
            return res;
        }
    });
    yield server.start();
    server.applyMiddleware({ app });
    app.get('/', (req, res) => {
        res.send('GraphQL API running...');
    });
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        logger.info(`🚀 Server running at http://localhost:${port}${server.graphqlPath}`);
    });
});
startServer();
