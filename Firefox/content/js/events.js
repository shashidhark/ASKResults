/*
|===============================================================================
|		Last Modified Date 	: 24/01/2015
|		Developer			: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: events.js
|			Description	:
|						Script for actual processing of the addon.
|						This page have the code to send request and display the result.
|
|===============================================================================
*/


var advancedGoingOn=0;

//Generate usn list for Advanced search
function usnGeneration(){
	var usnNew = "";
	var usnList=[];
	var f;

	//------------------------------------ Validation Starts here----------------------------------------------

	//Fields to compare if not seleted usn fields
	var ids = ['r0', 'r1', 'year', 'branch', 'r4', 'r5' ];
	for(f=0; f<6; f++)
	{
		if(f==2 || f>3){
			if(document.getElementById(ids[f]).value == ""){
				document.getElementById("resultId").textContent="Please check Year or USN Serial number ..";
				resizeOnChange();
				return;
			}		
		}
		else if(document.getElementById(ids[f]).label == "Region"){
			document.getElementById("resultId").textContent="Please enter USN ..";
			resizeOnChange();
			return;
		}
	}
	
	//Check the size of input value. Two numbers.
	var unum =	document.getElementById('r4').value.length;
	var unum2 =	document.getElementById('r5').value.length;
	if(unum2 > unum)//Find largest.
		unum=unum2;

	//Save limits in 2 variables
	var maxLimit = Number(document.getElementById('r5').value);
	var minLimit = Number(document.getElementById('r4').value);
	
	//Check limits
	if(maxLimit < minLimit){
		document.getElementById("resultId").textContent="First number must be smaller than second.";
		resizeOnChange();
		return;
	}

	//Check whether MTECH usn or BE
	var beTech = Number(document.getElementById('branch').label.length);
	if(beTech==3 && unum==3){
		document.getElementById("resultId").textContent="For mtech enter 2 digit number.";
		resizeOnChange();
		return;
	}
	else
		document.getElementById("resultId").textContent="";

	//---------------------------------------Validation Ends here --------------------------------
	//--------------------------------------------------------------------------------------------
	
	//Get all selected fields. 4 + SN + 13 + CS..
	for(f=0; f<6; f++){
		if(f==2)
			usnNew += document.getElementById(ids[f]).value;
		else
			usnNew += document.getElementById(ids[f]).label;
	}
	
	//Generate USNs
	for(var i=minLimit; i<=maxLimit; i++){
		if(beTech==2){		
			usnList.push(usnNew+get23D(i, 1));
		}	
		else{
			usnList.push(usnNew+get23D(i, 0));
		}
	}
	
	//Call search with usn_list
	advancedSearch(usnList);
}

function addYear()
{
	var desc = document.getElementById("d");
	
	//Check if already rendered. Call on changing college code.
	var yearExist = document.getElementById("year");
	if(yearExist == null)	
	{
		var yr=new Date().getFullYear()+'';
		yr= yr.match(/\d{2}$/);

		var menul = document.createElement("textbox");
		menul.setAttribute("value", yr);
		menul.setAttribute("id", "year");
		menul.setAttribute("class", "inputs1");
		menul.setAttribute("maxlength", "2");
		menul.setAttribute("size", "2");
		desc.appendChild(menul);
	
		menul = document.createElement("menulist");
		menul.setAttribute("class", "advSearch1");
		menul.setAttribute("id", "branch");	
		var menupp = document.createElement("menupopup");
		menul.appendChild(menupp);
		
		for (var key in fields['Branch']['BE'])
		//for(var r=0; r<fields['Branch']['BE'].length; r++)
		{
			var menui = document.createElement("menuitem");
			menui.setAttribute("label", key);	
			menui.setAttribute("tooltiptext", fields['Branch']['BE'][key]);	
			menupp.appendChild(menui);
		}

		for (var key in fields['Branch']['MTECH'])
		//for(var r=0; r<fields['Branch']['MTECH'].length; r++)
		{
			var menui = document.createElement("menuitem");
			menui.setAttribute("label", key);	
			menui.setAttribute("tooltiptext", fields['Branch']['MTECH'][key]);	
			menupp.appendChild(menui);
		}

		desc.appendChild(menul);	

		menul = document.createElement("menulist");
		menul.setAttribute("class", "advSearch1");
		menul.setAttribute("id", "sem");	

		menupp = document.createElement("menupopup");
		menul.appendChild(menupp);
	
		for(var r=1; r<=8; r++)
		{
			var menui = document.createElement("menuitem");
			menui.setAttribute("label", r);	
			menupp.appendChild(menui);
		}
		desc.appendChild(menul);
	
		var nums = document.createElement("textbox");
		nums.setAttribute("value", "");
		nums.setAttribute("class", "inputs1");
		nums.setAttribute("id", "r"+4);
		nums.setAttribute("maxlength", "3");
		nums.setAttribute("size", "2");
		desc.appendChild(nums);

		nums = document.createElement("label");
		nums.setAttribute("value", "to");
		desc.appendChild(nums);

		nums = document.createElement("textbox");
		nums.setAttribute("value", "");		
		nums.setAttribute("class", "inputs1");
		nums.setAttribute("id", "r"+5);
		nums.setAttribute("maxlength", "3");
		nums.setAttribute("size", "2");
		nums.setAttribute("onkeypress", "return checkEnterKey(event)");
		desc.appendChild(nums);

		var submitButton = document.createElement("button");
		submitButton.setAttribute("label", "Load Result");
		submitButton.setAttribute("class", "loadButton");
		submitButton.setAttribute("onclick", "usnGeneration()");
		desc.appendChild(submitButton);
	}
}

function keys(obj)
{
    var keys = [];

    for(var key in obj)
    {
        if(obj.hasOwnProperty(key))
        {
            keys.push(key);
        }
    }

    return keys;
}

function addCC(val){
	var desc = document.getElementById("d");
	var menul = document.getElementById("r1");
	var ccc = menul;
	var menupp = document.getElementById("cc");	
	//alert(val);
	if(menul != null){
		menul.removeChild(menupp);
	}
	//Here
	if(menul==null){
		menul = document.createElement("menulist");
		menul.setAttribute("id", "r1");		
	}

	var menupp = document.createElement("menupopup");
	menupp.setAttribute("id", "cc");

	menul.setAttribute("class", "advSearch1");
	menul.appendChild(menupp);
		

	
	var field = keys(fields['College Code'][Number(val)]).sort();
	//console.log(field);
	//alert(field);
	
	for(var r=0; r<field.length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", field[r]);
		menui.setAttribute("tooltip", "popup, delay=0");
		menui.setAttribute("tooltiptext", fields['College Code'][Number(val)][field[r]]);	
		menupp.appendChild(menui);
	}	
	if(ccc == null){
		menul.setAttribute("oncommand", "return addYear()");
		desc.appendChild(menul);
	}
	document.getElementById("r1").selectedIndex=0;//Select first item on changing 'region'
}

//Create ui for Advanced search
function createAdvanceUI(){

	document.getElementById("advance").textContent="";
	document.getElementById("resultId").textContent="";

	var advUI = document.getElementById("advance");

	var guid = document.createElement("label");
	guid.setAttribute("value", "Select Region Code, College Code, Year, Branch, Sem and USN Range");

	var vbox = document.createElement("vbox");
	vbox.appendChild(guid);	
	
	var desc = document.createElement("hbox");
	desc.setAttribute("id", "d");	
	vbox.appendChild(desc);

	var menul;
	
	menul = document.createElement("menulist");
	menul.setAttribute("class", "advSearch1");
	menul.setAttribute("id", "r0");	

	var menupp = document.createElement("menupopup");
	menul.appendChild(menupp);
	
	for (var key in fields['Region']) {
		var menui = document.createElement("menuitem");
		if(key==0){
			menui.setAttribute("label", "Region");
			//menui.setAttribute("tooltiptext", );
		}
		else{	
			menui.setAttribute("label", key);
			menui.setAttribute("tooltiptext", fields['Region'][key]);
		}
		menupp.appendChild(menui);
	}
	
	/*for(var r=0; r<fields['Region'].length; r++)
	{
		var menui = document.createElement("menuitem");
		menui.setAttribute("label", fields['Region'][r]);	
		menui.setAttribute("title", fields['Region'][r]);
		menupp.appendChild(menui);
	}*/
	
	menul.setAttribute("oncommand", "return addCC(this.label)");
	desc.appendChild(menul);

	advUI.appendChild(vbox);
}

function displayAdvUI(mode){
	//alert("hi");
	resizeOnChange();
	if(mode=='a'){		
		abortFunc();
		document.getElementById("normal").hidden=true;	
		document.getElementById("advance").hidden=false;	
		document.getElementById("msg").hidden=false;
		//document.getElementById("advSearch").label="Switch to Normal Search";
		
		document.getElementById("advanced").hidden=true;
		document.getElementById("normalMenu").hidden=false;
		document.getElementById("fileImp").hidden=false;	

		document.getElementById("reval").hidden=true;//Show revaluation option
		document.getElementById("print").hidden=true;
		document.getElementById("saveImsg").hidden=true;
		createAdvanceUI();
		
		//document.getElementById('box').hidden = true;	
		//document.getElementById('saveMsg').hidden = true;
	}
	else if(mode=='n'){		
		abortFunc();
		document.getElementById("reval").hidden=false; //Hide revaluation option
		document.getElementById("normal").hidden=false;	
		document.getElementById("advance").hidden=true;
		document.getElementById("msg").hidden=true;

		document.getElementById("advanced").hidden=false;
		document.getElementById("normalMenu").hidden=true;
		document.getElementById("fileImp").hidden=false;

		document.getElementById("resultId").textContent="";
		document.getElementById("print").hidden=true;
		document.getElementById("saveImsg").hidden=true;
		getMessage();		
		//document.getElementById('box').hidden = true;
		//document.getElementById('saveMsg').hidden = true;
	}
	resizeOnChange();
}

function fileImpUI()
{	
	abortFunc();
	document.getElementById("normalMenu").hidden=false;	
	document.getElementById("advanced").hidden=false;
	document.getElementById("fileImp").hidden=true;

	document.getElementById("advance").textContent="";
	document.getElementById("resultId").textContent="";
	document.getElementById("reval").hidden=true;
	document.getElementById("normal").hidden=true;
	document.getElementById("print").hidden=true;
	document.getElementById("advance").hidden=false;
	
	var advUI = document.getElementById("advance");

	var hbox = document.createElement("hbox");
	var button1 = document.createElement("button");
	button1.setAttribute("label", "Browse file");
	button1.setAttribute("id", "browseFile");
	button1.setAttribute("width", "100");
	button1.setAttribute("class", "loadButton");
	button1.setAttribute("onclick", "filePicker()");

	var button2 = document.createElement("button");
	button2.setAttribute("label", "Load Result");
	button2.setAttribute("id", "searchFile");
	button2.setAttribute("width", "100");
	button2.setAttribute("class", "loadButton");
	button2.setAttribute("onclick", "readFile()");

	var checkbx = document.createElement("checkbox");
	checkbx.setAttribute("id", "NbaReady");
	checkbx.setAttribute("label", "Performance Index (NBA)");		
		
	var msg = document.createElement("label");
	msg.setAttribute("value", "Choose .txt, .csv or .xls file containing USN list");

	var textbox = document.createElement("textbox");
	textbox.setAttribute("class", "inputs");
	textbox.setAttribute("id", "filePath");
//	textbox.setAttribute("onfocus", "filePicker()");
	
	advUI.appendChild(checkbx);
	advUI.appendChild(msg);
	hbox.appendChild(textbox);	
	hbox.appendChild(button1);
	hbox.appendChild(button2);
	advUI.appendChild(hbox);
	resizeOnChange();
}

//To focus the text box in addon
window.addEventListener("load", function focus_element(){
	window.removeEventListener("load", focus_element, false);
	document.getElementById('usn_id').focus()
}, false);

//Validate the input(usn)
function checkFormat(str){
	if(str.match(/^([0-9][A-Za-z][A-Za-z][0-9][0-9][A-Za-z][A-Za-z][0-9][0-9][0-9])$/g)){
		return true;
	}
	else if(str.match(/^([0-9][A-Za-z][A-Za-z][0-9][0-9][A-Za-z][A-Za-z][A-Za-z][0-9][0-9])$/g)){
		return true;
	}
	else{
		return false;
	}
}

//Result announcement
function getMessage(){

	abort.push("0");
	let url = "http://results.vtu.ac.in";
	var res = document.getElementById('resultId');
	var vb = document.createElement("vbox");
	vb.setAttribute("style", "border: #000000 solid 2px;");

	var index=abort.length-1;
	abort[index] = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	abort[index].onload = function(aEvent)
	{	

		var str = DOM(aEvent.target.responseText);
		var all = $(str).find('td[width=513]').eq(0);
		all = $(all).find('b').eq(0);
		str = $(all).html();
		var msgs = str.split("<br>");
		var lbl;
		for(var i=0;i<msgs.length;i++){
			if(msgs[i].indexOf("Enter") > -1)
				break;
			else  if(msgs[i]!=""){
				msgs[i] = msgs[i].replace('&amp;', ' & ');
				lbl = document.createElement("label");
				lbl.setAttribute("value", msgs[i]);
				vb.appendChild(lbl);
			}
		}
		res.appendChild(vb);
		resizeOnChange();
	}; //request load end

	abort[index].onerror = function(aEvent) {
	   //window.alert("Error Status: " + aEvent.target.status);
	   document.getElementById('resultId').textContent = "Check Internet connection. Error status : "+ aEvent.target.status;
	};

	abort[index].open("GET", url, true);
	abort[index].setRequestHeader("Content-type","application/x-www-form-urlencoded");
	abort[index].send();
}

var rv=0;
function fetchTable(str, usn)
{
	var all = $(str).find('td[width=513]').eq(0);
		//alert(all);
	var table = $(all).find('table');
		
		//return str;
		//alert(aEvent.target.responseText);
		//These lines tetch the table fields fron HTMLDocument object.
	document.getElementById('resultId').textContent = '';

	var aBox = document.getElementById("resultId");
	var vbox = document.createElement("vbox");
	vbox.setAttribute("pack", "center");
	vbox.setAttribute("style", "border: #000000 solid 2px;");
	aBox.appendChild(vbox);

	var grid = document.createElement("grid");
	grid.setAttribute("flex", "1");
	var rows = document.createElement("rows");

	var row1 = document.createElement("row");
	var row2 = document.createElement("row");
	var row3 = document.createElement("row");
	var name1 = document.createElement("label");
	var sem1 = document.createElement("label");
	var status1 = document.createElement("label");
	var totalt = document.createElement("label");

	var all = $(str).find('td[width=513]').eq(0);
	var table = $(all).find('table');
	//alert(table);
	if(($(table).eq(0).find("tr").eq(0).find('td').eq(3).text()).indexOf("FAIL") == -1){
		//if(adv==1)	return 1;
		grid.setAttribute("style", "background-color:"+passColor);		
	}
	else{
		//if(adv==1)	return 0;
		grid.setAttribute("style", "background-color:"+failColor);
	}
	pdfVar='<!DOCTYPE html><html><body><table><tr><td>name</td><td>total</td></tr>';
	if(table.length==0){
		document.getElementById('resultId').textContent = 'Results are not yet available for this university seat number or Wrong USN..';
		document.getElementById('print').hidden=true;
		document.getElementById('saveImsg').hidden=true;
		resizeOnChange();
	}
	else
	{
		document.getElementById('print').hidden=false;
		document.getElementById('saveImsg').hidden=true;
		name1.setAttribute('value', "Name: "+getNameUsn($(all).find('B').eq(0).text()));
		name1.setAttribute("style", "font-weight:bold;");
		strForTextI += "Name: "+getNameUsn($(all).find('B').eq(0).text()) +"\n";
		pdfVar+='<tr><td>'+$(all).find('B').eq(0).text()+'</td>';

		var s=0;
		if(rv==0){
			s=getTotal(table);
		}else{
			for (var i = 3; i < table.length; i++){
			 	//	alert($(table).eq(j).html());
				var tr = $(table).eq(i).find("tr");
				for (var j = 0; j < tr.length; j++){
					var td = $(tr).eq(j).find('td');
					s += Number($(td).eq(4).text());
				}
			}
		}
		totalt.setAttribute('value', "Total: "+s);
		//alert(s);
	}
	strForTextI += "Total: "+s+"\n";
   	pdfVar+='<td>'+s+'</td></tr></table><table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Semester</td><td>';
	totalt.setAttribute("style", "font-weight:bold");
	status1.setAttribute('value', ""+$(table).eq(0).find("tr").eq(0).find('td').eq(3).text());
	status1.setAttribute("style", "font-weight:bold");
	var semPerc = "Semester:  "+$(table).eq(0).find("tr").eq(0).find('td').eq(1).text();
	
	strForTextI += replaceUnwantedChar($(table).eq(0).find("tr").eq(0).find('td').eq(3).text())+"\n";
	strForTextI += "Semester: "+$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+"\n";
	//pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+'</td><td>';
	//alert($(table).eq(0).find("tr").eq(0).find('td').eq(1).text());
	
	pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+'</td><td>';
	pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(3).find('b').text()+'</td></tr></table>';
	var perc='';
	var avg;
	if((avg = findAvg(usn, s, $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())) != ''){
		perc = "Percentage: "+avg+"%";
	}
	strForTextI += "Percentage: "+avg+"% \n\n";
	//alert(perc);
	sem1.setAttribute('value', semPerc+'   '+perc);
	sem1.setAttribute("style", "font-weight:bold");
	//alert(pdfVar);
	vbox.appendChild(grid);
	grid.appendChild(rows);
	rows.appendChild(row1);
	rows.appendChild(row2);
	rows.appendChild(row3);
	row1.appendChild(name1);
	row2.appendChild(sem1);
	row2.appendChild(totalt);
	row2.appendChild(status1);

	var sp = document.createElement("spacer");
	sp.setAttribute("flex", "1");
	vbox.appendChild(sp);
	//alert(table.length);
	var row11, lbl;
	//alert(pdfVar);
	if(rv == 0){
		for (var i=1; i < table.length-1; i++){
			pdfVar+='<table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
			var grid2 = document.createElement("grid");
			grid2.setAttribute("flex", "1");
			grid2.setAttribute("style", "border: #000000 solid 1px;");
			vbox.appendChild(grid2);

			var rows1 = document.createElement("rows");
			grid2.appendChild(rows1);
			//Store repeated subject codes
			var scodes=[];
			var tr = $(table).eq(i).find("tr");
			for (var j = 0; j < tr.length; j++){
			 	//To avoid repeated subjecs
				if(getScode($(tr).eq(j).find('td').eq(0).text())!=""){
					if(scodes.indexOf(getScode($(tr).eq(j).find('td').eq(0).text()))!=-1){
						continue;
					}
					else{
						scodes.push(getScode($(tr).eq(j).find('td').eq(0).text()));
					}
				}
				//alert(scodes);
				pdfVar+='<tr>';
       			row11 = document.createElement("row");
				if(j==0)
					row11.setAttribute("style", "font-weight:bold; background-color:"+tableHead);
				else
					row11.setAttribute("style", "background-color:"+marksRow);

				var td = $(tr).eq(j).find('td');
				for (var k = 0; k < td.length; k++){
					lbl = document.createElement("label");
					if($(td).eq(k).text() != ""){
						lbl.setAttribute("value", $(td).eq(k).text());
						pdfVar+='<td>'+$(td).eq(k).text()+'</td>';
						if($(td).eq(k).text().indexOf("Result") > -1)
							strForTextI += replaceUnwantedChar($(td).eq(k).text())+", ";
						else
							strForTextI += $(td).eq(k).text()+", ";
					}
					row11.appendChild(lbl);
				}
				strForTextI += "\n";
				if(($(td).eq(4).text()).indexOf("F") > -1 || ($(td).eq(4).text()).indexOf("A") > -1)
				{
					row11.setAttribute("style", "background-color:"+failedSub+"; color:red");
				}
				if(($(td).eq(3).text()).indexOf("FAIL") > -1)
					row11.setAttribute("style", "background-color:"+failColor+";");
				else if(($(td).eq(3).text()).indexOf("CLASS") > -1 || ($(td).eq(3).text()).indexOf("PASS") > -1)
					row11.setAttribute("style", "background-color:"+passColor+";");

				rows1.appendChild(row11);
				pdfVar+='</tr>';
			}
			pdfVar+='</table>';
		}
	}else{
	
		var grid2 = document.createElement("grid");
		grid2.setAttribute("flex", "1");
		grid2.setAttribute("style", "border: #000000 solid 1px;");
		vbox.appendChild(grid2);

		var row11;
		var rows1 = document.createElement("rows");
		var heads = ['Subject', 'Ext Old', 'Ext New', 'Internal', 'Total', 'Result'];
		grid2.appendChild(rows1);
		row11 = document.createElement("row");
		row11.setAttribute("style", "font-weight:bold; background-color:"+tableHead);
		for(i=0; i<heads.length;i++){
			lbl = document.createElement("label");
			lbl.setAttribute("value", heads[i]);
			row11.appendChild(lbl);
		}
		rows1.appendChild(row11);
		//TODO create table head in the above for-loop .. 
		pdfVar+='<table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
		pdfVar+='<tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
		//alert(table.length);
		var prv=0;
		for(var i=3; i < table.length; i++)
		{			
			row11 = document.createElement("row");
			var tr = $(table).eq(i).find("tr");
			//alert(tr.html());
			//Check if new sem is met
			if($(tr).eq(0).find('td').eq(0).text().indexOf("Subject")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("Old")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("External")!=-1)
			{
				if(prv==0)
				{ 
					pdfVar += "</tr></table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr>";
				}
			}
			else {
				pdfVar+='<tr>';
				prv=1;
			}

				//Skip unwanted rows. If new sem in revaluation
			if($(tr).eq(0).find('td').eq(0).text().indexOf("Subject")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("Old")!=-1 || $(tr).eq(0).find('td').eq(0).text().indexOf("External")!=-1)
			{ 
				continue;  
			}
			for (var j = 0; j < tr.length; j++){
			//alert($(tr).eq(j).find('td').eq(0).text());
				var semSet=0;
				if($(tr).eq(j).find('td').eq(0).text().indexOf("Semester")!=-1){
					pdfVar += "</table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Semester:</td>";semSet=1;
				} 
				var td = $(tr).eq(j).find('td');
				for (var k = 0; k < td.length; k++){
					lbl = document.createElement("label");
					if($(td).eq(k).text() != ""){
						//alert($(td).eq(k).text());
						lbl.setAttribute("value", $(td).eq(k).text());
						pdfVar+='<td>'+$(td).eq(k).text()+'</td>';
						strForTextI += $(td).eq(k).text()+", ";
					}
					row11.appendChild(lbl);
				}
				strForTextI += "\n";
				//alert(pdfVar);
				if(($(td).eq(5).text()).indexOf("F") > -1 || ($(td).eq(5).text()).indexOf("A") > -1)//Absent and Fail
				{
					row11.setAttribute("style", "background-color:"+failedSub+"; color:red");
				}
				else
					row11.setAttribute("style", "background-color:#F5F7CB;");
		
				if(semSet==1)
				{ // If new sem in revaluation met, then check for fail or pass to set color 
					if(($(td).eq(3).text()).indexOf("FAIL") > -1)
						row11.setAttribute("style", "background-color:"+failColor+";");
					else if(($(td).eq(3).text()).indexOf("CLASS") > -1 || ($(td).eq(3).text()).indexOf("PASS") > -1)
						row11.setAttribute("style", "background-color:"+passColor+";");
					
					pdfVar+="</tr></table><table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>";
				}
				else if(prv == 1){
					pdfVar+='</tr>';
				}
			}
			rows1.appendChild(row11);
		}
		pdfVar+='</table>';
	}
	rv=0;
}

function fetchTableAdv(str, usn){
	strForTextI+="\n\n";
	var all = $(str).find('td[width=513]').eq(0);
	var s=0;
		//alert(all);
	var table = $(all).find('table');
	var all = $(str).find('td[width=513]').eq(0);
	var table = $(all).find('table');
	
	if(table.length==0){
	}
	else
	{
		strForTextI += "Name: "+getNameUsn($(all).find('B').eq(0).text()) +"\n";
		s=0;
		s=getTotal(table);
	}

	strForTextI += "Total: "+s+"\n";
	strForTextI += replaceUnwantedChar($(table).eq(0).find("tr").eq(0).find('td').eq(3).text())+"\n";
	strForTextI += "Semester: "+$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+"\n";

	var perc='';
	var avg;
	if((avg = findAvg(usn, s, $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())) != ''){
		perc = "Percentage: "+avg+"%";
	}
	strForTextI += "Percentage: "+avg+"% \n\n";
	
	var i=1;
	//for (var i=1; i < table.length-1; i++){
		//Store repeated subject codes
		var scodes=[];
		var tr = $(table).eq(i).find("tr");
		for (var j = 0; j < tr.length; j++){
		 	//To avoid repeated subjecs
			if(getScode($(tr).eq(j).find('td').eq(0).text())!=""){
				if(scodes.indexOf(getScode($(tr).eq(j).find('td').eq(0).text()))!=-1){
					continue;
				}
				else{
					scodes.push(getScode($(tr).eq(j).find('td').eq(0).text()));
				}
			}
			var td = $(tr).eq(j).find('td');
			for (var k = 0; k < td.length; k++){
				if($(td).eq(k).text() != ""){
					strForTextI += $(td).eq(k).text()+", ";
				}
			}
			strForTextI += "\n";
		}
	//}
	return strForTextI;
}

function openResult(usn){

// you don't know when version will be populated
/*--------->>>
	var prefs;
		prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.ASKResults.");
		prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);
		alert(prefs.getCharPref('firstrun'));
//------->>>>>>*/
	strForTextI="";
	
	document.getElementById('print').hidden=true;
	document.getElementById('saveImsg').hidden=true;

	if(usn.length==0){
		document.getElementById('resultId').textContent = "Please Enter Your USN...";
		document.getElementById('usn_id').setAttribute("style", "border:1px solid red");
		resizeOnChange();
		return;
	}
	else if(!checkFormat(usn)){
		document.getElementById('resultId').textContent = "Check USN format...";
		//document.getElementById('resultId').setAttribute("style", "color:red");
		document.getElementById('usn_id').setAttribute("style", "border:1px solid red");
		resizeOnChange();
		return;
	}

	document.getElementById('usn_id').setAttribute("style", "border:1px solid blue");

	document.getElementById('resultId').textContent = '';
	var place= document.getElementById("resultId");
	var phbox = document.createElement("hbox");
	var pbar = document.createElement("progressmeter");
	pbar.setAttribute("mode", "undetermined");
 	phbox.appendChild(pbar);
	place.appendChild(phbox);
	resizeOnChange();

	  let url;
	  var rg = document.getElementById("reval");
	  if(rg.checked){
		rv=1;
		url = "http://results.vtu.ac.in/vitavireval.php";
	  }
	  else{
		url = "http://results.vtu.ac.in/vitavi.php";
	  }

	let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	request.onload = function(aEvent)
	{	
		//Call to DOM function.. To convert string to HTMLDocument object.
		var str = DOM(aEvent.target.responseText);
		fetchTable(str, usn);	

		resizeOnChange();
	}; //request load end

	request.onerror = function(aEvent) {
	   //window.alert("Error Status: " + aEvent.target.status);
	   document.getElementById('resultId').textContent = "Check Internet connection. Error status : "+ aEvent.target.status;
	   document.getElementById('print').hidden=true;
	   document.getElementById('saveImsg').hidden=true;
	};

	request.open("POST", url, true);
	request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	request.send("rid="+usn+"&submit=SUBMIT");
}


window.addEventListener("load", function() {
	const KEY_ENTER = 13;
  	const KEY_ESCAPE = 27;
	var textbox = document.getElementById("usn_id");
	function keyPressed(e) {
	  switch (e.keyCode) {
	    case KEY_ENTER:
					openResult(textbox.value);
				break;
		}
	}
	textbox.addEventListener('keyup', keyPressed, true);
	
	//printPdf.addEventListener('click', print, true);

}, false);
