function parseAltIdFromContent(ctnt)
{       
		//This is just a sample.
		//Note, please customize the RegExp for actual AlternateID.
//        var altIdFormat = /Record ID #(.*\w)+/ig; 		
        var altIdFormat = /RECORD ID #(...\d+-\d+)+/ig;
		var upContent = ctnt.toUpperCase();
		var result = altIdFormat.exec(upContent);
		if(result){
			return result;
		}
		aa.print('No record id has been parsed from content.');
}
