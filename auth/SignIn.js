  //BCRYPT ALREADY INSTALLED. WHEN COMPARING, LOAD SALT FROM DB AND USE BCRYPT METHOD TO CHECK IF PASSWORD MATCHES.
  //ALSO, HASH AND SALT WHEN SIGNING UP

import { compareHash } from './hash'

import { generateJWT } from './jwt'

export default (credentials, response) => {

  const mongo = require("mongodb").MongoClient

  const mongoURL = process.env.MONGO_URL



  mongo.connect(mongoURL, function(err, database) {
      if (err) throw err;
      const db = database.db("voting-app");  // get database
      const collection = db.collection("Users"); // get collection

      const x = collection.findOne({"username": credentials.username}, (err, data) => { 
          database.close();
          if (data ) {  
            compareHash(credentials.password, data.passwordHash).then((res) => {
              if (res) {
                response.json({user: {username: credentials.username, token:generateJWT(credentials.username)}}) 
              } else {
                response.status(400).json({errors: { global: "Invalid Credentials"}}) 
              }
            })
          } else { 
             response.status(400).json({errors: { global: "Invalid Credentials"}}) 
          }
        });    
    });   
  }
