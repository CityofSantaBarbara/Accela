function parseAltIdFromContent(content)
{       
		//This is just a sample.
		//Note, please customize the RegExp for actual AlternateID.
        var altIdFormat = /Record ID #(.*\w)+/; 		
		var result = altIdFormat.exec(content);
		if(result){
			return result;
		}
		aa.print('No record id has been parsed from content.');
}
