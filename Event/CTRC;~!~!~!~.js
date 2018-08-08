//********************************************************************************************************
//Script 		CTRC:~/~/~/~.js
//Record Types:	all
//
//Event: 		
//
//Desc:		for aca 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				      Jason			Initial Draft
//			08-08-2018	Chad			changed header
//********************************************************************************************************
      
      
//Needed to get GIS feature associated when created by ACA
//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
try{
      copyParcelGisObjects();
} catch (err) {
      logDebug("A JavaScript Error occurred: CTRCA:*/*/*/*: copyParcelGisObjects()" + err.message);
      logDebug(err.stack);
};
