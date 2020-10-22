//Set the Detail Description
    var totPoint = "";
  if (
    AInfo[
      "Like for Like TearOff and Replace Composition Roofing"
    ] == "CHECKED"
    ) {
    totPoints = totPoints + 'Like for Like Tear-Off and Replace Composition Roofing ';
    } else if (
    AInfo[
      "Like for Like Remove and Re-Set Tile Roofing"
    ] == "CHECKED"
    ) {
    totPoints = totPoints + 'Like for Like Remove & Re-Set Tile Roofing ';
    }
   else if (
    AInfo[
      "Like for Like Composition Overlay Roofing"
    ] == "CHECKED"
    ) {
    totPoints = totPoints + 'Like for Like Composition Overlay Roofing ';
    }
   else if (
    AInfo[
      "Like for Like Certified PVC Cool Roofing"
    ] == "CHECKED"
    ) {
    totPoints = totPoints + 'Like for Like Certified PVC Cool Roofing ';
    }
    
  
    updateWorkDesc(String(totPoints));