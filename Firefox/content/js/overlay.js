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
	frun:null,
	newVersion:null,
	onLoad: function() {
    // initialization code
		this.initialized = true;
		this.firstRun();
		this.addButton();
  	},
	firstRun: function(){
		var prefs;
		prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.ASKResults.");
		prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

		try {
			// Firefox 4 and later; Mozilla 2 and later
			Components.utils.import("resource://gre/modules/AddonManager.jsm");
			AddonManager.getAddonByID("VtuResult@sak.org", function(addon) {
			AskResults.newVersion = addon.version;
		  });
		}
		catch (ex) {
			// Firefox 3.6 and before; Mozilla 1.9.2 and before
			var em = Components.classes["@mozilla.org/extensions/manager;1"]
				     .getService(Components.interfaces.nsIExtensionManager);
			var addon = em.getItemForID("VtuResult@sak.org");
			AskResults.newVersion = addon.version;
		}		
		
		AskResults.frun = prefs.getCharPref("firstrun");
		
		if(AskResults.frun!='0.9.5')
		{
				setTimeout(function(){
						prefs.setCharPref("firstrun", AskResults.newVersion);
						gBrowser.selectedTab = gBrowser.addTab("http://theaskdev.com/thanks.php?app=1");
						//alert("helloo"+(AskResults.frun==AskResults.newVersion));//alert(stat);//AskResults.frun+' '+AskResults.newVersion); 						
				}, 3000);				
		}
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
