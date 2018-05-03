
import { verifyJWT } from '../auth/jwt'

export default (userdata, response) => {

  verifyJWT(userdata.token).then((username) => {
    

    const mongo = require("mongodb").MongoClient
    const mongoURL = process.env.MONGO_URL
    const { options, title } = userdata

    let readyOptions = [];
    let tempArrayToCheckIfOptionExists = [];

    options.forEach((option) => {
      if (option !== "" && !tempArrayToCheckIfOptionExists.includes(option)){
        tempArrayToCheckIfOptionExists.push(option)
        readyOptions.push({option:option, score: 0})
      } 
    });


    if (readyOptions.length < 2 ) {
      response.status(400).json({status:"error", message:"You need atleast 2 different options.", code:"options"});
      return;
    }  


    mongo.connect(mongoURL, function(err, database) { 
        if (err) throw err;
        const db = database.db("voting-app");  // get database
        const collection = db.collection("Users"); // get collection

        const x = collection.findOne({"username": username}, (err, data) => { 


          function close(){
              database.close();
              return;
          }
         
            if (data) {
              if (pollExists(data, title)) {

                close()
                response.status(400).json({status:"error", message:"You already have a poll with this title.", code:"title"});
               
              } else {

                let newPoll = {
                  title:title,
                  options:readyOptions,
                  voters:[]
                }

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