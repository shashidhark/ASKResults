/*
|===============================================================================
|			Last Modified Date 	: 28/08/2014
|			Developer						: Shashidhar and alwyn
|===============================================================================
|	   	File Name		: overlay.js
|
|===============================================================================
*/
// Retrieve the preferences.
/*
var prefs;
prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.ASKResults.");
prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

// If we just installed, open the post-install page and update the preferences.
var just_installed = prefs.getBoolPref("just_installed");
var post_install_url = prefs.getCharPref("post_install_url");
if (just_installed) {
  prefs.setBoolPref("just_installed", false);
  gBrowser.selectedTab = gBrowser.addTab("http://www.com");    
}*/

var AskResults = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
	this.addButton();
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
