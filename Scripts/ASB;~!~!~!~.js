// Use for High Fire sample for Script #35
// 






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
