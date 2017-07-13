"use strict";

(function(){
	var inquirer = require("inquirer");
	var answer = "";



	var output = "";

var questions = [
  {
     type: "list",
      message: "Hello!! What would you like to do today : ",
      choices : ["View Product Sales by Department", "Create New Department"],
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