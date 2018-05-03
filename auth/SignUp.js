import { verifyPasswordIntegrity, verifyFieldsFilled } from './verification';
import { createHash } from './hash'

export default (credentials, res) => {


if (!verifyPasswordIntegrity(credentials) || !verifyFieldsFilled(credentials)) {
  res.status(400).json({errors: { global: "Something went wrong!"}})
  return;
}

const mongo = require("mongodb").MongoClient

const mongoURL = process.env.MONGO_URL

  mongo.connect(mongoURL, function(err, database) {
      if (err) throw err;
      const db = database.db("voting-app");  // get database
      const collection = db.collection("Users"); // get collection
      

      createHash(credentials.password).then(hashedPassword => {

        const x = collection.findOne({$or: [{email: credentials.email}, {username: credentials.username}]}, (err, data) => { // search to find if exists
          if (err) throw err;
          
          if (!data) {             
          collection.insert({email: credentials.email, username:credentials.username, passwordHash: hashedPassword, polls:[]}, () => {
            database.close();
          })
          res.send("sign up successful");


          } else {
            let errors = {};


            if (credentials.email === data.email) {
              errors.email = "This email is already in use";
            } 
            if (credentials.username === data.username){
              errors.username = "This username is already in use";
            } 
            if (errors.length === 0) {
              errors.global = "Something went wrong"
            }
          

            res.status(400).json({errors: errors})    
          }


      })
    }); 
  });   
}