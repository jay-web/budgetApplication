var budgetController = (function () {
  // INCOME FUNCTION CONSTRUCTOR TO CREATE INCOME

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // EXPENSE FUNCTION CONSTRUCTOR TO CREATE FUNCTION
  var Expenses = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expenses.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expenses.prototype.getPercentage = function () {
    return this.percentage;
  };
  // DATA STRUCTURE TO SAVE THE DATA

  var data = {
    allItems: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },
    budget: 0,
    percentage: -1,
  };

  // CALCULATE THE TOTAL INCOME AND EXPENSES FUNCTION

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (item) {
      sum += item.value;
    });
    data.totals[type] = sum;
  };

  // ===================================================================================================================
  // BELOW IS THE DATA WHICH WE WANT TO MADE PUBLIC

  //=================================================================================================================
  return {
    addItem: function (type, des, val) {
      var newItem, ID;

      // CREATE THE NEW ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // CREATE THE NEW ITEM BASED ON 'inc' AND 'exp' type

      if (type === "exp") {
        newItem = new Expenses(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      // Add the new item in data structure

      data.allItems[type].push(newItem);

      //  RETURN THE NEWLY CREATED ITEM.

      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      var ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // CALCULATE THE TOTAL INCOME AND EXPENSES

      calculateTotal("exp");
      calculateTotal("inc");

      //CALCULATE THE BUDGET: INCOME - EXPENSES

      data.budget = data.totals.inc - data.totals.exp;

      //CALCULATE THE PERCENTAGE OF INCOME THAT WE SPENT
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }

      localStorage.setItem("budget", JSON.stringify(data));
    },

    calculatePercentage: function () {
      data.allItems.exp.forEach(function (cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      var allPercentages = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPercentages;
    },
    getBudget: function () {
      console.log(data);
        let savedBudget = JSON.parse(localStorage.getItem("budget"));
        console.log(savedBudget);
        if(savedBudget !== null && savedBudget.budget !== 0){
          data = savedBudget;
        }
        // if(savedBudget !== null){
        //     return {
        //         budget: savedBudget.budget,
        //         totalInc: savedBudget.totals.inc,
        //         totalExp: savedBudget.totals.exp,
        //         percentage: savedBudget.percentage,
        //       };
        // }else{
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
              };
        // }
     
    },
    // for testing purpose only in console.
    testing: function () {
      console.log(data);
    },
  };
})();
