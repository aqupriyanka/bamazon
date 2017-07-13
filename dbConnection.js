"use strict";

(function(){
    var mysql = require( "mysql" );

var connection = mysql.createConnection( {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon" } );



function connectDB(){
    connection.connect( function( error ){
        if( error )
            throw error;

});
}

function getItems(callback)
{
    connection.query( "select * from products", function(error, results)
    {
        if( error )
            throw error;


        return callback(results);

    } );
}

function getItem( itemName )
{
    var query = "SELECT * FROM item WHERE item_name = " + itemName ;

    connection.query( query, function(error, results)
    {
        if( error )
            throw error;

        var items = new Array();

        for( var i = 0 ; i < results.length; i++)
        {
                items.push( results[i].item_name );
        }

        return results;

    } );
}

function checkQuantity(itemId,callback){
  var query = "select product_name, stock_quantity from products where item_id = ?";
  connection.query( query,[itemId], function(error, results)
    {
        if( error )
            throw error;

        return callback(results[0].stock_quantity,results[0].product_name);

    } );
}

function checkLowQuantity(callback){
  var query = "select * from products where stock_quantity < 5";
  connection.query( query, function(error, results)
    {
        if( error )
            throw error;

        return callback(results);

    } );
}



function updateStockQuantity( itemId, purchasedQuantity )
{
    var query = "UPDATE products set stock_quantity = stock_quantity - ? WHERE item_id = ?" ;

    connection.query( query,[purchasedQuantity, itemId], function(error, results)
    {
        if( error )
            throw error;

    } );
}

function addProduct(productId,productName,departmentName,quantity,price){
  var query = "INSERT INTO products SET ?" ;
  var product = {
                 item_id: productId,
                 product_name: productName,
                 department_name: departmentName,
                 price : price,
                 stock_quantity : quantity
             };

    connection.query( query,product, function(error, results)
    {
        if( error )
            throw error;
          console.log(results.affectedRows + " product inserted!\n");

    } );
}

function addDepartment(deptId,deptName,overheadCost){
  var query = "INSERT INTO departments SET ?" ;
  var product = {
                 department_id: deptId,
                 department_name: deptName,
                 over_head_costs: overheadCost
             };

    connection.query( query,product, function(error, results)
    {
        if( error )
            throw error;
          console.log(results.affectedRows + " Department Created!\n");

    } );
}

function updateInventory( itemId, addedQuantity, productName )
{
    var query = "UPDATE products set stock_quantity = stock_quantity + ? WHERE product_name = ?" ;

    connection.query( query,[addedQuantity,productName.trim()  ], function(error, results)
    {

        if( error )
            throw error;

          // console.log(results.affectedRows + " record(s) updated");
        // console.log("UPDATED PRD ID : " + itemId + " Added quantity : " +  addedQuantity);

    } );
}

function updateProductSales( itemId, productSales )
{
    var query = "UPDATE products set product_sales = product_sales + ? WHERE item_id = ?" ;

    connection.query( query,[productSales, itemId], function(error, results)
    {
        if( error )
            throw error;

    } );
}

function getProductSales( callback)
{
    var query = "select d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) as product_sales, "+
    "(d.over_head_costs - sum(p.product_sales)) as total_profit from bamazon.departments d " +  
    "join bamazon.products p on p.department_name = d.department_name "+
    "group by p.department_name" ;

    connection.query( query, function(error, results)
    {
        if( error )
            throw error;

          callback(results);

    } );
}


function getItemPrice( itemId, callback )
{
    var query = "SELECT price FROM products WHERE item_id = ?" ;

    connection.query( query,[itemId], function(error, results)
    {
        if( error )
            throw error;
        return callback(results[0].price);
        // var itemPrice;

        // for( var i = 0 ; i < results.length; i++)
        // {
        //         return results[i].item_price;
        // }

        // return -1.0;

    } );
}

function insertCrud(){

      var inputs = [];
      console.log("what is your product? (name, price, description)");
      var stdin = process.openStdin();
      stdin.addListener("data", function(input){
                      var userInput = input ? input.toString().trim() : "";
                      if(userInput){
                          inputs = userInput.split(",");
                      };

           console.log("input ==== ",input[0],input[1],input[2]);
        console.log("Inserting your new product...\n");
            connection.query(
             "INSERT INTO items SET ?",
             {
               itemName: inputs[0],
               itemPrice: parseFloat(inputs[1]),
               itemDetail: inputs[2]
             },
             function(err, res) {
               console.log(res.affectedRows + " product inserted!\n");
               
               // Call updateCrud AFTER the INSERT completes
               // updateCrud();
             });

      });
   
     
   
   
     
}


function closeConnection(){
    connection.end();
}

module.exports= {
        "connectDB" : connectDB,
        "getListOfItems" : getItems,
        "getItemPrice" : getItemPrice,
        "updateStockQuantity" : updateStockQuantity,
        "updateInventory" : updateInventory,
        "closeDBConnection" : closeConnection,
        "getLowInventory" : checkLowQuantity,
        "checkQuantity" : checkQuantity,
        "addProduct" : addProduct,
        "updateProductSales" : updateProductSales,
        "getProductSales" : getProductSales,
        "addDepartment" : addDepartment
    }
})();


