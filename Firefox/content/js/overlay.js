/*
|===============================================================================
|			Last Modified Date 	: 28/08/2014
|			Developer						: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: overlay.js
|
|===============================================================================
*/


var AskResults = {
	onLoad: function() {
    // initialization code
		this.initialized = true;
		this.addButton();
		//this.getTopWindow();
  	},
	getTopWindow1: function(){
		var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
                  .getService(Components.interfaces.nsIWindowMediator)
                  .getMostRecentWindow('navigator:browser');
               win.gBrowser.selectedTab = win.gBrowser.addTab('http://www.sasy.com');
	},
	getTopWindow: function(){
	//	setTimeout(function(){alert(pref.getBoolPref("first-time"))},1000,browser,tab);
		var pref;
		pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.ASKResults.");
		pref.QueryInterface(Components.interfaces.nsIPrefBranch2);
		setTimeout(function(){alert(pref.getBoolPref("first-time"))},3000);
//		alert("hello");
		if(pref.getBoolPref("first-time")==true) {
		
			setTimeout(function(){alert("hi")},3000);
			//var top = AskResults.getTopWindow1();
			//var browser=top.getBrowser();
			//var tab = browser.addTab();
			setTimeout(AskResults.getTopWindow1(),100);
			pref.setBoolPref("first-time",false);
		}
		//
		//return null;
	},
  	addButton: function() {
		var toolbarButton = 'AskResults-button';
		var navBar = document.getElementById('nav-bar');
		var currentSet = navBar.getAttribute('currentset');
		if (!currentSet) {
			currentSet = navBar.currentSet;
		}
		var curSet = currentSet.split(',');
		if (curSet.indexOf(toolbarButton) == -1) {
			set = curSet.concat(toolbarButton);
			navBar.setAttribute("currentset", set.join(','));
			navBar.currentSet = set.join(',');
			document.persist(navBar.id, 'currentset');
			try {
				BrowserToolboxCustomizeDone(true);
			} catch (e) {}
		}
	},
	onMenuItemCommand: function() {
    	window.open("chrome://AskResults/content/disp.xul", "", "chrome=yes, scrollbars=yes, resizable=yes, top=100, left=400");
  	}
};

window.addEventListener("load", function load(e){
		window.removeEventListener("load", load, false);
		AskResults.onLoad(e);
}, false);
