import { verifyJWT } from '../auth/jwt'

export default (userdata, response) => {


  // Authenticate the supplied JSON web token, if valid, call .then, if invalid, call .catch.
  verifyJWT(userdata.token).then((username) => {

    const mongo = require("mongodb").MongoClient
    const mongoURL = process.env.MONGO_URL

    // Connect to database.
    mongo.connect(mongoURL, function(err, database) { 


        // Declare function 'close' to close the database and exit the function. This is to avoid repeating code (DRY).
    	function close(){
            database.close();
            return;
        }


        if (err) throw err;
        const db = database.db("voting-app");  // get database
        const collection = db.collection("Users"); // get collection



        const x = collection.findOne({"username": username}, (err, data) => { 

            // Check if there is data, and if the poll exists. If all checks out, delete the poll using mongo's $pull operator.
            // Then, return success message to client.
            if (pollExists(data, userdata.title) && data) {
        		collection.update({"username": username}, { $pull: {"polls":{"title":userdata.title}}}).then(() => {
                    response.json({status:"success", message:"Your poll has been successfully deleted."})
                    close();
                });        
            } else {
                response.status(400).json({status:"error", message:"You can't delete a poll that doesn't exist."})
                close();
            }
          
        })
      });
    }).catch(() => response.status(400).json({status:"error", message:"You are not authorised to do this."}));
  }

  
 // this function checks whether a poll with a given title exists or not.
let pollExists = (data, title) => {
    let doesExist = false;
    data.polls.forEach(poll => {
      if (poll.title === title) {
        doesExist = true;
        return;
      }
    });
    return doesExist
}