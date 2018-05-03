
export default (data, response) => {
 
  const mongo = require("mongodb").MongoClient
  const mongoURL = process.env.MONGO_URL




  function validateString(string){
    let validatedString = string;
    validatedString = validatedString.replace(/%20/g , " ");
    validatedString = validatedString.replace(/%3f/g, "?")
    return validatedString
  }



  const queryArray = data.poll.split('/');
  const pollAuthor = validateString(queryArray[queryArray.length - 2]);
  const pollName = validateString(queryArray[queryArray.length - 1]);
  const username = data.username

  mongo.connect(mongoURL, function(err, database) { 

    

      function close(){
          database.close();
          return;
      }

      if (err) throw err;
      const db = database.db("voting-app");  // get database
      const collection = db.collection("Users"); // get collection

      const x = collection.findOne({"username":pollAuthor}, (err, data) => { 
   
          if (data) {

            if (pollExists(data, pollName)) {

              let voted = false

              const pollIndex = getPollIndex(data, pollName);

              if (alreadyVoted(data.polls[pollIndex].voters, username)) {      
                voted = true;
          
              } 

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

