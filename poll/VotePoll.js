import { verifyJWT } from '../auth/jwt'

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
  const vote = data.vote;
  const token = data.token;
  
  mongo.connect(mongoURL, function(err, database) { 

      function close(){
          database.close();
          return;
      }

      if (err) throw err;
      const db = database.db("voting-app");  // get database
      const collection = db.collection("Users"); // get collection

      const x = collection.findOne({"username":pollAuthor}, (err, data) => { 
          
        if (pollExists(data, pollName) && data) {

          const pollData = retrieveData(data, pollName, vote);

          let scoreDirString = "polls." + pollData[1] + ".options." + pollData[2] + ".score"  
        

        		verifyJWT(token).then((username) => {

        		  if (alreadyVoted(data.polls[pollData[1]].voters, username)) {      
        		    response.json({status:"error",  message:"You've already voted on this poll."});
        		    close();


        			} else { 

                const voteData = {"voter":username, "vote":vote} 


                if (optionExists(pollData[0], vote)){
             
                  collection.update({"username":pollAuthor, "polls.title":pollName, "polls.options.option":vote},{$push: {"polls.$.voters":voteData}, $inc:{[scoreDirString]:1}}, (err, data) => {
                    if(err) {
                      response.json({status:"error", message:"Something went wrong..."});
                    } else {
                      response.json({status:"success", message:"Vote successfull"});
                    }
                    close();
                   });

                } else {
                  
                  if (vote === "") {
                   response.status(400).json({status:"error", message:"Your vote can't be blank!", code:"optionTooShort"});
                    close();
                  } else {

                    

                  let optionsDirString = "polls." + pollData[1] + ".options"

                  const newOption = {"option":vote, "score":1}
                  


          				collection.update({"username":pollAuthor, "polls.title":pollName}, {$push: {[optionsDirString]:newOption, "polls.$.voters": voteData}}, (err, data) => {
                  
                    if(err) {
                       response.status(400).json({status:"error", message:"Something went wrong..."});
                    } else {
                      response.json({status:"success", message:"Vote successfull"});
                    }
                    close();
                  });
                }
          			}
              }


				    }).catch((err) => {

              


              if (optionExists(pollData[0], vote)){
                collection.update({"username":pollAuthor, "polls.title":pollName, "polls.options.option":vote}, {$inc:{[scoreDirString]:1}}, (err, data) => {
                  if(err) {
                      response.status(400).json({status:"error", message:"Something went wrong..."});
                  } else {
                     response.json({status:"success", message:"Vote successfull"});
                  }                  
                  close();
                });


              } else {
               response.status(400).json({status:"error", message:"Poll doesn't exist..."});
               close();         
              }   

				    });
        	
  
        } else {
          response.status(400).json({status:"error", message:"Poll doesn't exist..."});
          close();
        }
    
        
      })
    });
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

let optionExists = (data, vote) => {
  let doesExist = false;

  data.options.forEach(option => {
  
    if (option.option === vote) {

      doesExist = true;
      return;
    }
  });
  
  return doesExist
}


let retrieveData = (data, title, vote) => {
  let pollFull;
  let positionPoll;
  let positionOption

  data.polls.forEach((poll, i) => {
    if (poll.title === title) {
      pollFull = poll
      positionPoll = i;
      return;
    }
  });

  pollFull.options.forEach((option, i) => {

    if (option.option === vote) {
      positionOption = i
      return
    }

  });

  return [pollFull, positionPoll, positionOption];

}