var script = document.createElement("script");
script.src = chrome.extension.getURL("src/js/odoo.js");
script.setAttribute("id", "odoo-dev-theme-scripts");
script.setAttribute("data-xml", chrome.extension.getURL("src/xml/base.xml"));
document.documentElement.appendChild(script);

try {
    var theme = localStorage.getItem('theme');
} catch (e) {
    var theme = false;
}
if (theme) {
    var link = document.createElement("link");
    link.href = chrome.extension.getURL("src/css/" + theme + ".css");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("id", "odoo-dev-theme-styles");
    document.documentElement.appendChild(link);
}