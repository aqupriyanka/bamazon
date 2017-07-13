"use strict";

(function(){
	var inquirer = require("inquirer");
	var answer = "";



	var output = "";

var questions = [
  {
     type: "list",
      message: "Hello!! What would you like to do today : ",
      choices : ["View Products for Sale ", "View Low Inventory", "Add to Inventory","Add New Product"],
      name: "mode"
    },
 
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