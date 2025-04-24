import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    runtime: Int
    mainSong: String
    genres: [String!]!
    karaoke: String!
  }

  type MoviePaginationResponse {
    movies: [Movie]
    totalCount: Int
    currentPage: Int
    totalPages: Int
  }

  type User {
    id: ID!
    username: String!
    role: String!
    token: String
  }

  type Query {
    getMovies(
      page: Int = 1,
      limit: Int = 10,
      sortBy: String = "title",
      sortOrder: String = "ASC"
    ): MoviePaginationResponse
    getMovie(id: ID!): Movie
    getCurrentUser: User
  }

  type Mutation {
    register(
      username: String!
      password: String!
      role: String
    ): User

    login(
      username: String!
      password: String!
    ): User

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
`

export default typeDefs