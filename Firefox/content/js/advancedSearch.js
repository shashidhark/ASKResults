/*
|===============================================================================
|		Last Modified Date 	: 24/01/2015
|		Developer			: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: advancedSearch.js
|			Description	:
|			 Function to do all the processing. Resquest and Display result.
|			 Function to convert response string to HTMLDocument object.
|
|===============================================================================
*/

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

function getSubjects(str){
	staken=1;
	var treeitem, treecell1, treecell2, treecell3, treecell4, treecell5, treerow;
	var subl, scode;
	var treechildren = document.getElementById("treeChild");
	var tr = $(str).eq(1).find("tr");
	for (var j = 1; j < tr.length; j++){
		var td = $(tr).eq(j).find('td');
		scode = getScode($(td).eq(0).text());
		if(scodes.indexOf(scode) == -1){
			total_sub++;
			scodes.push(scode);
			snames.push(getSname($(td).eq(0).text()));
			NbaSubjectWiseResult[scode]=[0,0,0,0];
			treeitem 	= document.createElement("treeitem");
			treerow 	= document.createElement("treerow");	
			treecell1 	= document.createElement("treecell");
			treecell2 	= document.createElement("treecell");
			treecell3 	= document.createElement("treecell");
			treecell4 	= document.createElement("treecell");
			treecell5	= document.createElement("treecell");

			treecell1.setAttribute("label", $(td).eq(0).text());
			treecell1.setAttribute("id", "sub"+scode);			
			treecell2.setAttribute("label", "0");
			treecell2.setAttribute("id", "subP"+scode);			
			treecell3.setAttribute("label", "0");
			treecell3.setAttribute("id", "subF"+scode);			
			treecell4.setAttribute("label", "0");
			treecell4.setAttribute("id", "subA"+scode);
			treecell5.setAttribute("label", "0");
			treecell5.setAttribute("id", "subPerc"+scode);
	
			treerow.appendChild(treecell1);
			treerow.appendChild(treecell2);
			treerow.appendChild(treecell3);
			treerow.appendChild(treecell4);
			treerow.appendChild(treecell5);
			treeitem.appendChild(treerow);
			treechildren.appendChild(treeitem);
		}
	}
}

function writeToFileIndividual()
{
	strForTextI = strForTextI.replace(/[┬á]/g, '');
	var data=strForTextI;
	// Get profile directory.
	Components.utils.import("resource://gre/modules/FileUtils.jsm");
	Components.utils.import("resource://gre/modules/NetUtil.jsm");

	var fileName="";
	if(advancedGoingOn==1)
		fileName = getNormalFileName();	
	else
		fileName = getSingleFileName();	

	var file = Components.classes["@mozilla.org/file/local;1"].
		       createInstance(Components.interfaces.nsILocalFile);
	var file = FileUtils.getFile("DfltDwnld", [fileName]);

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

	if(advancedGoingOn==1){
		document.getElementById('saveImsg').hidden=true;
		document.getElementById('print').hidden=true;
	}
	else{
		document.getElementById('saveImsg').hidden=false;
		document.getElementById('print').hidden=true;
	}
}

function writeToFile(data)
{
	data += "\n NBA Ready \n";	
	data += "Subjects,Passed,Failed,Absent,Percentage\n"
	for (var j = 0; j < total_sub; j++){
		data += document.getElementById("sub"+scodes[j]).getAttribute("label")+",";
		data += document.getElementById("subP"+scodes[j]).getAttribute("label")+",";		
		data += document.getElementById("subF"+scodes[j]).getAttribute("label")+","
		data += document.getElementById("subA"+scodes[j]).getAttribute("label")+",";
		data += document.getElementById("subPerc"+scodes[j]).getAttribute("label")+"\n";
	}
	data += "\n";
	data += "Passed: "+p+" , Failed: "+f+", Absent:"+ab+", Percentage: "+(document.getElementById("result").value)+", Total: "+(document.getElementById("vt").value)+"\n";	
	data += "FCD:"+fcd+", FC:"+fc+", SC:"+sc;

	if(fileFetch==1){
		//Performancs index start
		var PerInd=0, nbaAb, fail1, pass1;
		var x="\n\nSubject Name,Subject Code,FCD,FC,SC,PASS,Performance Index\n";
		for(var i=0; i<total_sub; i++){
			x+=snames[i]+","+scodes[i]+", ";
			for (var j=0;j<4;j++){
				//if(j==0)
				//alert(NbaSubjectWiseResult[scodes[i]][j]);
				x+=NbaSubjectWiseResult[scodes[i]][j]+", ";
			}
			PerInd=4*(NbaSubjectWiseResult[scodes[i]][0])+3*(NbaSubjectWiseResult[scodes[i]][1])+2*(NbaSubjectWiseResult[scodes[i]][2])+NbaSubjectWiseResult[scodes[i]][3];
			//x+=PerInd;
			pass1 = Number(document.getElementById("subP"+scodes[i]).getAttribute("label"));
			fail1 = Number(document.getElementById("subF"+scodes[i]).getAttribute("label"));
			nbaAb = Number(document.getElementById("subA"+scodes[i]).getAttribute("label"))
			//alert(k);
			PerInd=PerInd/(4*(pass1+fail1-nbaAb));
			x+=PerInd.toFixed(2)+"\n";
		}
	
		//Performancs index END
		//alert(x);
		data+=x;
	}
	//data = data.replace(/[┬á]/g, '');
	
	// Get profile directory.
	Components.utils.import("resource://gre/modules/FileUtils.jsm");
	Components.utils.import("resource://gre/modules/NetUtil.jsm");

	var file = Components.classes["@mozilla.org/file/local;1"].
		       createInstance(Components.interfaces.nsILocalFile);
	var fileName="";
	fileName = getAdvancedFileName();
	var file = FileUtils.getFile("DfltDwnld", [fileName]);

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
	//document.getElementById('saveMsg').hidden = false;saveAdvButton
	document.getElementById("saveAdvButton").hidden=true;
	document.getElementById("noti").hidden=false;
	writeToFileIndividual();
}

function incFail(){	
	document.getElementById("vf").setAttribute("value", ++f);
}

function incPass(){
	document.getElementById("vp").setAttribute("value", ++p);
}

function updatePerc(){
	document.getElementById("result").setAttribute("value", ((p/(p+f))*100).toFixed(2)+"%");
	document.getElementById("vt").setAttribute("value", p+f);
	document.getElementById("fcd").setAttribute("value", fcd);
	document.getElementById("fc").setAttribute("value", fc);
	document.getElementById("sc").setAttribute("value", sc);
}

function getFailedSubjects(str){
	var s="", v=0;
	var tr = $(str).eq(1).find("tr");
	for (var j = 1; j < tr.length; j++){
		var td = $(tr).eq(j).find('td');
		if(($(td).eq(4).text()).indexOf("F") > -1 || ($(td).eq(4).text()).indexOf("A") > -1){
			s+="| "+$(td).eq(0).text()+" |";
		}
	}
	return s;
}

function getSubjectsStatus(str){
	var s="", v=0, scode="", nbaClass, pass1, fail1, ab1, abVal;
	var tr = $(str).eq(1).find("tr");
	//alert(str);
	for (var j = 1; j < tr.length; j++)
	{
		var td = $(tr).eq(j).find('td');
		scode = getScode($(td).eq(0).text());
	
		if(($(td).eq(4).text()).indexOf("P") > -1){
			v=Number(document.getElementById("subP"+scode).getAttribute("label"));
			v++;	
			document.getElementById("subP"+scode).setAttribute("label", v);
		}
		else if(($(td).eq(4).text()).indexOf("F") > -1){	
			v=Number(document.getElementById("subF"+scode).getAttribute("label"));
			v++;
			document.getElementById("subF"+scode).setAttribute("label", v);
		}
		else if(($(td).eq(4).text()).indexOf("A") > -1){
			v=Number(document.getElementById("subA"+scode).getAttribute("label"));
			v++;
			document.getElementById("subA"+scode).setAttribute("label", v);
			ab++;
		}	
		//alert(document.getElementById("subP"+j).value+" "+(p+f)+" "+parseInt(document.getElementById("subP"+j).value)/(p+f))*100).toFixed(2)+"%");
		//alert((p+f)+" "+(parseInt(document.getElementById("subP"+j).value))+" "+((parseInt(document.getElementById("subP"+j).value)/(p+f))*100).toFixed(2)+"%");
		abVal = Number(document.getElementById("subA"+scode).getAttribute("label"));
		pass1 = Number(document.getElementById("subP"+scode).getAttribute("label"));
		fail1 = Number(document.getElementById("subF"+scode).getAttribute("label"));
		document.getElementById("subPerc"+scode).setAttribute("label", ((pass1/(pass1+fail1-abVal))*100).toFixed(2)+"%");
		
		nbaClass=getNbaClass($(td).eq(3).text());
		if(nbaClass=="FCD")
			NbaSubjectWiseResult[scode][0]++;
		else if(nbaClass=="FC")
			NbaSubjectWiseResult[scode][1]++;
		else if(nbaClass=="SC")
			NbaSubjectWiseResult[scode][2]++;
		else if(nbaClass=="PASS")
			NbaSubjectWiseResult[scode][3]++;
	}
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

function openAdvResult(usn){
	
	NbaSubjectWiseResult={};

	var sem=0;
	if(document.getElementById('sem') != null)
		sem = document.getElementById('sem').label;
	else{
		fileFetch=1;
		sem=0;
	}
	var fs="";
	var resultClass="";
	let url = "http://results.vtu.ac.in/vitavi.php";

	document.getElementById("saveAdvButton").hidden=true;
	document.getElementById("noti").hidden=true;
	resizeOnChange();

	var index=abort.length-1;
	abort[index] = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
	abort[index].onload = function(aEvent)
	{		
		document.getElementById("saveAdvButton").hidden=false;
		document.getElementById("noti").hidden=true;
		var str = DOM(aEvent.target.responseText);
		var all = $(str).find('td[width=513]').eq(0);
		//alert(all);
		var name1;
		var table = $(all).find('table');
		if(table.length!=0)//If USN exist in db
		{		
			//alert("name"+usn);
			//alert(sem+" "+parseInt($(table).eq(0).find("tr").eq(0).find('td').eq(1).text()));
			if((sem == parseInt($(table).eq(0).find("tr").eq(0).find('td').eq(1).text())) || (fileFetch==1))
			{	
				strForText += usn+" , ";
				document.getElementById("name"+usn).setAttribute("label", getName($(all).find('B').eq(0).text()));
				
				name1 = getName($(all).find('B').eq(0).text());
				strForText += name1+" , ";

				document.getElementById("perc"+usn).setAttribute("label", parseFloat(findAvg(usn, getTotal(table), $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())));
				strForText += findAvg(usn, getTotal(table), $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())+" , ";

				//if(staken==0)
					getSubjects(table);

				if(($(table).eq(0).find("tr").eq(0).find('td').eq(3).text()).indexOf("FAIL") == -1){
					resultClass = getClass($(table).eq(0).find("tr").eq(0).find('td').eq(3).text());
					incClass(resultClass);
					document.getElementById("stat"+usn).setAttribute("label", "PASS");
					strForText += "PASS \n";
					incPass();
					document.getElementById("stat"+usn).setAttribute("property", "pass");
				}
				else{
					fs="";
					document.getElementById("stat"+usn).setAttribute("label", "FAIL");
					strForText += "FAIL,";
					incFail();									
					fs = getFailedSubjects(table);
					strForText += fs.replace('|', ' ')+"\n";
				}				
				getSubjectsStatus(table);
				fetchTableAdv(str, usn);
			}
			else{
				document.getElementById("name"+usn).setAttribute("label", "Other sem");
				document.getElementById("perc"+usn).setAttribute("label", "---");
				document.getElementById("stat"+usn).setAttribute("label", "---");
			}
		}
		else{
			document.getElementById("name"+usn).setAttribute("label", "Doesn't Exist");
			//strForText += "Doesn't Exist \n";
			t--;
			document.getElementById("perc"+usn).setAttribute("label", "---");
			document.getElementById("stat"+usn).setAttribute("label", "---");
		}	
		updatePerc();
		//resizeOnChange();
	}; //request load end

	abort[index].onerror = function(aEvent) {
	   //alert(aEvent.target.status);
	   document.getElementById("resultId").textContent = "Check Internet connection. Error status : "+ aEvent.target.status;
	   resizeOnChange();
	};

	abort[index].open("POST", url, true);
	abort[index].setRequestHeader("Content-type","application/x-www-form-urlencoded");
	abort[index].send("rid="+usn+"&submit=SUBMIT");
}

function advancedSearch(usnList)
{
	strForTextI="";
	advancedGoingOn=1;
	p=0,t=0,f=0, fcd=0, ab=0, fc=0, sc=0, staken=0;
	//For subject load
	scodes=[];
	snames=[];
	total_sub=0;

	var status=1, row, label0, lpass, lfail, vpass, vfail, vtotal, total, result;
	var vresult, hb, hbx, saveButton, vbx, bx,fcdv, fcv,fcdv1, fcv1, scv, scv1, noti,spacer;
	strForText = "";
	document.getElementById('resultId').textContent = '';

	abortFunc();

	var resultId= document.getElementById("resultId");
	bx 	= document.createElement("vbox");
	bx.setAttribute("style", "width:100%;");
	bx.setAttribute('class', 'rs');
	vbx 	= document.createElement("hbox");
	vbx.setAttribute("style", "width:100%;");

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
	vbx.appendChild(fcdv);
	vbx.appendChild(fcdv1);
	vbx.appendChild(fcv);
	vbx.appendChild(fcv1);
	vbx.appendChild(scv);
	vbx.appendChild(scv1);

	//noti 	= document.createElement("label");	
	lpass 	= document.createElement("label");	
	lfail 	= document.createElement("label");
	vpass 	= document.createElement("label");
	vfail 	= document.createElement("label");
	result 	= document.createElement("label");
	vresult = document.createElement("label");
	total 	= document.createElement("label");
	vtotal 	= document.createElement("label");	

	//noti.setAttribute('value', 'Click on FAIL to know failed subjects.');
	//noti.setAttribute('style', 'color:blue');
	hb = document.createElement("hbox");
	hb.setAttribute("id", "sb");
	hb.setAttribute("style", "margin-top:1em;");
	spacer = document.createElement("spacer");
	spacer.setAttribute("flex", "1");
	label0 	= document.createElement("label");
	label0.setAttribute("value", "Two result files are saved to Downloads folder");
	label0.setAttribute("id", "noti");
	saveButton 	= document.createElement("button");
	saveButton.setAttribute("label", "Save Result");
	saveButton.setAttribute("id", "saveAdvButton");
	saveButton.setAttribute("class", "loadButton");
	saveButton.setAttribute("onclick", "writeToFile(strForText);");
	hb.appendChild(spacer);
	hb.appendChild(saveButton);
	hb.appendChild(label0);
	
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
	//bx.appendChild(noti);
		
	var subl, hbox1;
	var place 	= document.createElement("hbox");
	place.setAttribute("flex", "1");
	var tree 	= document.createElement("tree");
	tree.setAttribute("flex", "1");
	tree.setAttribute("rows", 5);
	place.appendChild(tree);

	var splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	var treecols = document.createElement("treecols");
	treecols.setAttribute("style", "font-weight:bold");
	var treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Subjects");
	treecol.setAttribute("width",260);
	treecols.appendChild(treecol);
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Pass");
	treecol.setAttribute("flex", "1");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Fail");
	treecol.setAttribute("flex", "1");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);

	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Absent");
	treecol.setAttribute("flex", "1");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("flex", "1");
	treecol.setAttribute("label", "Percentage");	
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);
	
	var treechildren 	= document.createElement("treechildren");
	treechildren.setAttribute("id", "treeChild");

	tree.appendChild(treecols);	

	tree.appendChild(treechildren);
	bx.appendChild(place);


	var sep = document.createElement("separator");
	bx.appendChild(sep);

	var place 	= document.createElement("hbox");
	place.setAttribute("flex", "1");

	var tree 	= document.createElement("tree");
	tree.setAttribute("flex", "1");
	tree.setAttribute("rows", 10);
	tree.setAttribute("id", "mainTree_treechildren");
	place.appendChild(tree);

	var splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	var treecols = document.createElement("treecols");
	treecols.setAttribute("style", "font-weight:bold");
	var treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Sl no");
	treecols.appendChild(treecol);
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "USN         ");
	treecol.setAttribute("flex", "1");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Student Name");
	treecol.setAttribute("flex", "1");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);

	treecol = document.createElement("treecol");
	treecol.setAttribute("label", "Percentage");
	treecol.setAttribute("flex", "1");
	treecol.setAttribute("id", "percentage");
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);
	treecol = document.createElement("treecol");
	treecol.setAttribute("flex", "1");
	treecol.setAttribute("label", "Result");	
	treecols.appendChild(treecol);
	splitter = document.createElement("splitter");
	splitter.setAttribute("class", "tree-splitter");
	treecols.appendChild(splitter);

	tree.appendChild(treecols);
	bx.appendChild(place);

	var treechildren 	= document.createElement("treechildren");
//	treechildren.setAttribute("label", "Result");
	var treeitem, treecell1, treecell2, treecell3, treecell4, treecell5, treerow;
	var u=0;
	for(var u=0; u<usnList.length; u++)
	{
		treeitem 	= document.createElement("treeitem");
		treerow 	= document.createElement("treerow");	
		treecell1 	= document.createElement("treecell");
		treecell2 	= document.createElement("treecell");
		treecell3 	= document.createElement("treecell");
		treecell4 	= document.createElement("treecell");
		treecell5	= document.createElement("treecell");
		//alert(usnList[u]);
		treecell1.setAttribute("label", u+1);
		treecell2.setAttribute("label", usnList[u]);
		treecell3.setAttribute("id", "name"+usnList[u]);
		treecell3.setAttribute("label", "Load..");
		treecell4.setAttribute("id", "perc"+usnList[u]);
		treecell4.setAttribute("label", "Load..");
		treecell5.setAttribute("id", "stat"+usnList[u]);
		treecell5.setAttribute("label", "Load..");
	
		treerow.appendChild(treecell1);
		treerow.appendChild(treecell2);
		treerow.appendChild(treecell3);
		treerow.appendChild(treecell4);
		treerow.appendChild(treecell5);
		treeitem.appendChild(treerow);
		treechildren.appendChild(treeitem);
	}

	tree.appendChild(treechildren);	
	bx.appendChild(hb);
	resultId.appendChild(bx);
	
	document.getElementById("saveAdvButton").hidden=false;
	document.getElementById("noti").hidden=true;
	for(u=0; u<usnList.length; u++)
	{	
		abort.push("0");
		openAdvResult(usnList[u]);
	}	
}
 
