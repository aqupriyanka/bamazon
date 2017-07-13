"use strict";

(function(){
	var inquirer = require("inquirer");
	var answer = "";
  var colors = require("colors/safe");



	var output = "";

  function getProductList(productNames){
    var questions = [
      {
         type: "list",
          message: colors.magenta("Please select the product whose inventory you want to update : \n" + colors.yellow("  ID-- NAME")),
          choices : productNames,
          name: "mode"
        },
      
    ];

    return questions;
  }


function getMainOption(productNames,callback) {   

        inquirer.prompt(getProductList(productNames)).then(function (answers) {
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