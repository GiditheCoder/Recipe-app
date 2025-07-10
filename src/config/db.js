import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { ENV } from "./env.js";
import * as schema from '../db/schema.js'

// initialize the database url
const sql = neon(ENV.DATABASE_URL)

// then we export the db using drizzle 
export const db = drizzle(sql , {schema})
