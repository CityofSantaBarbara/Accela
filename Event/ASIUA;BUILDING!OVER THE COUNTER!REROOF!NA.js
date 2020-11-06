//ASIUA:BUILDING/OVER THE COUNTER/REROOF/NA
//Set the Detail Description
    var totPoints = "";
  if (
    AInfo[
      "Like for Like TearOff and Replace Composition Roofing"
    ] == "CHECKED"
    ) {
    if(totPoints != '') totPoints+= '& ';
    totPoints = totPoints + "Like for Like Tear-Off and Replace Composition Roofing ";
    } if (
    AInfo[
      "Like for Like Remove and Re-Set Tile Roofing"
    ] == "CHECKED"
    ) {
      if(totPoints != '') totPoints+= '& ';
    totPoints = totPoints + "Like for Like Remove & Re-Set Tile Roofing ";
    }
   if (
    AInfo[
      "Like for Like Composition Overlay Roofing"
    ] == "CHECKED"
    ) {
      if(totPoints != '') totPoints+= '& ';
    totPoints = totPoints + "Like for Like Composition Overlay Roofing ";
    }
   if (
    AInfo[
      "Like for Like Certified PVC Cool Roofing"
    ] == "CHECKED"
    ) {
      if(totPoints != '') totPoints+= '& ';
    totPoints = totPoints + "Like-for-Like Color - Certified Cool Roof ";
    }
    
  
    updateWorkDesc(String(totPoints));