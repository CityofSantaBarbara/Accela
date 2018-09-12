/*------------------------------------------------------------------------------------------------------/
| function: pop
|
| Desc: will provide both function and propery information for the class provided as a parameter.
|       this function is valuable for assisting a developer in researching the contents of an unknown
|       or undocumented class.
|
| Params: 	name 	= used for organizing the output and displaying the variable 
|			obj		= the object that will be defined
| Created By: Silver Lining Solutions
|------------------------------------------------------------------------------------------------------*/

function pop(name,obj){
	var idx;	var methArr = [];	var attArr = [];
	aa.print("*************************************************************************");
	aa.print("***** Start of " + name);
    if(obj.getClass != null){ aa.print("***** " + obj.getClass()); }
    else { aa.print("this is not an object with a class!"); }

	for(idx in obj){
		if (typeof (obj[idx]) == "function") {
			try {
				var methStr = "" + idx + "==>  " +obj[idx]();	methArr.push(methStr);
			} catch (ex) { }
		} else {
			
			var attStr = "" + idx + ": " +obj[idx]; attArr.push(attStr);
		}
	}

	if (methArr.length > 0)	{methArr.sort(); aa.print(methArr.length + " methods");	for (i = 0; i < methArr.length; i++){aa.print("     Method " + methArr[i]);	}}

	if (attArr.length > 0){attArr.sort(); aa.print(attArr.length + " attributes"); for (i = 0; i < attArr.length; i++) { aa.print("     Attrib " + attArr[i]);}}
	aa.print("***** END of " + name);
	aa.print("*************************************************************************");
}