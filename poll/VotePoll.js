import { verifyJWT } from '../auth/jwt'
import { convertUrl } from '../validation/ValidateString';

export default (data, response) => {

  const mongo = require("mongodb").MongoClient
  const mongoURL = process.env.MONGO_URL


  // Take the relevent information and assign them to the relevent variables.
  const queryArray = data.poll.split('/');
  const pollAuthor = convertUrl(queryArray[queryArray.length - 2]);
  const pollName = convertUrl(queryArray[queryArray.length - 1]);
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
          

        // If there is data, and the poll exists, continue, otherwise return error to client.
        if (pollExists(data, pollName) && data) {


         // Assign relevent data for referencing the poll in the database to the pollData variable.
          const pollData = retrieveData(data, pollName, vote); 


          // Using data from pollData, create a string for referencing score of an option in the database.
          let scoreDirString = "polls." + pollData[1] + ".options." + pollData[2] + ".score"  
          

            //If the voter is an authenticated user, we'll add their username to the poll, otherwise, they'll vote anonymously.
        		verifyJWT(token).then((username) => {

              // If the voter has already voted, return an error to client.
        		  if (alreadyVoted(data.polls[pollData[1]].voters, username)) {      
        		    response.json({status:"error",  message:"You've already voted on this poll."});
        		    close();


        			} else { 

                // Assign voters information to an object, ready to insert into the database.
                const voteData = {"voter":username, "vote":vote} 


                // If the option exists, insert the voters information into the relevent vote array, and increment the score by 1.
                if (optionExists(pollData[0], vote)){
             
                  collection.update({"username":pollAuthor, "polls.title":pollName, "polls.options.option":vote},{$push: {"polls.$.voters":voteData}, $inc:{[scoreDirString]:1}}, (err, data) => {
                    if(err) {
                      response.json({status:"error", message:"Something went wrong..."});
                    } else {
                      response.json({status:"success", message:"Vote successfull"});
                    }
                    close();
                   });


                // If the option the user is trying to vote for doesn't exist, then add create the option. This can only be done by authenticated users, preventing abuse of this feature.
                // This is how the 'add option' form works, they just try to vote for an option that doesn't yet exist, and it's created here.
                } else {
                  
                  // Server side valitaion. Stop's users from entering blank choices when creating options.
                  if (vote === "") {
                   response.status(400).json({status:"error", message:"Your vote can't be blank!", code:"optionTooShort"});
                    close();
                  } else {

                    
                  // Assign string for referencing the options of the relevent poll to a variable.
                  let optionsDirString = "polls." + pollData[1] + ".options"

                  // Assigns new vote to an object, ready to insert into the database.
                  const newOption = {"option":vote, "score":1}
                  

                  // Update all relevent parts of the poll in the database, and then returns the relevent response to the client.
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


            // If the user is not authenticated, incremenet the score but dont add any vote data to the polls 'voters' array.
				    }).catch((err) => {

              

              // If option exists, continue, otherwise, return error message to client.
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
               response.status(400).json({status:"error", message:"Option doesn't exist..."});
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




// Function to check if the user has already voted on the poll.
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


// Function to check if poll exists.
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


// Function to check if specified option within the a poll exists.
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


// Gets relevent information, and positional information. (i.e. the data of the poll, the index of the poll in the 'polls' array, and the index of the option within that poll's 'options' array.)
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