
import { verifyJWT } from '../auth/jwt'

export default (userdata, response) => {

  // Authenticate the supplied JSON web token, if valid, call the .then, if invalid, call the .catch.
  verifyJWT(userdata.token).then((username) => {
    

    const mongo = require("mongodb").MongoClient
    const mongoURL = process.env.MONGO_URL
    const { options, title } = userdata

    let readyOptions = [];
    let tempArrayToCheckIfOptionExists = [];




    // Validate options - this forEach adds valid options to the 'readyOptions' array. Valid options are options that aren't already in the array, and arent empty (i.e "").
    options.forEach((option) => { 
      if (option !== "" && !tempArrayToCheckIfOptionExists.includes(option)){
        tempArrayToCheckIfOptionExists.push(option)
        readyOptions.push({option:option, score: 0})
      } 
    });




    // After validating the options, if there are fewer than two valid options, return an error to the client and exit the fuction.
    if (readyOptions.length < 2 ) {
      response.status(400).json({status:"error", message:"You need atleast 2 different options.", code:"options"});
      return;
    }  



    // If everything is okay, connect to the database.
    mongo.connect(mongoURL, function(err, database) { 
        if (err) throw err;
        const db = database.db("voting-app");       // get database
        const collection = db.collection("Users");  // get collection


        const x = collection.findOne({"username": username}, (err, data) => {  



          // declare function 'close' to close the database and exit the function. This is to avoid repeating code (DRY).
          function close(){  
              database.close();
              return;
          }
         


            // Ensure the account exists, this is another form of server side validation. If there is no data, the account doesn't exist, so return an error. 
            if (data) {



              // Check that the user doesn't already have a poll with the provided title, if they do, return an error informing the client of such.
              if (pollExists(data, title)) {
                response.status(400).json({status:"error", message:"You already have a poll with this title.", code:"title"});
                close()
               
              } else {


                // Create a poll object populated with the relevent data, ready to be inserted into the database.
                let newPoll = {
                  title:title,
                  options:readyOptions,
                  voters:[]
                }


                // Push the poll object into the user's 'poll' array in their mongoDB document, and after that is complete, return a success message to client.
                collection.updateOne({"_id" :data._id},{$push: {polls:newPoll}}).then(() => {
                  close()
                  response.json({status:"success", message:"Your poll has been successfully created!"});
                });  
               
              }
              
            } else {

              response.status(400).json({status:"error", message:"You are not authorised to do this."});
            }
            
                                      
        })
      });
    }).catch((err) => response.status(400).json({status:"error", message:"You are not authorised to do this."}));
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