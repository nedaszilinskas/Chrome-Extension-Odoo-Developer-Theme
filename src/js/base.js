var script = document.createElement("script");
script.src = chrome.extension.getURL("src/js/odoo.js");
script.setAttribute("id", "odoo-dev-theme-scripts");
script.setAttribute("data-xml", chrome.extension.getURL("src/xml/base.xml"));
document.documentElement.appendChild(script);