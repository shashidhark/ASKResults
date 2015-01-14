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
  },
  
  addButton: function() {
		toolbarButton = 'AskResults-button';
		navBar = document.getElementById('nav-bar');
		currentSet = navBar.getAttribute('currentset');
		if (!currentSet) {
			currentSet = navBar.currentSet;
		}
		curSet = currentSet.split(',');
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
    window.open("chrome://AskResults/content/disp.xul", "", "chrome=yes, scrollbars=yes, resizable=yes, top=200, left=400");
  }
};

window.addEventListener("load", function load(e){
		window.removeEventListener("load", load, false);
		AskResults.onLoad(e);
}, false);
