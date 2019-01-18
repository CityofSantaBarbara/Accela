//********************************************************************************************************
//Script 		getROWOverlapStreetRecords
//
//Record Types:	Public Works Right of Way Management scripting
//
//Event: 		usually Fired at ACA and in PageFlow for these record types 
//
//Desc:			Find all open ROW records with conflicting work dates on same streets 
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-16-2019  Chad			Created
//	      01-16-2019  Chad                  changed to check for b1_alt_id match
//			01-17-2019	Chad			Changes for ACA
//********************************************************************************************************
function getROWOverlapStreetRecords( lStartDate, lEndDate, lStreetName, lStreetStartNum, lStreetEndNum ) {
logDebug("START getROWOverlapStreetRecords");
	try {
		var matchedRecList =[];
		
		var selectString = "EXEC DBO.sp_GetOverlapROWStreetRecords '"+lStartDate+"','"+lEndDate+"','"+lStreetName+"','"+lStreetStartNum+"','"+lStreetEndNum+"';"
		logDebug("selectString="+selectString);

		var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext").getOutput();
		var ds = initialContext.lookup("java:/AA"); 
		var conn = ds.getConnection(); 
		var sStmt = conn.prepareStatement(selectString);
		var rSet = sStmt.executeQuery();
		logDebug("SQL Success!!!");
		var cntr = 0;

		var chkAltId = "";

		while (rSet.next()) {
/* Depending on what we really need here we could list out the rec IDs, OR just set a boolean and be done on the first pass */
			var mB1_Alt_id	= rSet.getString("B1_ALT_ID"); 
			var mWorkStart	= rSet.getString("workStart"); 
			var mWorkEnd	= rSet.getString("workEnd"); 
			var mStreetName	= rSet.getString("StrtName"); 
			var mStartNum	= rSet.getString("StartNum"); 
			var mEndNum		= rSet.getString("EndNum"); 

						
			if (!publicUser) chkAltId = cap.getCapModel().getAltID();	
			if (mB1_Alt_id != chkAltId) {
				matchedRecList.push(mB1_Alt_id);
				var msgStr	=	"Potential Right of Way Work Conflicts at record:"+mB1_Alt_id
							+	"<br>      starting:"+mWorkStart
							+	"<br>      ending:"+mWorkEnd
							+	"<br>      on street:"+mStreetName
							+	"<br>      start address:"+mStartNum
							+	"<br>      end address:"+mEndNum;
				logDebug(msgStr);
			} else 
				logDebug("it is the same ID for getaltId >"+cap.getCapModel().getAltID()+"< and mb1alt >"+mB1_Alt_id);			
		cntr++;
		} 
		rSet.close(); 
		conn.close();
		logDebug("found :"+cntr+" records that are potential conflicts!");
	}
	catch(err){
		logDebug("Error on GoGetAnSQLDone function. Please contact administrator. Err: " + err);
	}
//	logDebug("your rec list is:"+matchedRecList);
	var unqRecMatches = uniqArray(matchedRecList);
//	logDebug("your UNIQUE rec list is:"+unqRecMatches);	
	logDebug("END getROWOverlapStreetRecords");
	return (unqRecMatches);
}
