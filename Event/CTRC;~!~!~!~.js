/*------------------------------------------------------------------------------------------------------/
| Program: CTRC:*/*/*/*.js  Trigger: Create to Real Cap
| Client:Santa Barbara - Silver Lining Solutions
|
| Version 1.0 - Base Version. 
|
/------------------------------------------------------------------------------------------------------*/
//Needed to get GIS feature associated when created by ACA
//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
try{
      copyParcelGisObjects();
} catch (err) {
      logDebug("A JavaScript Error occurred: CTRCA:*/*/*/*: copyParcelGisObjects()" + err.message);
      logDebug(err.stack);
};
