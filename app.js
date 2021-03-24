// ============================================================================================
//  * Controller to run the application

var controller = (function (budgetCtrl, UICtrl) {
  // ADD EVENT LISTENER TO GET LISTEN AT THE TIME OF BUTTON CLICKED.

  var setUpEventListeners = function () {
    var DOM = UICtrl.getDOMString();

    // CLICK EVENT HANDLER

    document
      .querySelector(DOM.inputButton)
      .addEventListener("click", ctrlAddItem);

    // KEYPRESS EVENT HANDLER

    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    // CALCULATE THE BUDGET
    budgetCtrl.calculateBudget();

    // RETURN THE BUDGET

    var budget = budgetCtrl.getBudget();

    // DISPLAY THE BUDGET ON UI

    UICtrl.displayBudget(budget);
  };

  // CREATE THE FUNCTION TO UPDATE THE PERCENTAGE

  var updatePercentage = function () {
    // Calculate percentage

    budgetCtrl.calculatePercentage();

    // Read percentage from the budget controller
    var percentage = budgetCtrl.getPercentage();
    // update the UI with the new percentages
    UICtrl.displayPercentage(percentage);
  };

  // CREATE THE FUNCTION TO RUN MULTIPLE STEPS OF PROCESS.

  var ctrlAddItem = function () {
    var input, newItem;
    // 1 get the filed input data

    input = UICtrl.getInput(); // get Input function is being declared in UI CONTROLLER

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2 add the item to the budget ctrl

      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3 add the new item to the user interface

      UICtrl.addListItem(newItem, input.type);

      // 4 Clear the input fields

      UICtrl.clearField();

      // 5 calculate and update the budget

      updateBudget();

      // 6 calculate and update the percentage

      updatePercentage();
    }
  };

  // Get the input from localstorage if available already
  // CREATE THE FUNCTION TO RUN MULTIPLE STEPS OF PROCESS.

  var getAddItems = function () {
    
    // 1 get the inputs from localstorage
    let savedTransactions = JSON.parse(localStorage.getItem("budget"));

    if (savedTransactions !== null) {

      // 2 add the new item to the user interface
        if(savedTransactions.allItems.exp.length > 0){
            savedTransactions.allItems.exp.map(item => {
                UICtrl.addListItem(item, "exp");
            })
        }
        if(savedTransactions.allItems.inc.length > 0){
            savedTransactions.allItems.inc.map(item => {
                UICtrl.addListItem(item, "inc");
            })
        }
       
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);

      // DELETE THE ITEM FROM THE DATA STRUCTURE
      budgetCtrl.deleteItem(type, ID);

      // DELETE THE ITEM FROM THE UI

      UICtrl.deleteListItem(itemID);

      // UDPATE AND SHOW NEW BUDGET

      updateBudget();

      // 6 calculate and update the percentage

      updatePercentage();
    }
  };

  return {
    init: function () {
      console.log("application has been started");
      var budget = budgetCtrl.getBudgetFromLocal();
      UICtrl.displayMonth();
      UICtrl.displayBudget(budget);
      getAddItems();
      setUpEventListeners();
    },
  };
})(budgetController, UIController);

controller.init(); // call the init function of controller module to start the application.
