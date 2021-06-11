
   $(document).ready(function () {
      var $select = $("#modules");
      $("#summarytable").hide();
     $("#class").hide();
     
      // Load module information from JSON file
      $.getJSON('data.json', function (data) {
        $select.html('');

        // Loop through all modules in the JSON file and add the module code to the drop down list in the HTML.

        for (var i = 0; i < data['modules'].length; i++) {
          $select.append('<option id="' + data['modules'][i]['code'] + '">' + data['modules'][i]['code'] + '</option>');
        }
        
        $('select').selectpicker();

      });
      
     
    });
 
      
    function loadModule() {
      var moduleNumber = document.getElementById("modules").selectedIndex;
      // Use Fetch API to retrieve module information from JSON file and copy into input fields on HTML.
      fetch("data.JSON")
        .then(function (resp) {
          return resp.json();
        })
        .then(function (data) {
          document.getElementById("name").value = data.modules[moduleNumber].name;
          document.getElementById("level").value = data.modules[moduleNumber].stage;
          document.getElementById("credits").value = data.modules[moduleNumber].credits;
        });
    }

  
    
        var addModuleBtn = document.getElementById("button")
        addModuleBtn.addEventListener('click', addModule)
        var tbody = document.querySelector("tbody")
        var table = document.getElementById("mydatatable")
        table.addEventListener('click', deleteRow);

       
        
        
        
      // Array to store user inputs
      var moduleData = [];
 
      var rowCount = 0;
  
     

      function addModule() { 

      // Display table 
      $("#summarytable").show();

      // Only allow a max of 12 entries to be added otherwise display error
      if (rowCount < 8) {
      var code = document.getElementById("modules").value
      var name = document.getElementById("name").value
      var level = document.getElementById("level").value
      var credits = document.getElementById("credits").value
      var grade = document.getElementById("grade").value
      

      
      
       // Data validation to check all input fields are filled in
       if (!code || !name || !level || !credits || !grade ) {
          alert("Please fill out all fields and try again");
          return; 
       }

       // Display users input into a HTML table for display purposes


       tbody.innerHTML += "<tr>" +
                           "<td>" + code + "</td>" +
                           "<td>" + name + "</td>" +
                           "<td>" + level + "</td>" +
                           "<td>" + credits + "</td>" +
                           "<td>" + grade + "</td>" +
                           "<td><button class='deletebtn'>Delete" + "</button></td>" 
                           "</tr>"
  
                           
        
      userInputs = {
      "code" : code,
      "name" : name,
      "level": level,
      "credits": credits,
      "grade" : grade,
      };
      
      moduleData.push(userInputs);
      console.log(moduleData);
      rowCount++;

      // GetElementsByClassName returns array so all buttons created must be looped through
      var deleteBtn = document.getElementsByClassName("deletebtn")
      for (i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', getIndex);
      }
    }

      else {
        alert("Only a maximum of 8 modules can be studied please check entries!");
      }
    
 return true;
    }        
    

    // Get the index of the table row that is to be deleted and remove it from the array of user input

        function getIndex() {
          var index = ($(this).closest('tr').index());
          moduleData.splice(index, 1);
          console.log(moduleData)
          
        }

        // Delete row from table when button clicked and update row count

      function deleteRow(e){ 
          if (!e.target.classList.contains('deletebtn')) {
          return;
        }
        var deletebtn = e.target;
        deletebtn.closest('tr').remove()
        rowCount--;
        }

        
// CALCULATION OF USER GRADES....
var calculateBtn = document.getElementById("calcButton")
$("#calcButton").one("click", calculateClass); // Allow the calculate function to only run once


function calculateClass() {

  // Hide table upon calculation
  $("#summarytable").hide();
  $("#class").show();

  // Data validation for module credits must be equal to 240
  
var creditSum = moduleData.reduce(function (accumulator, item) {
  return accumulator + parseInt(item.credits);
}, 0)

if (creditSum < 240) {
 alert("Total credits entered are less than 240. Total credits must equal 240 please try again!")
} else if (creditSum > 240) {
 alert("Total credits entered are higher than 240. Total credits must be equal to 240 please try again!")
} 


// Filter user inputs to find modules studied at OU level 3 
  var l3Modules = moduleData.filter(module => module.level == 3);
  // Sort Lv 3 Modules array by best grade (lowest) in ascending order
  l3Modules = l3Modules.sort((a, b) => a.grade-b.grade)

  var l2Modules = moduleData.filter(module => module.level == 2); // Filter array to find rest of modules i.e studied at OU level 2
 
  

  // Loop through the array, find 120 credits worth of modules with the best grade.
  var creditsCount = 0
  for (i = 0; i < l3Modules.length; i++) {
    if (creditsCount < 120) {
    l3Modules[i].grade = parseInt(l3Modules[i].grade * 2)  // Multiply the grade value by 2
    creditsCount = creditsCount + parseInt(l3Modules[i].credits) // Credits then count towards the 120 best credits
     } else if(creditsCount = 120) { // Stop loop when a total of 120 credits has been accounted for
    break;
    }
  }
console.log(creditsCount);
console.log(l3Modules);
// Loop through arrays and multiply credits by grade to get weighted grade credits
var wgc = [];
for (i = 0; i < l3Modules.length; i++) {
  var moduleWGC = l3Modules[i].grade * parseInt(l3Modules[i].credits) 
  wgc.push(moduleWGC)
}
console.log(wgc);

for (i = 0; i < l2Modules.length; i++) {
  var moduleWGC = parseInt(l2Modules[i].grade) * parseInt(l2Modules[i].credits)
  wgc.push(moduleWGC);
}
console.log(wgc);


// sum the WGC array to get the total weighted grade credits for user

var totalWGC = wgc.reduce(function (accumulator, item) {
  return accumulator + item;
}, 0)

console.log(totalWGC);

// Quality Assurance Tests

// QA Test For First Class Honours

// Filter L3 Modules to show only modules with distinction grade
var qaL3Modules = l3Modules.filter(module => module.grade == 2) // Module grade has been doubled so a grade of 2 = Distinction

// Loop through the L3 Modules that have obtained Distinction Grade... if qaCreditSum >= 60 the QA test is passed and QA = 1 (First Class Honours)
var qaCreditSum = 0
var qa1CreditSum = 0
for (i = 0; i < qaL3Modules.length; i++) {
var qa1CreditSum = parseInt(qa1CreditSum + parseInt(qaL3Modules[i].credits))
}
console.log(qa1CreditSum);
if (qa1CreditSum >= 60) {
  var qa = 1
  console.log("Quality assurance test passed at least 60 OU level 3 credits have been achieved at distinction grade")
} else {
  console.log("Quality assurance test failed less than 60 OU level 3 credits have been achieved at distinction grade")
};

// Quality Assurance Test For 2:1 Take 60 best OU L3 Credits and multiply by grade
var qaCreditSum = 0
for (i = 0; i < l3Modules.length; i++) {
qaCreditSum = qaCreditSum + l3Modules[i].credits
if (qaCreditSum = 60) {
l3Modules[i].grade = l3Modules[i].grade / 2 
var qa_WGC = parseInt(l3Modules[i].grade * l3Modules[i].credits)


if (qa_WGC > 61 && qa_WGC < 120) {
  qa = 2.1
  console.log("Quality assurance test for 2:1 passed")
}
} else if (qa_WGC > 121 && qa_WGC < 180) {
  console.log("Quality assurance test for 2:1 failed insufficient weighted grade credits")
  qa = 2.2
  console.log("Quality assurance test fr 2:2 passed")
} else if (qa_WGC > 181) {
  console.log("Quality assurance test for 2:2 failed insufficient weighted grade credits")
  qa = 3
  console.log("Quality assurance test for 3 passed")
}


}

// Calculate users final degree classification using QA and WGC values

// Checks for First Class Honours
if (360 < totalWGC < 630 && qa == 1){
  document.getElementById("classDisplay").innerHTML = "First Class" 
} else if (360 < totalWGC < 630 && qa == 2.1) {
  document.getElementById("classDisplay").innerHTML = "2:1" 
} else if (360 < totalWGC < 630 && qa == 2.2) {
  document.getElementById("classDisplay").innerHTML = "2:2"
} else if (360 < totalWGC < 630 && qa == 3) {
  document.getElementById("classDisplay").innerHTML = "3"
}

// Checks for 2:1 Honours

if (630.1 < totalWGC < 900 && qa == 2.1) {
  document.getElementById("classDisplay").innerHTML = "Upper Second Class"
} else if (630.1 < totalWGC < 900 && qa == 2.2) {
  document.getElementById("classDisplay").innerHTML = "Lower Second Class"
} else if (630.1 < totalWGC < 900 && qa == 3) {
  document.getElementById("classDisplay").innerHTML = "Third Class"
}

// Check for 2:2 Honours

if (900.1 < totalWGC < 1170 && qa == 2.2) {
  document.getElementById("classDisplay").innerHTML = "Lower Second Class"
} else if (900.1 < totalWGC < 1170 && qa == 3) {
  document.getElementById("classDisplay").innerHTML = "Third Class"
}

// Check for 3 Honours

if (1170.1 < totalWGC < 1440 && qa == 3) {
  document.getElementById("classDisplay").innerHTML = "Third Class"
}




}