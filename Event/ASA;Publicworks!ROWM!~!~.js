//********************************************************************************************************
//Script 		ASA;Publicworks!ROWM!~!~
//
//Record Types:	Publicworks
//
//Event: 		Application Submit After
//
//Desc:			Alert user of potential conflict of work in right of way
//
//Created By: Silver Lining Solutions
//********************************************************************************************************
// Change Log
//            Date        Name			Modification
//            01-16-2019  Chad			Created
//********************************************************************************************************
logDebug("START ASA:Publicworks\ROWM\*\* ");
checkPBWRightOfWayConflicts();
logDebug("END ASA:Publicworks\ROWM\*\* ");
