(function() {
    'use strict';

    if (typeof openerp != "object" && typeof openerp.web.WebClient != "function" && typeof openerp.qweb.add_template != "function") return;

    var QWeb = openerp.web.qweb;

    var xml_src = $('#odoo-dev-theme-scripts').attr('data-xml');
    openerp.qweb.add_template(xml_src);

    openerp.web.WebClient.include({
        show_application: function() {
            this._super();
            this.init_dev_menu();
        },
        init_dev_menu: function() {
            var $menu = $(QWeb.render('OdooDevTheme.systray'));
            $menu.prependTo(window.$('.oe_systray'));
            $menu.find('a.oe_activate_debug_mode').on('click', function(e) {
                e.preventDefault();
                window.location = $.param.querystring(window.location.href, 'debug');
            });
        }
    });

})();