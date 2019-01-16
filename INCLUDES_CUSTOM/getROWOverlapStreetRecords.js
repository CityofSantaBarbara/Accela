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
//********************************************************************************************************
function getROWOverlapStreetRecords( lStartDate, lEndDate, lStreetName, lStreetStartNum, lStreetEndNum ) {
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

		while (rSet.next()) {
/* Depending on what we really need here we could list out the rec IDs, OR just set a boolean and be done on the first pass */
			var mB1_Alt_id	= rSet.getString("B1_ALT_ID"); 
			var mWorkStart	= rSet.getString("workStart"); 
			var mWorkEnd	= rSet.getString("workEnd"); 
			var mStreetName	= rSet.getString("StrtName"); 
			var mStartNum	= rSet.getString("StartNum"); 
			var mEndNum		= rSet.getString("EndNum"); 

			var msgStr	=	"Potential Right of Way Work Conflicts at record:"+mB1_Alt_id
						+	"<br>      starting:"+mWorkStart
						+	"<br>      ending:"+mWorkEnd
						+	"<br>      on street:"+mStreetName
						+	"<br>      start address:"+mStartNum
						+	"<br>      end address:"+mEndNum;
						
			matchedRecList.push(mB1_Alt_id);
						
			logDebug(msgStr);
		cntr++;
		} 
		rSet.close(); 
		conn.close();
		logDebug("found :"+cntr+" records that are potential conflicts!");
	}
	catch(err){
		aa.print("Error on GoGetAnSQLDone function. Please contact administrator. Err: " + err);
	}
//	logDebug("your rec list is:"+matchedRecList);
	var unqRecMatches = uniqArray(matchedRecList);
//	logDebug("your UNIQUE rec list is:"+unqRecMatches);	
	return (unqRecMatches);
}
