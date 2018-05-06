import { convertUrl } from '../validation/ValidateString';

export default (data, response) => {
 
  const mongo = require("mongodb").MongoClient
  const mongoURL = process.env.MONGO_URL


  // Take the relevent information and assign them to the relevent variables.
  const queryArray = data.poll.split('/');
  const pollAuthor = convertUrl(queryArray[queryArray.length - 2]);
  const pollName = convertUrl(queryArray[queryArray.length - 1]);
  const username = data.username

  mongo.connect(mongoURL, function(err, database) { 


      // Declare function 'close' to close the database and exit the function. This is to avoid repeating code (DRY).
      function close(){
          database.close();
          return;
      }



      if (err) throw err;
      const db = database.db("voting-app");  // get database
      const collection = db.collection("Users"); // get collection

      const x = collection.findOne({"username":pollAuthor}, (err, data) => { 
   
          if (data) { // If no data is found, return error, otherwise continue.

            if (pollExists(data, pollName)) { // If poll doesn't exist, return error, otherwise continue.

              let voted = false


              // Retrieve the index of the poll in the users poll array, this is so we can reference it. 
              const pollIndex = getPollIndex(data, pollName); 


              // Check if the user has already voted, if they have, set voted to true. This is important so the client can immediately display the results, instead of displaying the vote options again.
              if (alreadyVoted(data.polls[pollIndex].voters, username)) {       
                voted = true;
              } 


              // Send data to client.
              response.json({title:pollName , options:retrieveData(data, pollName), voted:voted})
              close();
                   
            } else {

              response.status(400).json({status:"error", message:"Poll doesn't exist...", code:"noExist"});
            }

            close();
          } else {
            close();
            response.status(400).json({status:"error", message:"Poll doesn't exist...", code:"noExist"});
          }         
        
      })
    });
  }



















    let retrieveData = (data, title) => {
        let pollData = "Something went wrong when retreiving options";

        data.polls.forEach(poll => {
          if (poll.title === title) {
            pollData = poll;
            return;
          }
        });

        return pollData;



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


 let getPollIndex = (data, title) => {

  let pollIndex;
 

  data.polls.forEach((poll, i) => {
    if (poll.title === title) {
      pollIndex = i;
      return;
    }
  });
  return pollIndex;

}



  let alreadyVoted = (data, username) => {
  let voted = false;
  data.forEach(vote => {
    if (vote.voter === username) {
      voted = true;
      return
    }
  });

  return voted
}

