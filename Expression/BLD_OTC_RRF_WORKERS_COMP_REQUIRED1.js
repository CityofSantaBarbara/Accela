var toPrecision = function (value) {
    var multiplier = 10000;
    return Math.round(value * multiplier) / multiplier;
  };
  function addDate(iDate, nDays) {
    if (isNaN(nDays)) {
      throw "Day is a invalid number!";
    }
    return expression.addDate(iDate, parseInt(nDays));
  }
  
  function diffDate(iDate1, iDate2) {
    return expression.diffDate(iDate1, iDate2);
  }
  
  function parseDate(dateString) {
    return expression.parseDate(dateString);
  }
  
  function formatDate(dateString, pattern) {
    if (dateString == null || dateString == "") {
      return "";
    }
    return expression.formatDate(dateString, pattern);
  }
  
  var servProvCode = expression.getValue("$$servProvCode$$").value;

//This will block submit if they do not select at least 1 checkbox
var variable1=expression.getValue("ASI::RE-ROOF INFORMATION::Like for Like TearOff and Replace Composition Roofing");
var variable2=expression.getValue("ASI::RE-ROOF INFORMATION::Like for Like Remove and Re-Set Tile Roofing");
var variable3=expression.getValue("ASI::RE-ROOF INFORMATION::Like for Like Composition Overlay Roofing");
var variable4=expression.getValue("ASI::RE-ROOF INFORMATION::Like for Like Certified PVC Cool Roofing");
var frm1 = expression.getValue("ASI::FORM");

var totalRowCount = expression.getTotalRowCount();

if (
  (variable1.value == null || variable1.value == "UNCHECKED") &&
  (variable2.value == null || variable2.value == "UNCHECKED") &&
  (variable3.value == null || variable3.value == "UNCHECKED") &&
  (variable4.value == null || variable4.value == "UNCHECKED")
) {
  frm1.blockSubmit = true;
  frm1.message = "You must select at least one of the check boxes below before proceeding";
   expression.setReturn(frm1);
}
if (
  (variable1.value == "CHECKED") || 
  (variable2.value == "CHECKED") || 
  (variable3.value == "CHECKED") || 
  (variable4.value == "CHECKED")
) {
  frm1.blockSubmit = false;
  frm1.message ="";
  expression.setReturn(frm1);
}

//ASI::RE-ROOF INFORMATION::Structural Work Required
//THis will block Submit if they select "YES" To the "Structural Work Required"
var variable0=expression.getValue("ASI::RE-ROOF INFORMATION::Structural Work Required");
var variable1=expression.getValue("ASI::FORM");

//var doBlock = false;

		if((variable0.value!=null && (variable0.value.equalsIgnoreCase('YES') || variable0.value.equalsIgnoreCase('Y')))){

			variable0.message="If there is Structural Work need you cannot apply for a On Demand Permit Type. Please apply for a standard Residential or Commercial permit and explain your structural work in the permit description of that application.";
		expression.setReturn(variable0);

			variable1.blockSubmit=true;
variable1.message="If there is Structural Work need you cannot apply for a On Demand Permit Type. Please apply for a standard Residential or Commercial permit and explain your structural work in the permit description of that application.";
		expression.setReturn(variable1);
	}
else{
    variable1.blockSubmit=false;
	expression.setReturn(variable1);
    variable0.message="";
    expression.setReturn(variable0);
}
/*
if(doBlock){
    variable1.blockSubmit = true;
   variable1.message = "You Must Apply for a Standard Re-Roof Permit."
    expression.setReturn(variable0);
}
*/

var variable0=expression.getValue("ASI::RE-ROOF INFORMATION::Building Type");
var variable1=expression.getValue("ASI::RE-ROOF INFORMATION::Owner Builder or Licesne Professional");
var frmBlock = expression.getValue("ASI::FORM");

var aa = expression.getScriptRoot();
var totalRowCount = expression.getTotalRowCount();

var doBlock = false;

		if(variable0.value!=null && variable0.value.equals(String("All Others"))){

			variable1.value=String("License Professional");
		expression.setReturn(variable1);

			variable1.message="You must be a License Professional to apply for this type of application.";
		expression.setReturn(variable1);
	}
else{
    variable1.message="";
    expression.setReturn(variable1);
}


//This will block Submit depending on the Owner Builder or License Professional question. 
  var variable0 = expression.getValue(
    "ASI::RE-ROOF INFORMATION::Owner Builder or Licesne Professional");
var variable1 = expression.getValue(
    "ASI::IDENTIFY WORK PERFORM BY::I am exempt from licensure under the Contractors State License Law");
var variable2 = expression.getValue(
    "ASI::IDENTIFY WORK PERFORM BY::I as owner of the property I will do all of the work");
var variable3 = expression.getValue(
    "ASI::IDENTIFY WORK PERFORM BY::I as owner of the property will do a portion of the work");
var variable4 = expression.getValue(
    "ASI::IDENTIFY WORK PERFORM BY::I as owner of the property am exclusively contracting with licensed Contractors");
var variable5 = expression.getValue(
    "ASI::IDENTIFY WORK PERFORM BY LP::I hereby affirm under penalty of perjury that I am licensed");
var variable6 = expression.getValue(
    "ASI::RE-ROOF INFORMATION::Building Type");

var frm2 = expression.getValue("ASI::FORM");
frm2.message = "";
frm2.blockSubmit = false;

if (variable0.value == "Owner Builder") {
variable1.hidden = false;
expression.setReturn(variable1);
variable2.hidden = false;
expression.setReturn(variable2);
variable3.hidden = false;
expression.setReturn(variable3);
variable4.hidden = false;
expression.setReturn(variable4);
variable5.hidden = true;
//variable5.value = "No";
expression.setReturn(variable5);
} else if ((variable0.value == "License Professional") 
|| (variable0.value == "License Professional" && veriable6.value == "All Others")) {
variable1.hidden = true;
//variable1.value = "No";
expression.setReturn(variable1);
variable2.hidden = true;
//variable2.value = "No";
expression.setReturn(variable2);
variable3.hidden = true;
//variable3.value = "No";
expression.setReturn(variable3);
variable4.hidden = true;
//variable4.value = "No";
expression.setReturn(variable4);
variable5.hidden = false;
expression.setReturn(variable5);

if (variable5.value != "Yes") {
    frm2.blockSubmit = true;
    frm2.message = "You must select YES before you can proceeding.";
    expression.setReturn(frm2);
    variable5.message = "You must select YES before you can proceeding.";
    expression.setReturn(variable5);
}
}

var selected = 0;
if (variable1.value == "Yes")
selected++;
if (variable2.value == "Yes")
selected++;
if (variable3.value == "Yes")
selected++;
if (variable4.value == "Yes")
selected++;

if (selected == 0 || selected > 1) {
variable1.message =
    "You must select Yes to only 1 of the following questions before you can proceeding.";
expression.setReturn(variable1);
frm2.blockSubmit = true;
frm2.message =
    "You must select Yes to only 1 of the following questions before you can proceeding.";
}

expression.setReturn(frm2);

//This will block submit if they do not select yes to 1 of the questions. 
var variable6 = expression.getValue(
    "ASI::IDENTIFY WORKERS COMPENSTATION::I have and will maintain a certificate of consent to self insure for workers compensation");
var variable7 = expression.getValue(
    "ASI::IDENTIFY WORKERS COMPENSTATION::I have and will maintain workers compensation insurance");
var variable8 = expression.getValue(
    "ASI::IDENTIFY WORKERS COMPENSTATION::I certify that in the performance of the work for which this permit is issued");
var frm3 = expression.getValue("ASI::FORM");
frm3.message = "";
frm3.blockSubmit = false;
var selected = 0;

if (variable6.value == "Yes")
selected++;
if (variable7.value == "Yes")
selected++;
if (variable8.value == "Yes")
selected++;

if (selected > 1) {
frm3.blockSubmit = true;
frm3.message =
    "You must select Yes to only 1 of the following questions before you can proceeding.";
expression.setReturn(frm3);
}

if (selected < 1) {
frm3.blockSubmit = true;
frm3.message =
    "You must select Yes to only 1 of the following questions before you can proceeding.";
    variable6.message =
    "You must select Yes to only 1 of the following questions before you can proceeding.";
expression.setReturn(variable6);
}
expression.setReturn(frm3);

