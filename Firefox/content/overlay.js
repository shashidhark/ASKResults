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
  },
  
  onMenuItemCommand: function() {
    window.open("chrome://AskResults/content/disp.xul", "", "chrome=yes, scrollbars=yes, resizable=yes, top=200, left=500");
  }
};

window.addEventListener("load", function load(e){
		window.removeEventListener("load", load, false);
		AskResults.onLoad(e);
}, false);
