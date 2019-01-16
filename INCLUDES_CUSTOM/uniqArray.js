//********************************************************************************************************
//Script 		uniqArr
//Event: 		
//Desc:			helper function to eliminate dupes from an array 
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//         		Date        Name          Modification
//            01/10/2019	Chad          Created
//********************************************************************************************************
function uniqArray(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
