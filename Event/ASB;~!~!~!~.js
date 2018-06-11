//Proximity Alert for High Fire Hazard Areas
var vIsWithinProximity = getGISInfo("SANTABARBARA","High Fire Hazard Areas","Assessment","yes");

if (vIsWithinProximity == true) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within a High Fire Hazard Area</B></Font>.");
}
