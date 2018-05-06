import { compareHash } from './hash'

import { generateJWT } from './jwt'

export default (credentials, response) => {

  const mongo = require("mongodb").MongoClient

  const mongoURL = process.env.MONGO_URL



  mongo.connect(mongoURL, function(err, database) {
      if (err) throw err;
      const db = database.db("voting-app");      // get database
      const collection = db.collection("Users"); // get collection

      const x = collection.findOne({"username": credentials.username}, (err, data) => { 
          database.close();
          if (data ) {  
            compareHash(credentials.password, data.passwordHash).then((res) => {                                      // Use the compareHash function to check if the passwords match.
              if (res) {                                                                                           
                response.json({user: {username: credentials.username, token:generateJWT(credentials.username)}})      // If they do match, send the client a response with their username and json web token.
              } else {
                response.status(400).json({errors: { global: "Invalid Credentials"}})                                 // If they don't match, return 'invalid credentials' to client.
              }
            })
          } else { 
             response.status(400).json({errors: { global: "Invalid Credentials"}})                             // If no accounts found with specified username, return 'invalid credentials'.
          }
        });    
    });   
  }
