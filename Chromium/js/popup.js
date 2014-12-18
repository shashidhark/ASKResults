/*
|===============================================================================
|			Last Modified Date 	: 30/08/2014
|			Developer						: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: popup.js
|
|===============================================================================
*/
var pdfVar="";
var usn;

// Input: DDXXDDYYDDD
// Returns: YY ( Branch )
function getBranch(){
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

// Input: s,  is of format "Nameofstudent(DAADDAADDD)"
// Returns : Name and USN Separately.
function getNameUsn(usnName){
    var name = usnName.substring(0, usnName.indexOf('('));
    var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
    usn = aftBractket.substring(0, aftBractket.indexOf(')'));
    return ucwords(name+'  '+usn);
}

function findAvg(total, sem){
	//return ' '+total+' '+sem+' '+getBranch();
	return getAvgMarks(total, sem, getBranch());
}

function printToPdf(){
	//var str = ;
	//alert("hello");
	parser = new DOMParser();
	str = parser.parseFromString(pdfVar, "text/html");
	var table = $(str).find('table');
	//alert(table);
	var table_count = table.length;
	var data = [], fontSize = 12, height = 20, doc, initX=60, initY=60, usn;
	var colWidth = [0,0,0,0,0,0,0,0];

	doc = new jsPDF('p', 'pt', 'a4', true);
	doc.setFont("times", "normal");
	doc.setFontSize(fontSize);
//alert(pdfVar);
	for(var i=0; i<table_count; i++){
		data = doc.tableToJson($(table).eq(i));
		//alert(data.html());
		var strJson = JSON.stringify(data);
		var resData = JSON.parse(strJson);
		if(i==0){
			var usnName=resData[0].name;
			var name = usnName.substring(0, usnName.indexOf('('));
			var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
			usn = aftBractket.substring(0, aftBractket.indexOf(')'));
			//doc.setFontStyle("bold");
			//alert(usn);
			doc.text(initX+0, initY, "Name:  "+name);
			initY+=height;
			doc.text(initX+0, initY, "Usn:   "+usn);
			initY+=height;
			doc.text(initX+0, initY, "Total: "+resData[0].total);
			initY+=height;
		}
		else{
			//alert(dump(data));
		  if(i>=3 && (i%2 != 0))
		  	initY+=20;
			for (var k = 0; k < colWidth.length; k++) colWidth[k] = 0;
			var k=0;
			$.each(data, function (ii, row){
				k=0;
				$.each(row, function (jj, cell){
					if(colWidth[k]<cell.length){
						colWidth[k++]=cell.length;
					}
					else
						k++;
				})
			})
			doc.cellInitialize();
			$.each(data, function (ii, row){
				k=0;
				$.each(row, function (jj, cell){
					doc.cell(initX, initY, 5*colWidth[k++]+20, 20, cell, ii);
				})
			})
			initY+=height*resData.length+10;
		}
	}
	doc.save(usn+'.pdf');
}

function showResult(res, rv)
{
		//Color codes
		var passColor='#087F38', failColor='#E30F17' ;
		var marksRow ='#F0FFF0', tableHead='#90B890', failedSub='#FFCCCC', resultTableColor="#000000";

	  var all = $(res.replace(/\<[\/?]?b[r]?\>/g,"")).find('td[width=513]').eq(0);
    var table = $(all).find('table');

		pdfVar='<!DOCTYPE html><html><body><table><tr><td>name</td><td>total</td></tr>';

		document.getElementById("result").innerHTML="";

    if(table.length==0){ //Check num of tables zero.
				document.getElementById('result').setAttribute("style", "color:red;");
        document.getElementById('result').innerHTML = 'Results are not yet available for this university seat number or Wrong USN..';
    }
    else{
        var tbl = document.createElement("table");
        tbl.id = "studentInfo";

        var tr1 = document.createElement("tr");
        var td1 = document.createElement("td");

				pdfVar+='<tr><td>'+$(all).find('B').eq(0).text()+'</td>';

        //Separate USN and Name
        var usnName=$(all).find('B').eq(0).text();
        var name = usnName.substring(0, usnName.indexOf('('));
        var aftBractket = usnName.substr(usnName.indexOf("(") + 1);
        usn = aftBractket.substring(0, aftBractket.indexOf(')'));

        td1.innerHTML="Name: <b>"+ucwords(name)+"</b><br />"+"USN:  <b>"+usn+"</b><br />"+"Semester: <b>"+$(all).eq(0).find("tr").eq(0).find('td').eq(1).text()+"</b><br />";
        tr1.appendChild(td1);

        var s=0;
				var perc='', avg;
        if(rv==0){ //Get Regular total Marks
            if(table.length > 3){
                var tr = $(table).eq(1).find("tr");
                for (var j = 1; j < tr.length; j++){
                    var td = $(tr).eq(j).find('td');
                    s += Number($(td).eq(3).text());//alert($(td).eq(3).text());
                }

            }
            else{
							s = Number($(table).eq(2).find("tr").eq(0).find('td').eq(3).text());
            }
						if((avg = findAvg(s, $(table).eq(0).find("tr").eq(0).find('td').eq(1).text())) != ''){
								perc = ",  "+avg+"%";
						}
						else
								perc="";
        }else{ // Get Revaluation total marks
            for (var i = 3; i < table.length; i++){
							var tr = $(table).eq(i).find("tr");
							for (var j = 0; j < tr.length; j++){
								var td = $(tr).eq(j).find('td');
								s += Number($(td).eq(4).text());
							}
						}
						perc="";
    		}
				td1.innerHTML += "Total: <b>"+s+" "+perc+"</b><br />";

				pdfVar+='<td>'+s+'</td></tr></table><table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr><tr><td>Semester</td><td>';
				pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(1).text()+'</td><td>';
				pdfVar+=$(table).eq(0).find("tr").eq(0).find('td').eq(3).find('b').text()+'</td></tr></table>';

				//Result Status.
        var str = $(table).eq(0).find("tr").eq(0).find('td').eq(3).text();
				//Split is used to sepearate status. Trim is used to remove unwanted space.
        var str = str.split(':');
        td1.innerHTML += ""+str[0].trim()+": <b>"+str[1].trim()+"</b><br />";

				//Check fail or pass to set colors (red , green)
				if(str[1].indexOf("FAIL") == -1)
					tbl.setAttribute("style", "border:2px solid "+resultTableColor+"; border-bottom:none; width:100%; background-color:"+passColor);
				else
					tbl.setAttribute("style", "border:2px solid "+resultTableColor+"; border-bottom:none; width:100%; background-color:"+failColor);
				tr1.appendChild(td1);
				tbl.appendChild(tr1);
				document.getElementById("result").appendChild(tbl);

				//Display subjects marks table
				outerDiv = document.createElement("div");
				outerDiv.setAttribute("style", "border:2px solid "+resultTableColor+";");
				if(rv == 0){
					for(var i=1; i < table.length-1; i++){
						pdfVar+='<table><tr><td>Subject</td><td>External</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
						tbl = document.createElement("table");
						tbl.setAttribute("style", "border:none; border-spacing:0; width:100%;");

						var tr = $(table).eq(i).find("tr");
						
						for (var j = 0; j < tr.length; j++){
							pdfVar+='<tr>';
				      tr1 = document.createElement("tr");
							/*tr1.addEventListener("mouseover",function(){
								this.style.backgroundColor="#FFFFFF";
							});
							tr1.addEventListener("mouseout",function(){
									this.style.backgroundColor="transparent";
							});*/

							if(j==0)
								tr1.setAttribute("style", "font-weight:bold; background-color:"+tableHead);
							else
								tr1.setAttribute("style", "background-color:"+marksRow);

							var td = $(tr).eq(j).find('td');
						  var resSem="";
							for (var k = 0; k < td.length; k++){
								td1 = document.createElement("td");
								if($(td).eq(k).text() != ""){
									if(i>=2 && (i%2 == 0))//To get semester and result in same string<-|
										resSem+=$(td).eq(k).text();                                    //|
									else										                                         //|
										td1.innerHTML=$(td).eq(k).text();                              //|
									pdfVar+='<td>'+$(td).eq(k).text()+'</td>';                       //|
								}                                                                  //|
								tr1.appendChild(td1);                                              //|
							}                                                                    //|
							if(i>=2 && (i%2 == 0))//Add to design-----------------------------------
								td1.innerHTML=resSem;
							
							if(($(td).eq(4).text()).indexOf("F") > -1 || ($(td).eq(4).text()).indexOf("A") > -1)
							{
								tr1.setAttribute("style", "background-color:"+failedSub+"; color:red");
							}

							if(($(td).eq(3).text()).indexOf("FAIL") > -1)
								tr1.setAttribute("style", "width:50%; font-weight:bold; background-color:"+failColor+";");
							else if(($(td).eq(3).text()).indexOf("CLASS") > -1 || ($(td).eq(3).text()).indexOf("PASS") > -1)
								tr1.setAttribute("style", " width:50%;font-weight:bold; background-color:"+passColor+";");

							tbl.appendChild(tr1);
							pdfVar+='</tr>';
						}
						outerDiv.appendChild(tbl);
						pdfVar+='</table>';
					}
				}else{
					tbl = document.createElement("table");
					tbl.setAttribute("style", "border:0px; border-spacing:0; width:100%;");
					var heads = ['Subject', 'ExtOld', 'ExtNew', 'Internal', 'Total', 'Result'];

					tr1 = document.createElement("tr");
					tr1.setAttribute("style", "font-weight:bold; background-color:"+tableHead);

					for(i=0; i<heads.length;i++){
						td1 = document.createElement("td");
						td1.innerHTML=heads[i];
						tr1.appendChild(td1);
					}

					tbl.appendChild(tr1);

					pdfVar+='<table><tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';
					pdfVar+='<tr><td>Subject</td><td>Ext Old</td><td>Ext New</td><td>Internal</td><td>Total</td><td>Result</td></tr>';

					for (var i=3; i < table.length; i++){
						tr1 = document.createElement("tr");
						var tr = $(table).eq(i).find("tr");
						for (var j = 0; j < tr.length; j++){
							pdfVar+='<tr>';
							var td = $(tr).eq(j).find('td');
							for (var k = 0; k < td.length; k++){
								td1 = document.createElement("td");
								if($(td).eq(k).text() != ""){
									//alert($(td).eq(k).text());
									td1.innerHTML=$(td).eq(k).text();
									pdfVar+='<td>'+$(td).eq(k).text()+'</td>';
								}
								tr1.appendChild(td1);
							}
							if(($(td).eq(5).text()).indexOf("F") > -1 || ($(td).eq(5).text()).indexOf("A") > -1)//Absent and Fail
							{
								tr1.setAttribute("style", "background-color:"+failedSub+"; color:red");
							}
							else
								tr1.setAttribute("style", "background-color:#F5F7CB;");

							pdfVar+='</tr>';
						}
						tbl.appendChild(tr1);
					}
					outerDiv.appendChild(tbl);
					pdfVar+='</table>';
				}
				document.getElementById("result").appendChild(outerDiv);

    }//If tables are not zero END
		document.getElementById('print').hidden=false;
}

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

function addBookmark() {
    // Cancel the form submit

    event.preventDefault();

		document.getElementById('result').setAttribute("style", "margin:2px;");

    var usn = document.getElementById('usn').value;
  	var rv=0;

    if(usn.length==0){
				document.getElementById('usn').setAttribute("style", "border:2px solid red;");
				document.getElementById('usn').focus();
				document.getElementById('result').setAttribute("style", "color:red;");
				document.getElementById('result').textContent = "Please Enter your USN...";
        return;
		}
		else if(!checkFormat(usn)) {	
				document.getElementById('usn').setAttribute("style", "border:2px solid red;");
				document.getElementById('usn').focus();
				document.getElementById('result').setAttribute("style", "color:red;");
        document.getElementById('result').textContent = "Check USN format...";
        return;
    }

		document.getElementById('usn').setAttribute("style", "border:1px solid blue;");

    document.getElementById("result").innerHTML="Loading your result...<br />	";
		var pbar = document.createElement("progress");
		pbar.setAttribute("mode", "undetermined");
		document.getElementById("result").appendChild(pbar);

    // The URL to POST our data to
    var postUrl = 'http://results.vtu.ac.in/vitavi.php';
    //var postUrl = 'res.html';
    if(document.getElementById('reval').checked){
      //  postUrl = 'revalres.html';
    	rv=1;
		  postUrl = 'http://results.vtu.ac.in/vitavireval.php';
    }
    //alert(postUrl);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);

    //var usn = encodeURIComponent();
		//alert(usn);
    var params = '&submit=SUBMIT&rid=' + usn;

    // Replace any instances of the URLEncoded space char with +
    params = params.replace(/%20/g, '+');

    // Set correct header for form data
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    // Handle request state change events
    xhr.onreadystatechange = function() {
        // If the request completed
        if (xhr.readyState == 4) {
            if (xhr.status == 200) { // Replace <b> .. </b> and <br>
				//$(xhr.responseText.replace(/\<[\/?]?b[r]?\>/g,"")).find('td[width=513]').eq(0).html();
                showResult(xhr.responseText, rv);
            } else {// Show what went wrong
                document.getElementById('result').innerHTML='Check internet connection. Error:' + xhr.statusText;
            }
        }
    };

    // Send the request and set status
    xhr.send(params);
	//	alert("Done");
}

window.addEventListener('load', function(evt) {
    // Handle the bookmark form submit event with our addBookmark function
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);
		document.getElementById('print').addEventListener("click", printToPdf);
		document.getElementById('usn').focus();

		const KEY_ENTER = 13;
  	const KEY_ESCAPE = 27;
		var textbox = document.getElementById("usn");

		function keyPressed(e) {
		  switch (e.keyCode) {
		    case KEY_ENTER:
					addBookmark();
					break;
				default:
					document.getElementById('print').hidden=true;
					break;
			}
		}

		textbox.addEventListener('keyup', keyPressed, true);
});
