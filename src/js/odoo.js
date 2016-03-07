(function() {
    'use strict';

    if (typeof openerp != "object") return;
    if (typeof openerp.web != "object") return;
    if (typeof openerp.web.WebClient != "function") return;
    if (typeof openerp.qweb.add_template != "function") return;

    var QWeb = openerp.web.qweb;

    var xml_src = $('#odoo-dev-theme-scripts').attr('data-xml');
    openerp.qweb.add_template(xml_src);

    openerp.web.WebClient.include({
        show_application: function() {
            this._super();
            this.init_dev_menu();
            this.init_user_switch_menu();
        },
        init_dev_menu: function() {
            var $menu = $(QWeb.render('OdooDevTheme.systray'));
            $menu.prependTo(window.$('.oe_systray'));
            $menu.find('a.oe_activate_debug_mode').on('click', function(e) {
                e.preventDefault();
                window.location = $.param.querystring(window.location.href, 'debug');
            });
        },
        init_user_switch_menu: function() {
            var accounts = get_local_accounts();
            for (var i in accounts) {
                var user_li = new openerp.web.UserMenuSwitchUser(accounts[i].login, accounts[i].password);
                user_li.appendTo(this.$el.find('.oe_user_menu_placeholder ul.dropdown-menu'));
            }
        }
    });

    openerp.web.UserMenuSwitchUser = openerp.web.Widget.extend({
        template: "UserMenu.SwitchUser",
        init: function(login, password) {
            this.login = login;
            this.password = password;
        },
        events: {
            'click a': function(e) {
                if ($(e.target).hasClass('removeswitchuser')) return;
                this.rpc("/web/session/authenticate", {
                    'db': openerp.session.db,
                    'login': this.login,
                    'password': this.password
                }).done(function() {
                    document.location.href = '/web';
                });
            },
            'click span.removeswitchuser': function() {
                if (confirm("Are you sure you want to remove quick login access to user " + this.login + "?")) {
                    var accounts = get_local_accounts();
                    for (var i in accounts) {
                        if (accounts[i].login == this.login) {
                            accounts.splice(i, 1);
                            this.$el.remove();
                        }
                    }
                    localStorage.setItem('accounts', JSON.stringify(accounts));
                }
            }
        }
    });

    openerp.web.UserMenu.include({
        on_menu_add_switchuser: function() {
            var self = this;
            var form = $(QWeb.render("UserMenu.AddSwitchUser"));
            var modal = new openerp.web.Dialog(this, {
                size: 'medium',
                dialogClass: 'oe_act_window',
                title: _t("Add Quick Switch User"),
                buttons: [{
                    'text': _t('Save'),
                    'oe_link_class': 'oe_highlight',
                    'click': function() {
                        var login = $(this).find('#login').val();
                        var password = $(this).find('#password').val();
                        if (login && password) {
                            var accounts = get_local_accounts();
                            accounts.push({
                                'login': login,
                                'password': password
                            });
                            localStorage.setItem('accounts', JSON.stringify(accounts));
                            var user_li = new openerp.web.UserMenuSwitchUser(login, password);
                            user_li.appendTo(self.$el.find('.dropdown-menu'));
                            modal.close();
                        }
                    }
                }]
            }, form).open();
        },
    });

    function get_local_accounts() {
        try {
            var accounts = JSON.parse(localStorage.getItem('accounts'))
        } catch (e) {
            var accounts = []
        }
        return accounts ? accounts : [];
    }

})();