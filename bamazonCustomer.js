"use strict";

(function(){

	var db = require("./dbConnection");
	var inquirer = require("./main_inquirer");
	var table = require("./table");
	var colors = require("colors/safe");

	db.connectDB();

	var products = [];
	var productId,quantity;
	var option = "";

	const CFonts = require('cfonts');
 
	CFonts.say('WELCOME TO BAMAZON', {
	    font: 'block',        //define the font face 
	    size : 5,
	    align: 'center',        //define text alignment 
	    colors: ['magenta','gray'],    //define all colors 
	    background: 'black',  //define the background color 
	    letterSpacing: 1,     //define letter spacing 
	    lineHeight: 0,        //define the line height 
	    space: true,          //define if the output text should have empty lines on top and on the bottom 
	    maxLength: '20'        //define how many character can be on one line 
	});



	inquirer.ask(function(mode){
		option = mode.trim();
		switch(option){
			case "Customer" : showProducts();break;
			case "Manager" : getManagerMenu();break;
			case "Supervisor" : getSupervisorMenu();break;
			default : console.log("Please select the valid option.");break;
		}
	});

	function getManagerMenu(){
		var managerInquirer = require("./manager_inquirer");
		managerInquirer.ask(function(managerOption){
			switch(managerOption.trim()){
				case "View Products for Sale" : showProductsToManager();break;
				case "View Low Inventory" : getLowInventory(); break;
				case "Add to Inventory" : addInventory();break;
				case "Add New Product" : addNewProduct();break;
			}
		});
	}

	function getSupervisorMenu(){
		var managerInquirer = require("./supervisor_inquirer");
		managerInquirer.ask(function(managerOption){
			switch(managerOption.trim()){
				case "View Product Sales by Department" : getProductSales();break;
				case "Create New Department" : createNewDept(); break;
			}
		});
	}

	function getProductSales(){
		var header = [
			    {
			        value : "DEPARTMENT ID",
			        headerColor : "cyan",
			        color: "yellow",
			        width : 30
			    },
			    {
			        value : "DEPARTMENT NAME",
			        color : "red", 
			        
			    },
			    {
			        value : "OVERHEAD COSTS",
			        formatter : function(value){
			            var str = "$" + value;
			            return str;
			        }
			    },
			    {
			        value : "PRODUCT SALES",
			        formatter : function(value){
			            var str = "$" + value;
			            return str;
			        }
			    },
			    {
			        value : "TOTAL PROFIT",
			        formatter : function(value){
			            var str = "$" + value;
			            return str;
			        }
			    }
			];
		var prdSalesRows = [];
		db.getProductSales(function(data){
			for(var i=0; i<data.length; i++){
				var row = [];
				row.push(data[i].department_id);
				row.push(data[i].department_name);
				row.push(data[i].over_head_costs);
				row.push(data[i].product_sales);
				row.push(data[i].total_profit);

				prdSalesRows.push(row);
			}
			table.createTable(null, prdSalesRows, header);
		});

		db.closeDBConnection();
		// process.exit(0);
	}

	function createNewDept(){

		var prompt = require('prompt');
 		prompt.message = "";
 		prompt.delimiter = colors.green(" :                  ");


 		var schema = {
			    properties: {
			      Department_Id: {
			        description: colors.yellow('\t\tDepartment Id  ')
			      },
			      Department_Name: {
			        description: colors.yellow('\t\tDepartment Name')
			      },
			      Overhead_Cost: {
			      	description: colors.yellow('\t\tOver head Cost ')
			      }
			    }
			  };

		  // Start the prompt 
		  prompt.start();
		  // Get two properties from the user: username and email 
		  console.log("\n");
		  prompt.get(schema, function (err, result) {
		    db.addDepartment(result.Department_Id,result.Department_Name,result.Overhead_Cost);
		    db.closeDBConnection();
		  });
		  // db.closeDBConnection();
	}

	


	function addNewProduct(){
		
		var prompt = require('prompt');
 		prompt.message = "";
 		prompt.delimiter = colors.green(" :                  ");

		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		console.log(colors.grey(colors.cyan("\n\t\t\tADD PRODUCT")));
		console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

 		var schema = {
			    properties: {
			      Product_Id: {
			        description: colors.yellow('\t\tPRODUCT ID      :')
			      },
			      Product_Name: {
			        description: colors.yellow('\t\tPRODUCT NAME    :')
			      },
			      Department_Name: {
			        description: colors.yellow('\t\tDEPARTMENT NAME :')
			      },
			      Quantity: {
			      	description: colors.yellow('\t\tQUANTITY        :')
			      },
			      Price: {
			      	description: colors.yellow('\t\tPRICE($)        :')
			      }
			    }
			  };

		  // Start the prompt 
		  prompt.start();
		  // Get two properties from the user: username and email 
		  console.log("\n");
		  prompt.get(schema, function (err, result) {
		    db.addProduct(parseInt(result.Product_Id),result.Product_Name,result.Department_Name,parseInt(result.Quantity),parseFloat(result.Price));
		  	db.closeDBConnection();
		 	
		  });
		  // db.closeDBConnection();
	}


	function getLowInventory(){
		var rows = [];
		db.getLowInventory(function(results){
			for(var i=0; i<results.length; i++){
				var row = [];
				row.push(results[i].item_id);
				row.push(results[i].product_name);
				row.push(results[i].price);
				row.push(results[i].stock_quantity);
				rows.push(row);

			}
			var headerAdder = {value : "QUANTITY"};
			table.createTable(headerAdder, rows);
		});
		db.closeDBConnection();
	}


	function addInventory(){
		
		var productNames = [];
		db.getListOfItems(function(data){
			for(var i=0; i<data.length; i++){
				productNames.push(colors.grey(data[i].item_id) + "-- " + data[i].product_name);
			}
			showProductName(productNames);
		});

	}

	function showProductName(productNames){
		var updateproduct;
		var inventory = require("./Inventory_inquirer");
		
		inventory.ask(productNames, function(selectedProduct){
			updateproduct = selectedProduct;
			console.log(colors.grey(colors.cyan("No of items Added for "+selectedProduct + " ::")));
			
			getUserResponse().then(function(success){
				if(parseInt(success)){
					updateInventory(updateproduct, parseInt(success));
					console.log("Do you want to continue or Exit");
					
					getUserResponse().then(function(success){
						if(success.indexOf("e") == 0 || success.indexOf("E") == 0){
							process.exit(0);
						} else{
							showProductName(productNames);
						}
					});
				}else{
					console.log(colors.red("PLEASE ENTER A VALID NUMBER"));
					showProductName(productNames);
				}
			}, function(err){});
		});
	}
	
	function updateInventory(productName, updatedQuantity){

		var productId = productName.split("--")[0].replace(" ","").trim();
		var productName = productName.split("--")[1];

		console.log(colors.green("Adding Stock Quantity " + updatedQuantity + " for " + productId + " " + productName));
		db.updateInventory(productId, updatedQuantity,productName);
	}


	function showProductsToManager(){
		var rows = [];
		db.getListOfItems(function(data){
			
			for(var i=0; i<data.length; i++){
				var row = [];
				row.push(data[i].item_id);
				row.push(data[i].product_name);
				if(data[i].price != null)
					row.push(data[i].price);
				else
					row.push(0);
				row.push(data[i].stock_quantity);
				rows.push(row);

			}
			var headerAdder = {value : "QUANTITY"};
			table.createTable(headerAdder, rows,null);
		});
		db.closeDBConnection();
	}

	
	function showProducts(){
		var rows = [];
		db.getListOfItems(function(data){
			
			for(var i=0; i<data.length; i++){
				var row = [];
				row.push(data[i].item_id);
				row.push(data[i].product_name);
				row.push(data[i].price);
				rows.push(row);

			}
			table.createTable(null,rows,null);
			buyProduct();
		});
	}

	


// 	function buyProduct(){
// 		console.log("Please enter the id of product you would like to buy : ");
// 		getUserResponse().then(function(success){
// 			productId = success;
// 			console.log("Please enter the units of product you would like to buy : ");
// 			getUserResponse().then(function(success){
// 				quantity = success;
// 				db.checkQuantity(productId, function(dbQuantity){
// 					if(dbQuantity >= quantity){
// 					console.log("Success");
// 					db.updateStockQuantity(productId,quantity);
// 					db.getItemPrice(productId, function(price){
// 						console.log("\n TOTAL PRICE  :: ",parseFloat(price) * parseFloat(quantity));
// 						db.updateProductSales(productId, parseFloat(price) * parseFloat(quantity));
// 						db.closeDBConnection();
// 						process.exit(0);
// 					})
// 					//UPDATE DB with SUBTRACTION OF RECORDS
// 				}else{
// 					console.log("Insufficient quantity!");
// 				}
// 				});
				
// 			});
// 		},function(err){});
// }

	function buyProduct(){
		var prompt = require('prompt');
 		prompt.message = "";
 		prompt.delimiter = colors.green(" :                  ");


 		var schema = {
			    properties: {
			      productId: {
			        description: colors.yellow('\t\tProduct Id  ')
			      },
			      quantity: {
			        description: colors.yellow('\t\tQuantity    ')
			      },
			    }
			  };

		  prompt.start();
		  console.log("\n");
		  console.log(colors.cyan("\tPlease enter the following information TO PURCHASE A PRODUCT:"));

		    
		  prompt.get(schema, function (err, result) {

		    db.checkQuantity(result.productId, function(dbQuantity,productName){
				if(dbQuantity >= result.quantity){
					db.updateStockQuantity(result.productId,result.quantity);
					db.getItemPrice(result.productId, function(price){
						db.updateProductSales(result.productId, parseFloat(price) * parseFloat(result.quantity));
						db.closeDBConnection();
						console.log("\n\n\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
						console.log(colors.underline.green("\t\tORDER PLACED "));
						console.log("\t~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");

						console.log(colors.magenta("\n\tOrder Summary : "));
						console.log(colors.gray("\tYou have purchased " + result.quantity + " " + productName));
						console.log(colors.bold.gray("\tTotal Price  :: $"),parseFloat(price) * parseFloat(result.quantity));
						console.log("")
						process.exit(0);
					})
					//UPDATE DB with SUBTRACTION OF RECORDS
				}else{
					console.log(colors.red("\n\t\tINSUFFICIENT QUANTITY!"));
					console.log("Do you want to continue shopping(y/n)");
					getUserResponse().then(function(resp){
						if(resp.indexOf("y") == 0 || resp.indexOf("Y") == 0){
							showProducts();
						} else{
							process.exit(0);
						}
					});
				}
				});
		  });
	}

	
	

	function getUserResponse(){
		var stdin = process.openStdin();
		return new Promise(function(resolve,reject){
			stdin.addListener("data", function(input){
			 	var userInput = input ? input.toString().trim() : "";
			 	if(userInput)
			 		resolve(userInput);
			 	else
			 		reject("Failure");
			 });
		});
}

	

})();