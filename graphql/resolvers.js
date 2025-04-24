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
import MovieModel from '../models/moviesModel';
const resolvers = {
    Query: {
        getMovies: () => __awaiter(void 0, void 0, void 0, function* () { return yield MovieModel.find(); }),
        getMovie: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) { return yield MovieModel.findById(id); }),
    },
    Mutation: {
        addMovie: (_, args) => __awaiter(void 0, void 0, void 0, function* () {
            const movie = new MovieModel(args);
            yield movie.save();
            return movie;
        }),
        updateMovie: (_, _a) => __awaiter(void 0, void 0, void 0, function* () {
            var { id } = _a, updates = __rest(_a, ["id"]);
            const movie = yield MovieModel.findByIdAndUpdate(id, updates, { new: true });
            return movie;
        }),
        deleteMovie: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { id }) {
            yield MovieModel.findByIdAndDelete(id);
            return `Movie with ID ${id} deleted.`;
        })
    }
};
export default resolvers;
