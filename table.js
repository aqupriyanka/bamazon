"use strict";

(function(){



var chalk = require("chalk");
var header = [
    {
        value : "PRODUCT ID",
        headerColor : "cyan",
        color: "yellow",
        width : 30
    },
    {
        value : "PRODUCT NAME",
        color : "red", 
        // formatter : function(value){
        //     var str = "$" + value.toFixed(2);
        //     if(value > 5){
        //         str = chalk.underline.green(str);
        //     }
        //     return str;
        // }
    },
    {
        value : "PRICE",
        formatter : function(value){
            var str = "$" + value;
            // value.toFixed(2);
            // if(value > 5){
            //     str = chalk.underline.green(str);
            // }
            return str;
        }
    }
];
 

 
 var Table = require("tec-table");

     function createTable(headerAdder, rows, newHeader){
        if(newHeader){
            header = newHeader;
        }
        if(headerAdder){
            header.push(headerAdder);
        }
        var t1 = Table(header,rows,{
            borderStyle : 1,
            paddingBottom : 0,
            headerAlignment : "center",
            alignment : "center",
            color : "white"
        });
         
        var str1 = t1.render();
         
        console.log(str1);
}

function createHeader(headr){
    this.header = headr;
}

module.exports = {
    "createTable" : createTable,
    // "header" : header
    "createHeader" : createHeader
};

})();