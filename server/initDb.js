import { pool } from './helper/db.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function initializeDatabase() {
  try {
    console.log('Initializing database...')
    
    // Read the SQL file
    const sqlFile = join(__dirname, 'db.sql')
    const sql = readFileSync(sqlFile, 'utf8')
    
    // Split SQL commands by semicolon and filter out empty statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.substring(0, 50) + '...')
        await pool.query(statement)
      }
    }
    
    console.log('Database initialization completed successfully!')
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    // Don't exit the process - let the app continue even if DB init fails
    // This allows for cases where tables might already exist
    console.log('Continuing with application startup...')
  }
}

// Run initialization
initializeDatabase()