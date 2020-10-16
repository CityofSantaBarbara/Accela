//CTRCA;BUILDING!OVER THE COUNTER!REROOF!NA.js
//CTRCA:BUILDING/OVER THE COUNTER/REROOF/NA
//Added by Gray Quarter
//Start - New On Demand Re-Roof record for ACA

if (publicUser) {
  //runReportAsyncAttach(capId, "On Demand Permit Record","PermitNum",capId.getCustomID());
  runAsyncEvent("ASYNC_ONDEMAND_REROOF_SEND_EMAIL",capIDString,currentUserID);
}


//END - New On Demand Re-Roof record for ACA
