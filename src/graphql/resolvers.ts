import UserModel from '../models/userModel.js'
import MovieModel from '../models/moviesModel.js'
import { generateToken } from '../utils/auth.js'
import { checkRole } from '../utils/permissions.js'
import logger from '../utils/logger.js'

type Movie = {
  id: string,
  title: string,
  runtime?: number,
  mainSong?: string,
  genres: string[]
}

const resolvers = {
  Query: {
    /* getMovies: async () => await MovieModel.find(), */
    getMovies: async (
      _: any,
      {page, limit, sortBy, sortOrder}: any
    ) => {
      logger.info(`Fetching movies: page=${page}, limit=${limit}, sortBy=${sortBy}, sortOrder=${sortOrder}`)

      const skip = (page - 1) * limit
      const sortDirection = sortOrder === 'DESC' ? -1 : 1
      
      const totalCount = await MovieModel.countDocuments()
      const totalPages = Math.ceil(totalCount / limit)
      
      const movies = await MovieModel.find().skip(skip).limit(limit).sort({[sortBy]: sortDirection})

      return {
        movies,
        totalCount,
        currentPage: page,
        totalPages
      }
    },
    getMovie: async (_: any, { id }: { id: string }) => {
      const movie = await MovieModel.findById(id)
      if(!movie) {
        logger.error(`Movie not found with ID: ${id}`)
        throw new Error(`No movie with id ${id} found`)
      }

      return movie
    },
    getCurrentUser: async(_: any, __: any, {user}: any) => user
  },

  Mutation: {
    register: async (_: any, { username, password, role = 'guest' }: any, { user }: any) => {
      const existing = await UserModel.findOne({ username })
      if (existing) throw new Error('Username already exists.')

      const hasAdminRole = role === 'admin'
      if(hasAdminRole) {
        if(!user || user.role !== 'admin') {
          throw new Error('Admin registration is restricted to high-level users.')
        }
      }
      const newUser = new UserModel({ username, password, role})
      await newUser.save()

      const token = generateToken(newUser)
      return { ...newUser.toObject(), token }
    },
    login: async (_: any, { username, password }: any) => {
      const user = await UserModel.findOne({ username })
      if (!user) throw new Error('Invalid credentials')

      const isMatch = await user.comparePassword(password)
      if (!isMatch) throw new Error('Invalid credentials')

      const token = generateToken(user)
      return { ...user.toObject(), token }
    },
    addMovie: async (_: any, args: Movie, { user }: any) => {
      if (!user) throw new Error('Operation unauthorized.')
      const movie = new MovieModel(args)
      await movie.save()
      return movie
    },
    updateMovie: async (_: any, { id, ...updates }: Movie, { user }: any) => {
      checkRole(user, ['admin'])
      const movie = await MovieModel.findByIdAndUpdate(id, updates, { new: true })
      return movie
    },
    deleteMovie: async (_: any, { id }: { id: string }, { user }: any) => {
      checkRole(user, ['admin'])
      await MovieModel.findByIdAndDelete(id)
      return `Movie with ID ${id} deleted.`
    }
  },

  Movie: {
    karaoke: (parent: any) => {
      return parent.singAlong()
    }
  }
}

export default resolvers