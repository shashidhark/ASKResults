// Function to do all the processing. Resquest and Display result.

// Function to convert response string to HTMLDocument object.

var strForText="";

function DOM(string){
 	const Cc = Components.classes;
 	const Ci = Components.interfaces;
	const Cu = Components.utils;
	const Cr = Components.results;
	var parser = Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
	return (parser.parseFromString(string, "text/html"));
}

function getName(usnName){
	var name = usnName.substring(0, usnName.indexOf('('));
  	var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
	var usn = aftBractket.substring(0, aftBractket.indexOf(')'));
  	return ucwords(name);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function getTotal(table){
	var s=0;
 	if(table.length > 3){
		var tr = $(table).eq(1).find("tr");
		for (var j = 1; j < tr.length; j++){
			var td = $(tr).eq(j).find('td');
			s += Number($(td).eq(3).text());
		}
	}
	else{
		s = Number($(table).eq(2).find("tr").eq(0).find('td').eq(3).text());
	}
	return s;
}
var p=0,f=0,t=0, fcd=0, fc=0, sc=0;
function writeToFile(data)
{
	data += "\n";	
	data += "Passed: "+p+"  Failed: "+f+" Percentage: "+((p/t)*100).toFixed(2)+"%"+" Total: "+t+"\n";	
	data += "FCD:"+fcd+" FC:"+fc+" SC:"+sc;
	// Get profile directory.
	Components.utils.import("resource://gre/modules/FileUtils.jsm");
	Components.utils.import("resource://gre/modules/NetUtil.jsm");
	var file = Components.classes["@mozilla.org/file/local;1"].
		       createInstance(Components.interfaces.nsILocalFile);
	var file = FileUtils.getFile("DfltDwnld", ["VTUResult_ASKResults.txt"]);

	// You can also optionally pass a flags parameter here. It defaults to
	// FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE;
	var ostream = FileUtils.openSafeFileOutputStream(file);

	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
		            createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var istream = converter.convertToInputStream(data);

	// The last argument (the callback) is optional.
	NetUtil.asyncCopy(istream, ostream, function(status) {
	  if (!Components.isSuccessCode(status)) {
		// Handle error!
		return;
	  }

	  // Data has been written to the file.
	});
	//document.getElementById('saveMsg').hidden = false;
	document.getElementById("sb").textContent="Saved to download folder..";
}

function writeToFile1()
{
	var data=strForTextI;
	// Get profile directory.
	Components.utils.import("resource://gre/modules/FileUtils.jsm");
	Components.utils.import("resource://gre/modules/NetUtil.jsm");
	var file = Components.classes["@mozilla.org/file/local;1"].
		       createInstance(Components.interfaces.nsILocalFile);
	var file = FileUtils.getFile("DfltDwnld", ["Individual_VTUResult_ASKResults.txt"]);

	// You can also optionally pass a flags parameter here. It defaults to
	// FileUtils.MODE_WRONLY | FileUtils.MODE_CREATE | FileUtils.MODE_TRUNCATE;
	var ostream = FileUtils.openSafeFileOutputStream(file);

	var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].
		            createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	converter.charset = "UTF-8";
	var istream = converter.convertToInputStream(data);

	// The last argument (the callback) is optional.
	NetUtil.asyncCopy(istream, ostream, function(status) {
	  if (!Components.isSuccessCode(status)) {
		// Handle error!
		return;
	  }

	  // Data has been written to the file.
	});
	document.getElementById('saveImsg').hidden=false;
	document.getElementById('print').hidden=true;
}

function incFail(){	
	document.getElementById("vf").setAttribute("value", ++f);
}

function incPass(){
	document.getElementById("vp").setAttribute("value", ++p);
}

function updatePerc(){
	document.getElementById("result").setAttribute("value", ((p/t)*100).toFixed(2)+"%");
	document.getElementById("vt").setAttribute("value", p+f);
	document.getElementById("fcd").setAttribute("value", fcd);
	document.getElementById("fc").setAttribute("value", fc);
	document.getElementById("sc").setAttribute("value", sc);
}

function getFailedSubjects(str){
	var s="";
	var tr = $(str).eq(1).find("tr");
	for (var j = 1; j < tr.length; j++){
		var td = $(tr).eq(j).find('td');
		if(($(td).eq(4).text()).indexOf("F") > -1 || ($(td).eq(4).text()).indexOf("A") > -1){
			//lbl = document.createElement("label");
			//lbl.setAttribute("value", "$(td).eq(0).text()");
			//tip.appendChild(lbl);
			s+="| "+$(td).eq(0).text()+" |";
		}
	}
	return s;
}

function getClass(str){
//	alert(str.match(/\b\w/g).join(''));
	return str.match(/\b\w/g).join('');
}

function incClass(s){
	if(s == 'RFCWD')
		fcd++;
	else if(s == 'RFC')
		fc++;
	else if(s == 'RSC')
		sc++;
}

var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                        .getService(Components.interfaces.nsIPromptService);

function openAdvResult(usn){
	//alert("request");	
	var fs="";
	var resultClass="";
	let url = "http://results.vtu.ac.in/vitavi.php";
	let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	request.onload = function(aEvent)
	{
		var str = DOM(aEvent.target.responseText);
		var all = $(str).find('td[width=513]').eq(0);
		//alert(all);
		strForText += usn+" : ";
		var name1;
		var table = $(all).find('table');
		if(table.length!=0)//If USN exist in db
		{	
			document.getElementById("name"+usn).setAttribute("value", getName($(all).find('B').eq(0).text()));
			name1 = getName($(all).find('B').eq(0).text());
			strForText += name1+" : ";

			document.getElementById("perc"+usn).setAttribute("value", findAvg(usn, getTotal(table), $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())+"%");
			strForText += findAvg(usn, getTotal(table), $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())+" : ";

			if(($(table).eq(0).find("tr").eq(0).find('td').eq(3).text()).indexOf("FAIL") == -1){
				resultClass = getClass($(table).eq(0).find("tr").eq(0).find('td').eq(3).text());
				incClass(resultClass);
				document.getElementById("stat"+usn).setAttribute("value", "PASS");
				strForText += "PASS \n";
				incPass();
				document.getElementById("stat"+usn).setAttribute("style", "color:#087F38");
			}
			else{fs="";
				document.getElementById("stat"+usn).setAttribute("value", "FAIL");
				strForText += "FAIL \n";
				incFail();				
				fs = getFailedSubjects(table);
				document.getElementById("stat"+usn).setAttribute("onclick", 'prompts.alert(null, "Failed Subjects", "USN:'+usn+' Name:'+name1+' Failed in: '+fs+'");');
				document.getElementById("stat"+usn).setAttribute("style", "color:#E30F17");
			}
		}
		else{
			document.getElementById("name"+usn).setAttribute("value", "Doesn't Exist");
			strForText += "Doesn't Exist \n";
			t--;
			document.getElementById("perc"+usn).setAttribute("value", "---");
			document.getElementById("stat"+usn).setAttribute("value", "---");
		}
		updatePerc();
		resizeOnChange();
	}; //request load end

	request.onerror = function(aEvent) {
	   //alert(aEvent.target.status);
	   //document.getElementById("resultId").textContent = "Check Internet connection. Error status : "+ aEvent.target.status;
		//resizeOnChange();
	};

	request.open("POST", url, true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send("rid="+usn+"&submit=SUBMIT");
}

function advancedSearch(usnList){
	p=0,t=0,f=0, fcd=0, fc=0, sc=0;
	var status=1, row, label0, label1, label2, label4, label3, lpass, lfail, vpass, vfail, vtotal, total, result;
	var vresult, hb, hbx, saveButton, vbx, bx,fcdv, fcv,fcdv1, fcv1, scv, scv1, noti;
	strForText = "\n";
	document.getElementById('resultId').textContent = '';

	var resultId= document.getElementById("resultId");
	bx 	= document.createElement("vbox");
	bx.setAttribute('class', 'rs');
	vbx 	= document.createElement("hbox");

	hbx 	= document.createElement("hbox");
	fcdv 	= document.createElement("label");
	fcdv.setAttribute('value', 'FCD:');
	fcv 	= document.createElement("label");
	fcv.setAttribute('value', 'FC:');
	scv 	= document.createElement("label");
	scv.setAttribute('value', 'SC:');
	fcdv1 	= document.createElement("label");
	fcdv1.setAttribute('value', '0');
	fcdv1.setAttribute('id', 'fcd');
	fcv1 	= document.createElement("label");
	fcv1.setAttribute('value', '0');		
	fcv1.setAttribute('id', 'fc');
	scv1 	= document.createElement("label");
	scv1.setAttribute('value', '0');		
	scv1.setAttribute('id', 'sc');
	hbx.appendChild(fcdv);
	hbx.appendChild(fcdv1);
	hbx.appendChild(fcv);
	hbx.appendChild(fcv1);
	hbx.appendChild(scv);
	hbx.appendChild(scv1);

	noti 	= document.createElement("label");	
	lpass 	= document.createElement("label");	
	lfail 	= document.createElement("label");
	vpass 	= document.createElement("label");
	vfail 	= document.createElement("label");
	result 	= document.createElement("label");
	vresult 	= document.createElement("label");
	total 	= document.createElement("label");
	vtotal 	= document.createElement("label");	

	noti.setAttribute('value', 'Click on FAIL to know failed subjects.');
	noti.setAttribute('style', 'color:blue');
	hb = document.createElement("description");
	hb.setAttribute("id", "sb");
	saveButton 	= document.createElement("button");
	saveButton.setAttribute("label", "Save");
	saveButton.setAttribute("class", "loadButton");
	saveButton.setAttribute("onclick", "writeToFile(strForText);");
	hb.appendChild(saveButton);

	lpass.setAttribute("value", "Passed:");
	lpass.setAttribute("class", "pass");
	vpass.setAttribute("value", '0');
	vpass.setAttribute("id", "vp");
	vpass.setAttribute("class", "pass");

	lfail.setAttribute("value", " Failed:");
	lfail.setAttribute("class", "fail");
	vfail.setAttribute("value", '0');
	vfail.setAttribute("id", "vf");
	vfail.setAttribute("class", "fail");
	vresult.setAttribute("value", " Percentage:");
	result.setAttribute("value", "0%");
	result.setAttribute("id", "result");

	total.setAttribute("value", " Total:");	
	vtotal.setAttribute("value", '0');
	t=usnList.length;
	vtotal.setAttribute("id", "vt");	
	
	vbx.appendChild(lpass);
	vbx.appendChild(vpass);
	vbx.appendChild(lfail);
	vbx.appendChild(vfail);
	vbx.appendChild(vresult);
	vbx.appendChild(result);
	vbx.appendChild(total);
	vbx.appendChild(vtotal);
	
	bx.appendChild(vbx);
	bx.appendChild(hbx);
	bx.appendChild(hb);
	bx.appendChild(noti);
	var place 	= document.createElement("hbox");
	place.setAttribute("flex", "1");
	place.setAttribute("style", "overflow:scroll; width:100%; height:300px; overflow-x: hidden;");

	var grid 	= document.createElement("grid");
	grid.setAttribute("flex", "1");
	//listbox.setAttribute("width", "500");
	var columns = document.createElement("columns");
	var column0 = document.createElement("column");
	var column1 = document.createElement("column");
	var column2 = document.createElement("column");
	var column3 = document.createElement("column");
	var column4 = document.createElement("column");
	var sp = document.createElement("spacer");

	column0.setAttribute("flex", "1");
	column1.setAttribute("flex", "1");
	column2.setAttribute("flex", "1");
	column3.setAttribute("flex", "1");
	column4.setAttribute("flex", "1");
	sp.setAttribute("flex", "1");

	columns.appendChild(column0);
	columns.appendChild(column1);
	columns.appendChild(column2);
	columns.appendChild(column3);
	columns.appendChild(column4);
	columns.appendChild(sp);

	grid.appendChild(columns);
	place.appendChild(grid);	
	bx.appendChild(place);

	var rows 	= document.createElement("rows");
	var u=0;
	for(var u=-1; u<usnList.length; u++)
	{
		row 	= document.createElement("row");
		label0 	= document.createElement("label");	
		label1 	= document.createElement("label");
		label2 	= document.createElement("label");
		label3 	= document.createElement("label");
		label4 	= document.createElement("label");
		sp = document.createElement("spacer");
		if(u==-1){
			label0.setAttribute("value", "Sl no");
			label0.setAttribute("style", "font-weight:bold");
			label1.setAttribute("value", "USN");
			label1.setAttribute("style", "font-weight:bold");
			label2.setAttribute("value", "Student Name");
			label2.setAttribute("style", "width:180px; font-weight:bold");
			label3.setAttribute("value", "Percentage");
			label3.setAttribute("style", "font-weight:bold");
			label4.setAttribute("value", "Result");
			label4.setAttribute("style", "font-weight:bold");
		}
		else{
			label0.setAttribute("value", u+1);
			label1.setAttribute("value", usnList[u]);
			label2.setAttribute("id", "name"+usnList[u]);
			label2.setAttribute("value", "Load..");
			label3.setAttribute("id", "perc"+usnList[u]);
			label3.setAttribute("value", "Load..");
			label4.setAttribute("id", "stat"+usnList[u]);
			label4.setAttribute("value", "Load..");
		}
		sp.setAttribute("flex", "1");
		row.appendChild(label0);
		row.appendChild(label1);
		row.appendChild(label2);
		row.appendChild(label3);
		row.appendChild(label4);
		row.appendChild(sp);
		rows.appendChild(row);
	}
	grid.appendChild(rows);
	resultId.appendChild(bx);
	for(u=0; u<usnList.length; u++)
	{	
		openAdvResult(usnList[u]);
	}	
}
