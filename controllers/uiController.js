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