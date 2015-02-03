/*
	Functions
*/

//Global variables

// nsIHTTPRequest references.
var abort=[];

// File write string
var strForText="";  // Adv
var strForTextI=""; // Normal

//Error
var errorMsg = 'Please choose the proper file format contains University Seat Number (USN)';

//Files allowed
var fileAllowed = ['csv', 'txt', 'xls'];

// Result table detail count line p->PASS f->FAIL ..
var p=0,f=0,t=0, fcd=0, ab=0, fc=0, sc=0, total_sub=0;

// If subjects already read or not in advanced search
var staken=0;

// Subject code list. Used as ID for labels
var scodes=[];

// pdf Write. Not used yet
var pdfVar;

//
//Color
var passColor='#087F38', failColor='#E30F17' ;
var marksRow ='#F0FFF0', tableHead='#90B890', failedSub='#FFCCCC';

function getAdvancedFileName(){
	var d = new Date();
	return "VTUResult_ASKResults"+(d.toUTCString()).replace(' ', '_')+".csv";
}

function getNormalFileName(){
	var d = new Date();
	return "Individual_List_VTUResult_ASKResults"+(d.toUTCString()).replace(' ', '_')+".csv";
}

function getSingleFileName(){
	var d = new Date();
	return "Individual_VTUResult_ASKResults"+(d.toUTCString()).replace(' ', '_')+".csv";
}

function readFile()
{
	resizeOnChange();
	var file=document.getElementById("filePath").value;
	if(document.getElementById("filePath").value == ""){
		document.getElementById('resultId').textContent="Please choose the file";
	}		
	else {
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
			if(data==null)
			{
				document.getElementById('resultId').textContent = errorMsg;
			}
			else{
				advancedSearch(data);
			}
		});	
	}	
	resizeOnChange();
}

function filePicker()
{
	advancedGoingOn=1;
	document.getElementById('resultId').textContent = "";
	document.getElementById('searchFile').disabled=false;
	document.getElementById("filePath").value="";
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
      var fnameArr = path.split('/');
	  var fname = fnameArr[fnameArr.length-1];
	  //alert(fname);
	  var ext1 = fname.split('.');
	  ext1 = ext1[ext1.length-1];
	  if(fname.indexOf('.') == -1){
		 document.getElementById("filePath").value="file://"+path;
	  }
      else if(fileAllowed.indexOf(ext1)!= -1){
		 document.getElementById("filePath").value="file://"+path;
	  }
	  else{
	     document.getElementById('resultId').textContent = errorMsg;
      }
	}
	resizeOnChange();
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
	var width = 700;
	var height = document.getElementById("resultId").clientHeight;
	//var width = document.getElementById("resultId").clientWidth;
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

//Abort on switching
function abortFunc(){
	var len;	
	len=abort.length;
	if(len!=0){
		for(var i=0; i<len; i++)
			abort[i].abort();
		abort=[];
	}
}

