//var budgetController = (function(){
//    
//    var x   = 23;
//    
//    var add = function(a){
//        return x+ a;
//    }
//    
//    return{
//        publicTest: function(b){
//            return (add(b)); 
//        }
//    }
//})();  
//
//
//var UIController    =   (function(){
//    // some code
//    
//})();
//
//
//var appController   = (function(budgetCtrl, UICtrl){
//    
//
//    var save = budgetCtrl.publicTest(5);
//    
//    return{
//        anotherPublic: function()
//        {
//            console.log(save);
//        }
//    }
//})(budgetController, UIController);
//=================================================================================================================


var budgetController    =   (function(){
    
    // INCOME FUNCTION CONSTRUCTOR TO CREATE INCOME 
    
    var Income  =   function(id, description, value)
    {
        this.id =   id;
        this.description    =   description;
        this.value  =   value;
    };
    // EXPENSE FUNCTION CONSTRUCTOR TO CREATE FUNCTION
    var Expenses    =   function(id, description, value)
    {
        this.id =   id;
        this.description    =   description;
        this.value  =   value;
        this.percentage = -1;
    };
    
    Expenses.prototype.calcPercentage   =   function(totalIncome)
    {
        if(totalIncome > 0){
            this.percentage =   Math.round((this.value / totalIncome) * 100 ); 
        }else{
            this.percentage = -1;
        }
        
    };
    
    Expenses.prototype.getPercentage = function()
    {
      return this.percentage;  
    };
    // DATA STRUCTURE TO SAVE THE DATA
    
    var data   =    {
        
        allItems: {
            inc:    [],
            exp:    []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };
    
    // CALCULATE THE TOTAL INCOME AND EXPENSES FUNCTION
    
    var calculateTotal  = function(type)
    {
        var sum = 0;
        data.allItems[type].forEach(function(item) {
           sum += item.value; 
        });
        data.totals[type] = sum;
    };
    
    // ===================================================================================================================
    // BELOW IS THE DATA WHICH WE WANT TO MADE PUBLIC 
    
    //=================================================================================================================
    return {
        addItem : function(type, des, val){
            var newItem, ID;
        
            // CREATE THE NEW ID
                if(data.allItems[type].length > 0)
            {
                ID  = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }
            
        
            // CREATE THE NEW ITEM BASED ON 'inc' AND 'exp' type
            
            if(type === 'exp')
                {
                newItem =   new Expenses(ID, des, val);
                }
            else if( type === 'inc')
                {
                newItem =   new Income(ID, des, val);
                }
            
            // Add the new item in data structure 
    
                data.allItems[type].push(newItem);
                
            //  RETURN THE NEWLY CREATED ITEM.
                
                return newItem;
        },
        
        deleteItem: function(type , id)
        {
            var ids, index;
            
            var ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);
            
            if(index !== -1)
                {
                    data.allItems[type].splice(index, 1);
                }
        },
        
        calculateBudget: function()
        {
            // CALCULATE THE TOTAL INCOME AND EXPENSES
            
            calculateTotal('exp');
            calculateTotal('inc');
            
            //CALCULATE THE BUDGET: INCOME - EXPENSES
            
            data.budget =   data.totals.inc - data.totals.exp;
            
            //CALCULATE THE PERCENTAGE OF INCOME THAT WE SPENT
            if(data.totals.inc > 0)
                {
                 data.percentage =   Math.round((data.totals.exp / data.totals.inc) * 100);   
                }
            else{
                data.percentage = -1;
            }
        },
        
        calculatePercentage : function()
        {
            data.allItems.exp.forEach(function(cur){
               cur.calcPercentage(data.totals.inc); 
            });
        },
        
        getPercentage: function()
        {
          var allPercentages = data.allItems.exp.map(function(cur){
             return  cur.getPercentage(); 
          });
            return allPercentages;
        },
        getBudget: function()
        {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },
        // for testing purpose only in console.
        testing: function()
            {
                console.log(data);
            }
    };
            
      
    
})();

//=================================================================================================================

var UIController    =   (function(){
    
    var DOMString   =   {
        
        inputType : ".add__type",
        inputDescription : ".add__description",
        inputValue :   ".add__value",
        inputButton :   ".add__btn",
        incomeContainer : ".income__list",
        expensesContainer : ".expenses__list",
        budgetLabel : ".budget__value",
        incomeLabel : ".budget__income--value",
        expensesLabel : ".budget__expenses--value",
        percentageLabel : ".budget__expenses--percentage",
        container : ".container",
        expensesPercLabel : ".item__percentage",
        dateLabel   : ".budget__title--month"
    };
    var formatNumber = function(num, type)
        {
          var numSplit, int, dec, type;
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split(".");
            
            int = numSplit[0];
                if(int.length > 3)
                    {
                        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length-3, int.length);
                    }
            
            dec = numSplit[1];
            
            return  (type === 'exp' ?  '-' :  '+') + ' ' + int + '.' + dec;
        };
    return {
        getInput: function(){
            return{
                
             type    :    document.querySelector(DOMString.inputType).value,            // it will be either inc or exp.
             description    :    document.querySelector(DOMString.inputDescription).value,
             value    :   parseFloat( document.querySelector(DOMString.inputValue).value )
            };
            
        },
        addListItem: function(obj, type)
        {
            var html, newHtml, element;
            // create htm string with placeholde text
            if(type==='inc')
            {
                element = DOMString.incomeContainer;
              html =  '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
            }
            else if(type === 'exp')
                {
                    element = DOMString.expensesContainer;
                    html ='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"> <div class="item__value">%value%</div><div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div> </div> </div>';
                }
            
            // replace the placeholder text with actual data
             newHtml    = html.replace('%id%', obj.id);
             newHtml    = newHtml.replace('%description%', obj.description);
             newHtml    = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // insert the html into the dom
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        }, 
        
        deleteListItem : function(selectorID)
        {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearField: function()
        {
            var fields, fieldArr;
            
            fields =document.querySelectorAll(DOMString.inputDescription + ", " + DOMString.inputValue);
            
            fieldArr = Array.prototype.slice.call(fields);
            
            fieldArr.forEach(function(current, index, array){
               
                current.value   =   "";
                
            });
            fieldArr[0].focus();
        },
        
        displayBudget : function(obj)
        {
            var type;
           obj.budget > 0 ? type = 'inc' : type ='exp';
          document.querySelector(DOMString.budgetLabel).textContent = formatNumber(obj.budget, type);  
          document.querySelector(DOMString.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');  
          document.querySelector(DOMString.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');  
            
            if(obj.percentage > 0)
                {
                     document.querySelector(DOMString.percentageLabel).textContent = obj.percentage + "%";
                }
            else{
                 document.querySelector(DOMString.percentageLabel).textContent = "--";
            }
         
        },
        
        displayPercentage : function(percentages)
        {
            var fields = document.querySelectorAll(DOMString.expensesPercLabel);
            
            var nodeListforEach = function(list, callback)
            {
                for(var i=0; i < list.length; i++)
                    {
                        callback(list[i], i);
                    }
            }
            
            nodeListforEach(fields, function(current, index){
               
                if(percentages[index] > 0)
                    {
                        current.textContent = percentages[index] + "%";
                    }
                else{
                    current.textContent = "---";
                }
                
            });
        },
        displayMonth: function()
        {
         var now, year, months, month;
            now = new Date();
            months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMString.dateLabel).textContent =months[month] + " " +  year;
        },

        getDOMString : function(){
            return DOMString;
                    }
    };
    
})();

// ============================================================================================
var controller  =   (function(budgetCtrl, UICtrl){
    
    // ADD EVENT LISTENER TO GET LISTEN AT THE TIME OF BUTTON CLICKED.
    
    var setUpEventListeners =   function()
    {
         var DOM =   UICtrl.getDOMString();
        
            // CLICK EVENT HANDLER 
        
         document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
        
            // KEYPRESS EVENT HANDLER
        
         document.addEventListener("keypress", function(event){
        
        if(event.keyCode === 13){
            ctrlAddItem();
        }
            });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };
    
    var updateBudget = function()
    {
        // CALCULATE THE BUDGET
        budgetCtrl.calculateBudget();
        
        // RETURN THE BUDGET
        
        var budget  =   budgetCtrl.getBudget();
        
        // DISPLAY THE BUDGET ON UI
        
        UICtrl.displayBudget(budget);
    };
    
    // CREATE THE FUNCTION TO UPDATE THE PERCENTAGE
    
    var updatePercentage  = function()
    {
      // Calculate percentage
        
        budgetCtrl.calculatePercentage();
        
      // Read percentage from the budget controller
        var percentage = budgetCtrl.getPercentage();
      // update the UI with the new percentages
        UICtrl.displayPercentage(percentage);
        
    };
    
   // CREATE THE FUNCTION TO RUN MULTIPLE STEPS OF PROCESS.
    
    var ctrlAddItem =   function()
        {
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
    
    var ctrlDeleteItem = function(event)
    {
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
        
        init    : function(){
            console.log("application has been started");
            UICtrl.displayMonth();
            UICtrl.displayBudget(
            {
                budget: 0,
                totalExp: 0,
                totalInc : 0,
                percentage : -1
            });
            setUpEventListeners();
        }
    }
 
    
   
})(budgetController, UIController);


controller.init();                  // call the init function of controller module to start the application.