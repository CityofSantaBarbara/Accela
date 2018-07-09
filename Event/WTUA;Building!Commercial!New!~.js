// SAMPLE SCRIPT TO MAP GIS INFO TO AN ASI AND GET PROX ALERT!

var GISService = "SANTABARBARA";
var highFire = getProximityAlert(GISService, "High Fire Hazard Areas", "assessment", 10, "feet");
var nearPacificOcean = getProximityAlert(GISService, "Pacific Ocean", "REGION", 10000, "feet");

if (highFire) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within 10 feet of a High Fire Area</B></Font>.");
		aa.print("<B><Font Color=RED>Please be advised, this property is within 10 feet of a High Fire Area</B></Font>.");
}
else {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>NOT within 10 feet of a High Fire Area</B></Font>.");
		aa.print("<B><Font Color=RED>NOT within 10 feet of a High Fire Area</B></Font>.");
}

if (nearPacificOcean) {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>Please be advised, this property is within 10000 feet of the Pacific Ocean</B></Font>.");
		aa.print("<B><Font Color=RED>Please be advised, this property is within 10000 feet of the Pacific Ocean</B></Font>.");
}
else {
		showMessage = true;
		//cancel = true; 
		comment("<B><Font Color=RED>NOT within 10000 feet of the Pacific Ocean</B></Font>.");
		aa.print("<B><Font Color=RED>NOT within 10000 feet of the Pacific Ocean</B></Font>.");
}

mapGISAttribToASI("SANTABARBARA", "Zoning", "ZONE", "Zone");
