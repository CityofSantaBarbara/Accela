/*------------------------------------------------------------------------------------------------------/
| Program: ASB:*/*/*/*.js  Trigger: Application Submit Before
| Client:Santa Barbara - Silver Lining Solutions
|
| Version 1.0 - Base Version. 
|
/------------------------------------------------------------------------------------------------------*/

if (matches(currentUserID,"JJACKSON","ADMIN")) {
	showDebug = 3;
	showMessage= true;
}
//Proximity Alert for High Fire Hazard Areas
var vIsWithinProximity = proximity("SANTABARBARA","High Fire Hazard Areas","0","feet");

if (vIsWithinProximity == true) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within a High Fire Hazard Area</B></Font>.");
}
