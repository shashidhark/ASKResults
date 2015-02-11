function getTopWindow(){
	var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService().
			QueryInterface(Components.interfaces.nsIWindowWatcher);
	var i=wwatch.getWindowEnumerator();
	while(i.hasMoreElements()) {
		var w=i.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
		try {
			var w0=w.QueryInterface(Components.interfaces.nsIDOMWindowInternal);
			if(w0.location.href=="chrome://browser/content/browser.xul")
				return w0;
		} catch(e) {}
	}
	return null;
}

function newTab(url){
		var top=getTopWindow();
		// If we just installed, open the post-install page and update the preferences.
		var browser=top.getBrowser();
		var tab = browser.addTab(url);
		setTimeout(new Function("b","t","b.selectedTab=t;"),100,browser,tab);
}
