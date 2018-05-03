import { verifyJWT } from '../auth/jwt'

export default (data, response) => {

  verifyJWT(data.token).then((username) => {

    const mongo = require("mongodb").MongoClient
    const mongoURL = process.env.MONGO_URL


    mongo.connect(mongoURL, function(err, database) { 

        function close(){
            database.close();
            return;
        }


        if (err) throw err;
        const db = database.db("voting-app");  // get database
        const collection = db.collection("Users"); // get collection

        const x = collection.findOne({"username": username}, (err, data) => { 
        
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


