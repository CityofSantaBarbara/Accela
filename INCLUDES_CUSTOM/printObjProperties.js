//********************************************************************************************************
//Script 		printObjProperties
//Record Types:	helper function
//
//Event: 		na
//
//Desc:			print object contents
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date		Name			Modification
//				08-09-2018	Chad			Initial Draft
//********************************************************************************************************

function printObjProperties(obj){
    var idx;

    if(obj.getClass != null){
        logDebug("************* " + obj.getClass() + " *************");
    }
	else {
		logDebug("this is not an object with a class!");
	}

    for(idx in obj){
        if (typeof (obj[idx]) == "function") {
            try {
                logDebug(idx + "==>  " + obj[idx]());
            } catch (ex) { }
        } else {
            logDebug(idx + ":  " + obj[idx]);
        }
    }
}
