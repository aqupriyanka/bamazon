"use strict";

(function(){
	var inquirer = require("inquirer");
	var answer = "";



	var output = "";

var questions = [
  {
     type: "list",
      message: "Hello!! Today you are going to LOGIN as : ",
      choices : ["Customer", "Manager", "Supervisor"],
      name: "mode"
    },
  // {
  //   type: "list",
  //     message: "Please select the option of FlashCards you would like to view :",
  //     name: "cardView",
  //     choices : ["User Created Basic Cards", "Default Basic Cards", "User Created Cloze Cards",
  //      "Default Cloze Cards"],
  //     when: function(ans){
  //     	if(ans.mode === "View Cards"){
  //     		return true;
  //     	}
  //     }
  // },
  // {
  //   type: "list",
  //     message: "Please select the option of FlashCards you would like to Add :",
  //     name: "addCard",
  //     choices : ["Add Basic Cards", "Add Cloze Cards"],
  //     when: function(ans){
  //     	if(ans.mode === "Add Cards"){
  //     		return true;
  //     	}
  //     }
  // }
];

function getMainOption(callback) {   

        inquirer.prompt(questions).then(function (answers) {
         if(answers.mode){
		  	answer = answers.mode;
		  	} 
            return callback(answer);
        });
 }

module.exports = {
 "ask" : getMainOption
};	
})();