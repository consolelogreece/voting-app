import { verifyJWT } from '../auth/jwt'

export default (userdata, response) => {
  
  verifyJWT(userdata.token).then((username) => {

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