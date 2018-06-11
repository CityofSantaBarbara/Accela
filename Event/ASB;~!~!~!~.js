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

//Start Proximity Alerts
include("High_Fire_Hazard_Areas");
//End Proximuty Alerts
