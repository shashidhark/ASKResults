// Function to do all the processing. Resquest and Display result.

// Function to convert response string to HTMLDocument object.
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

function openAdvResult(usn){
	//alert("request");
	
	let url = "http://results.vtu.ac.in/vitavi.php";

	let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	request.onload = function(aEvent)
	{
		var str = DOM(aEvent.target.responseText);
		var all = $(str).find('td[width=513]').eq(0);
		//alert(all);
		var table = $(all).find('table');
		if(table.length!=0)//If USN exist in db
		{
			document.getElementById("name"+usn).setAttribute("value", getName($(all).find('B').eq(0).text()));
			document.getElementById("perc"+usn).setAttribute("value", findAvg(usn, getTotal(table), $(table).eq(0).find("tr").eq(0).find('td').eq(1).text()));
		
			if(($(table).eq(0).find("tr").eq(0).find('td').eq(3).text()).indexOf("FAIL") == -1){
				document.getElementById("stat"+usn).setAttribute("value", "PASS");
				document.getElementById("stat"+usn).setAttribute("style", "color:#087F38");
			}
			else{
				document.getElementById("stat"+usn).setAttribute("value", "FAIL");
				document.getElementById("stat"+usn).setAttribute("style", "color:#E30F17");
			}
		}
		else{
			document.getElementById("name"+usn).setAttribute("value", "Doesn't Exist");
			document.getElementById("perc"+usn).setAttribute("value", "---");
			document.getElementById("stat"+usn).setAttribute("value", "---");
		}
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

	document.getElementById('resultId').textContent = '';
	var resultId= document.getElementById("resultId");
	
	var place 	= document.createElement("vbox");
	place.setAttribute("flex", "1");
	place.setAttribute("style", "overflow:scroll; width:100%; height:200px;");

	var grid 	= document.createElement("grid");
	//listbox.setAttribute("width", "500");
	var columns = document.createElement("columns");
	var column0 = document.createElement("column");
	var column1 = document.createElement("column");
	var column2 = document.createElement("column");
	var column3 = document.createElement("column");
	var column4 = document.createElement("column");
	
	column0.setAttribute("flex", "1");
	column1.setAttribute("flex", "1");
	column2.setAttribute("flex", "1");
	column3.setAttribute("flex", "1");
	column4.setAttribute("flex", "1");

	columns.appendChild(column0);
	columns.appendChild(column1);
	columns.appendChild(column2);
	columns.appendChild(column3);
	columns.appendChild(column4);

	grid.appendChild(columns);
	place.appendChild(grid);	
	resultId.appendChild(place);

	var rows 	= document.createElement("rows");
	var status=1, row, label0, label1, label2, label4, label3;
	var u=0;
	for(var u=-1; u<usnList.length; u++)
	{
		row 	= document.createElement("row");
		label0 	= document.createElement("label");	
		label1 	= document.createElement("label");
		label2 	= document.createElement("label");
		label3 	= document.createElement("label");
		label4 	= document.createElement("label");
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

		row.appendChild(label0);
		row.appendChild(label1);
		row.appendChild(label2);
		row.appendChild(label3);
		row.appendChild(label4);

		rows.appendChild(row);
	}
	grid.appendChild(rows);
	for(u=0; u<usnList.length; u++)
	{	
		openAdvResult(usnList[u]);
	}	
}

