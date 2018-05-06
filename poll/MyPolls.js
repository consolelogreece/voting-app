import { verifyJWT } from '../auth/jwt'

export default (data, response) => {


  // Authenticate the supplied JSON web token, if valid, call .then, if invalid, call .catch.
  verifyJWT(data.token).then((username) => {


    const mongo = require("mongodb").MongoClient
    const mongoURL = process.env.MONGO_URL


    mongo.connect(mongoURL, function(err, database) { 


        // Declare function 'close' to close the database and exit the function. This is to avoid repeating code (DRY).
        function close(){
            database.close();
            return;
        }


        if (err) throw err;
        const db = database.db("voting-app");  // get database
        const collection = db.collection("Users"); // get collection


        // Check database to find data associated with username supplied by the json web token.
        const x = collection.findOne({"username": username}, (err, data) => { 
        

            // If data exists, return it, otherwise, return error to client.
            if (data) {
              close();
              response.json(data.polls)
            } else {
              close();
              response.status(400).json({status:"error", message:"You are not authorised to do this."});
            }         
          
        })
      });
    }).catch(() => response.status(400).json({status:"error", message:"You are not authorised to do this."}));
  }


