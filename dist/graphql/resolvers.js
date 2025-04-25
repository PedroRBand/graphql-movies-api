var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import UserModel from '../models/userModel.js';
import MovieModel from '../models/moviesModel.js';
import { generateToken } from '../utils/auth.js';
import { checkRole } from '../utils/permissions.js';
import logger from '../utils/logger.js';
const errorNoId = (id) => {
    logger.error(`Movie not found with ID: ${id}`);
    throw new Error(`Movie with ID ${id} not found.`);
};
const resolvers = {
    Query: {
        getMovies: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { page, limit, sortBy, sortOrder }) {
            logger.info(`Fetching movies: page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}`);
            const skip = (page - 1) * limit;
            const sortDirection = sortOrder === 'DESC' ? -1 : 1;
            const totalCount = yield MovieModel.countDocuments();
            const totalPages = Math.ceil(totalCount / limit);
            const movies = yield MovieModel.find().skip(skip).limit(limit).sort({ [sortBy]: sortDirection });
            return {
                movies,
                totalCount,
                currentPage: page,
                totalPages
            };
        }),
        getMovie: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            const movie = yield MovieModel.findById(id);
            if (!movie) {
                errorNoId(id);
            }
            return movie;
        }),
        getCurrentUser: (_1, __1, _a) => __awaiter(void 0, [_1, __1, _a], void 0, function* (_, __, { user }) { return user; })
    },
    Mutation: {
        register: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { username, password, role = 'guest' }, { user }) {
            const existing = yield UserModel.findOne({ username });
            if (existing)
                throw new Error('Username already exists.');
            const hasAdminRole = role === 'admin';
            if (hasAdminRole) {
                if (!user || user.role !== 'admin') {
                    throw new Error('Admin registration is restricted to high-level users.');
                }
            }
            const newUser = new UserModel({ username, password, role });
            yield newUser.save();
            const token = generateToken(newUser);
            return Object.assign(Object.assign({}, newUser.toObject()), { token });
        }),
        login: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { username, password }) {
            const user = yield UserModel.findOne({ username });
            if (!user)
                throw new Error('Invalid credentials');
            const isMatch = yield user.comparePassword(password);
            if (!isMatch)
                throw new Error('Invalid credentials');
            const token = generateToken(user);
            return Object.assign(Object.assign({}, user.toObject()), { token });
        }),
        addMovie: (_1, args_1, _a) => __awaiter(void 0, [_1, args_1, _a], void 0, function* (_, args, { user }) {
            if (!user)
                throw new Error('Operation unauthorized.');
            const movie = new MovieModel(args);
            yield movie.save();
            return movie;
        }),
        updateMovie: (_, _a, _b) => __awaiter(void 0, void 0, void 0, function* () {
            var { id } = _a, updates = __rest(_a, ["id"]);
            var user = _b.user;
            checkRole(user, ['admin']);
            const movie = yield MovieModel.findByIdAndUpdate(id, updates, { new: true });
            if (!movie) {
                errorNoId(id);
            }
            return movie;
        }),
        deleteMovie: (_1, _a, _b) => __awaiter(void 0, [_1, _a, _b], void 0, function* (_, { id }, { user }) {
            checkRole(user, ['admin']);
            const movie = yield MovieModel.findByIdAndDelete(id);
            if (!movie) {
                errorNoId(id);
            }
            return `Movie with ID ${id} deleted.`;
        })
    },
    Movie: {
        karaoke: (parent) => {
            return parent.singAlong();
        }
    }
};
export default resolvers;
