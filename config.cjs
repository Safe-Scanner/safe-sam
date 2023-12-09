const dotenv = require('dotenv')
const path = require('path')

dotenv.config()
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'
console.log(`Current environment ${process.env.NODE_ENV}`)

dotenv.config({
  path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`),
})

console.log('process.env', process.env)
