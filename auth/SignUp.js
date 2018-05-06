import { verifyPasswordIntegrity, verifyFieldsFilled } from './verification';
import { createHash } from './hash'

export default (credentials, res) => {



// Despite client side verification, it's important to include server side verification. 
// This ensures that all submitted fields contain information. This verification is crude, and should be expanded upon (e.g. ensuring valid email).
if (!verifyPasswordIntegrity(credentials) || !verifyFieldsFilled(credentials)) {                          
  res.status(400).json({errors: { global: "Something went wrong!"}})
  return;
}


const mongo = require("mongodb").MongoClient

const mongoURL = process.env.MONGO_URL

  mongo.connect(mongoURL, function(err, database) {
      if (err) throw err;
      const db = database.db("voting-app");           // get database
      const collection = db.collection("Users");      // get collection

      
      // Hashing the password for secure storage (note, bcrypt hashes AND salts automatically).
      createHash(credentials.password).then(hashedPassword => {  


      
        // Check if Email or username is already in use, if data is returned, it means the email or username is in use.
        const x = collection.findOne({$or: [{email: credentials.email}, {username: credentials.username}]}, (err, data) => {    
          if (err) throw err;



          // If neither are in use, inserts the new account information into the database.          
          if (!data) {                                                                                              
          collection.insert({email: credentials.email, username:credentials.username, passwordHash: hashedPassword, polls:[]}, () => {   
            database.close();
          })
          res.send("sign up successful");



          } else {        
            // If either is in use, create errors object and add appropriate error messages, then return the error messages to client. 
            //Note: The crude system below is faulty, as if client attempts to sign up with a username and email which are both in use, but by different accounts, it will only display the email is in use error. 

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