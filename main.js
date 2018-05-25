const inquirer = require('inquirer');
const mysql = require('mysql');
const choices = ["POST an item", "BID on an item"]

let items = [];
let tempId = null;
let tempBid = null;

console.log("change");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "greatBay"
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

const deleteItem = function(id){
    var query = connection.query(
        "DELETE FROM items WHERE ?",
        {
            id: id
        },
        function(err, res){
            console.log(res.affectedRows + " item deleted! \n");
        }
    )
}

const getItems = function() {
    items = [];
    connection.query("SELECT * FROM items", function(err, res) {
      if (err) throw err;
    //   console.log(res);
      for(i=0; i < res.length; i++){
          items.push(res[i]);
          console.log("ID: " + res[i].id + " | " + "Item: " + res[i].name + " | " + "Current Price: " + res[i].currentPrice)
      }

    });
};

const updateBid = function(id, amount) {
    var query = connection.query(
      "UPDATE items SET ? WHERE ?",
      [
        {
        currentPrice: amount
        },
        {
          id: id
        }
      ],
      function(err, res) {
        console.log(res.affectedRows + " bid updated!");
      }
    );
  
}

const askBid = function(){
    inquirer.prompt([
        {
          type: "input",
          name: "id",
          message: "What is the ID of the item you want to bid on?",
        },
        {
          type: "input",
          name: "bidAmount",
          message: "What is your bid?",
        }
    
      ]).then(function(response) {
        let bidID = response.id;
        let bidAmount = response.bidAmount;
        if(bidAmount > items[bidID-1].currentPrice){
          updateBid(response.id, response.bidAmount);
        }
        else{
          console.log("Bid higher!");
        }
        end();
      });
}

const end = function(){
    connection.end();
}


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
        askBid();
    }
  });