import express from "express";
import { ENV } from "./config/env.js";
import {db} from "./config/db.js"
import { favoriteTable } from "./db/schema.js";
import { and, eq } from "drizzle-orm";
import job from "./config/cron.js";

const app = express();
const PORT = ENV.PORT || 8001

 if( ENV.NODE_ENV === "production")   job.start()

app.use(express.json())

// run an end point to check if the server is healthy 
app.get("/api/health", (req, res)=>{
 res.status(200).json({success: true})
})

// run an end point to create a favourites table 
app.post("/api/favorites", async (req, res )=>{
   
    try {
        // we would pass something up , if not he values of userId, recipeId etc would result in undefined 
        const {userId, recipeId, title , image , cookTime , servings} = req.body 
    
        if(!userId || !recipeId || !title ){
        //    if it doesnt contain the userId , recipeId etc
        return res.status(400).json({error: "Missing required fields"})
        }

       const newFavorite = await db
       .insert(favoriteTable)
       .values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings
        }).returning()

       res.status(201).json(newFavorite[0])

    } catch (error) {
        console.log("Error adding favorite", error)
        res.status(500).json({error:"Something went wrong"})
    }
})

// this is the delete function
app.delete("/api/favorites/:userId/:recipeId", async (req , res)=>{

      try {

        // we need to check for the userId and recipeId
        const { userId , recipeId} = req.params


         await db.delete(favoriteTable).
         where(
            and(eq(favoriteTable.userId, userId) , eq(favoriteTable.recipeId, parseInt( recipeId))   )
         )
        
          res.status(201).json({success: "Deleted successfully "})
      } catch (error) {
         console.log("Error adding favorite", error)
        res.status(500).json({error:"Something went wrong"})
      }
    
})

// this is the functio to get your favorites 
app.get("/api/favorites/:userId", async (req, res )=>{

   try {    

    const { userId } = req.params

   const userFavorites = await db.select()
   .from(favoriteTable)
   .where(eq(favoriteTable.userId, userId))

   res.status(200).json(userFavorites)

    
   } catch (error) {
      console.log("Error adding favorite", error)
        res.status(500).json({error:"Something went wrong"})
   }


})

app.listen(PORT , ()=>{
    console.log("Server is running123 on port", PORT);
})





// http://localhost:5001/api/favorites

// {
//  "userId": "123",
//   "recipeId": "456",
//   "title": "Spicy Chicken Alfredo",
//   "image": "exampleimage.com",
//   "cookTime": "45 minutes",
//   "servings": "4 servings"
// }