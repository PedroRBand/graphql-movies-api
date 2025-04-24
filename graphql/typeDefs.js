import { gql } from 'apollo-server-express';
const typeDefs = gql `
  type Movie {
    id: ID!
    title: String!
    runtime: Int
    mainSong: String
    genres: [String!]!
  }

  type Query {
    getMovies: [Movie]
    getMovie(id: ID!): Movie
  }

  type Mutation {
    addMovie(
      title: String!
      runtime: Int
      mainSong: String
      genres: [String!]!
    ): Movie

    updateMovie(
      id: ID!
      title: String
      runtime: Int
      mainSong: String
      genres: [String!]
    ): Movie

    deleteMovie(id: ID!): String
  }
`;
export default typeDefs;
