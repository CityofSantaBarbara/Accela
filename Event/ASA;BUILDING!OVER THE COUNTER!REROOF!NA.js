//ASA;BUILDING!OVER THE COUNTER!REROOF!NA.js
//Added by Gray Quarter 
//New On Demand Re-Roof record for ACA

if ((AInfo['Re-Roof Types'] == 'Like for Like') && AInfo['Roof Square Footage'] <= '3000') {
    updateFee('BLD_ITM_1090', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Re-Roof Types'] == 'Certified PVC Cool Roof') && AInfo['Roof Square Footage'] <= '3000') {
	updateFee('BLD_ITM_1090', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Re-Roof Types'] == 'Other') && AInfo['Roof Square Footage'] <= '3000') {
	updateFee('BLD_ITM_1090', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Re-Roof Types'] == 'Remove & Reset Tile Over New Weather Barrier') && AInfo['Roof Square Footage'] <= '3000') {
	updateFee('BLD_ITM_1090', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Roof Square Footage'] >= '3000') && AInfo['Re-Roof Types'] == 'Like for Like' 
    || AInfo['Re-Roof Types'] == 'Certified PVC Cool Roof' || AInfo['Re-Roof Types'] == 'Other' 
    || AInfo['Re-Roof Types'] == 'Remove & Reset Tile Over New Weather Barrier') {
    updateFee('BLD_ITM_1100', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Re-Roof Types'] == 'Overlay Like for Like') && AInfo['Roof Square Footage'] <= '3000') {
    updateFee('BLD_ITM_1110', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}

if ((AInfo['Re-Roof Types'] == 'Overlay Like for Like') && AInfo['Roof Square Footage'] >= '3000') {
    updateFee('BLD_ITM_1110', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
    updateFee('BLD_ITM_1070', 'BLD LINE ITEMS FY2020', 'FINAL', 1, 'Y');
}
