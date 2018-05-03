//For ASA/*/*/*:

//Copy Parcel GIS Objects to Record using function copyParcelGisObjects()
try{
      if(!publicUser){
            copyParcelGisObjects();
      }
} catch (err) {
      logDebug("A JavaScript Error occurred: ASA:*/*/*/*: copyParcelGisObjects()" + err.message);
      logDebug(err.stack);
};
