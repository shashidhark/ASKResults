/*
	Functions
*/

function readFile()
{
	resizeOnChange();
	var file=document.getElementById("filePath").value;
	Components.utils.import("resource://gre/modules/NetUtil.jsm");
	NetUtil.asyncFetch(file, function(inputStream, status) {
	  if (!Components.isSuccessCode(status)) {
		// Handle error!
		return;
	  }

	  // The file data is contained within inputStream.
	  // You can read it into a string with
	  var data = NetUtil.readInputStreamToString(inputStream, inputStream.available());
		//alert(data);
		//data = data.replace(/ /g,'');
		data = data.match(/[1-4][a-zA-Z]{2}[0-9]{2}(([a-zA-Z]{2}[0-9]{3})|([a-zA-Z]{3}[0-9]{2}))/g)
		advancedSearch(data);
	});	
	
}

function filePicker()
{
	const nsIFilePicker = Components.interfaces.nsIFilePicker;
	var fp = Components.classes["@mozilla.org/filepicker;1"]
			       .createInstance(nsIFilePicker);
	fp.init(window, "ASKResults File picker", nsIFilePicker.modeOpen);
	fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

	var rv = fp.show();
	if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
	  var file = fp.file;
	  // Get the path as string. Note that you usually won't 
	  // need to work with the string paths.
	  var path = fp.file.path;
	  // work with returned nsILocalFile...
		//alert(path);		
		document.getElementById("filePath").value="file://"+path;
		//file="file://"+path;
	}
}

//Function to append zero
function get23D(n, s){
	if(s){
	     if( n.toString().length == 1 )
    	    return "00" + n;
		 else if(n.toString().length == 2)
			return "0" + n;
    }	
	else
	{
		if( n.toString().length == 1 )
    	    return "0" + n;
	}
	return n.toString();
}


//Resize window depending of contenet size.
function resizeOnChange(){
	var height = document.getElementById("resultId").clientHeight;
	var width = document.getElementById("resultId").clientWidth;
	window.resizeTo(width, height);
}


function checkEnterKey(evt){
	  if (evt.keyCode == 13)
	    usnGeneration();
	  else 
		return true;
}


// Input: DDXXDDBBDDD
// Returns: BB ( Branch )
function getBranch(usn){
	var b = usn.split( /\d+/ );
	return b[2].toUpperCase();
}

// Input: Capital letter sentance
// Returns: Same sentance with starting letter of each word uppercase
function ucwords(str){
	return str.replace(/\w\S*/g, function(txt){
  	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

// Input: String of format "Nameofstudent (DAADDAADDD)"
// Returns : Name and USN Separately "NameOfStudent  DAADDAADDD".
function getNameUsn(usnName){
	var name = usnName.substring(0, usnName.indexOf('('));
  	var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
	var usn = aftBractket.substring(0, aftBractket.indexOf(')'));
  	return ucwords(name+'  '+usn);
}

//Return avg marks
function findAvg(usn, total, sem){
	//return ' '+total+' '+sem+' '+getBranch();
	//alert(' '+total+' '+sem+' '+getBranch(usn));
	return getAvgMarks(total, sem, getBranch(usn));
}

// Input: String of format "SubjectName (SUBJECTCODE)"
// Returns : SUBJECTCODE
function getScode(sub_name_code){
	return  sub_name_code.substring(sub_name_code.indexOf('(')+1, sub_name_code.indexOf(')'));
}

