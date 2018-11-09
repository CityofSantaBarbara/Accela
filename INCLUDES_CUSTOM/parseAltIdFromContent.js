function parseAltIdFromContent(content)
{       
		//This is just a sample.
		//Note, please customize the RegExp for actual AlternateID.
        var altIdFormat = /Record ID #(...\d+-\d+)+/ig;
//        var altIdFormat = /Record ID #(.*\w)+/; 		this is original from Accela
		var result = altIdFormat.exec(content);
		if(result){
			return result;
		}
		else {
			aa.print('No record id has been parsed from content.'+content);
			logDebug('No record id has been parsed from content. content was:'+content);
			return null;
		}
}
