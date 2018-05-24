const inquirer = require('inquirer');
const mysql = require('mysql');
const choices = ["POST an item", "BID on an item"]

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "greatBay"
  });


//main logic function
  inquirer.prompt([
    {
      type: "list",
      name: "userInput",
      message: "What would you like to do?",
      choices: [choices[0], choices[1]]
    }

  ]).then(function(response) {
    if(response.userInput == choices[0]){
        console.log("You want to POST an item!");
        connect();
        addItem("Tea Set", 30);
        end();
    }
    else if(response.userInput == choices[1]){
        console.log("You want to BID on an item!");
        connect();
        getItems();
        end();
    }
  });
  
let connect = function(){
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
  });
}

const addItem = function(name, startingPrice) {
    var query = connection.query(
      "INSERT INTO items SET ?",
      {
        name: name,
        currentPrice: startingPrice
      },
      function(err, res) {
        console.log(res.affectedRows + " item inserted!\n");
      }
    );
}

const getItems = function() {
    connection.query("SELECT * FROM items", function(err, res) {
      if (err) throw err;
    //   console.log(res);
      for(i=0; i < res.length; i++){
          console.log("ID: " + res[i].id + " | " + "Item: " + res[i].name + " | " + "Current Price: " + res[i].currentPrice)
      }

    });
};

const end = function(){
    connection.end();
}


