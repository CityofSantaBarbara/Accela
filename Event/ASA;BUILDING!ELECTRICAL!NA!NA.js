//Added by Gray Quarter per request of Andrew on 11/2/2020 
removeAllFees(capId);
if (publicUser) {
  if (estValue <= 100000) {
    updateFee("BLD_ITM_0015", "BLD LINE ITEMS FY2021", "FINAL", 100, "Y");
  }
  if (estValue >= 100001 && estValue <= 250000) {
    updateFee("BLD_ITM_0015", "BLD LINE ITEMS FY2021", "FINAL", 250, "Y");
  }
  if (estValue >= 250001 && estValue <= 500000) {
    updateFee("BLD_ITM_0015", "BLD LINE ITEMS FY2021", "FINAL", 500, "Y");
  }
  if (estValue >= 500001) {
    updateFee("BLD_ITM_0015", "BLD LINE ITEMS FY2021", "FINAL", 1000, "Y");
  }
}
