'use strict';

var Backbone = require('../../shim/backbone');

// from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
function isValidEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var UserModel = Backbone.Model.extend({
    url: '/user/login',

    isAuthenticated: function() {
        return this.id > 0;
    },

    // Both login and logout methods return jqXHR objects so that callbacks can
    // be specified upon usage. They both update the user model, so any event
    // listeners that subscribe to the `sync` event will be triggered.
    login: function(attrs) {
        return this.fetch({
            type: 'POST',
            url: '/user/login',
            data: {
                'username': attrs.username,
                'password': attrs.password
            }
        });
    },

    logout: function() {
        var jqXHR = this.fetch({
            url: '/user/logout'
        });

        var user = this;
        jqXHR.always(function() {
            user.clear();
        });

        return jqXHR;
    }
});

var ModalBaseModel = Backbone.Model.extend({
    defaults: {
        success: false,
        client_errors: null,
        server_errors: null
    }
});

var LoginFormModel = ModalBaseModel.extend({
    defaults: {
        username: '',
        password: ''
    },

    url: '/user/login',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.username) {
            errors.push('Please enter a username');
        }

        if (!attrs.password) {
            errors.push('Please enter a password');
        }

        if (errors.length) {
            this.set({
                'client_errors': errors,
                'server_errors': null
            });
            return errors;
        } else {
            this.set({
                'client_errors': null,
                'server_errors': null
            });
        }
    }
});

var SignUpFormModel = ModalBaseModel.extend({
    defaults: {
        username: null,
        password1: null,
        password2: null,
        email: null,
        agreed: false
    },

    url: '/user/sign-up',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.username) {
            errors.push('Please enter a username');
        }

        if (!attrs.email) {
            errors.push('Please enter an email address');
        } else {
            if (!isValidEmail(attrs.email)) {
                errors.push('Please enter a valid email address');
            }
        }

        if (!attrs.password1) {
            errors.push('Please enter a password');
        }

        if (!attrs.password2) {
            errors.push('Please repeat the password');
        }

        if (attrs.password1 !== attrs.password2) {
            errors.push('Passwords do not match');
        }

        if (!attrs.agreed) {
            errors.push('Please check the agreement');
        }

        if (errors.length) {
            this.set({
                'client_errors': errors,
                'server_errors': null
            });
            return errors;
        } else {
            this.set({
                'client_errors': null,
                'server_errors': null
            });
        }
    }
});

var ForgotFormModel = ModalBaseModel.extend({
    defaults: {
        email: null
    },

    url: '/user/forgot',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.email) {
            errors.push('Please enter an email address');
        } else {
            if (!isValidEmail(attrs.email)) {
                errors.push('Please enter a valid email address');
            }
        }

        if (errors.length) {
            this.set({
                'client_errors': errors,
                'server_errors': null
            });
            return errors;
        } else {
            this.set({
                'client_errors': null,
                'server_errors': null
            });
        }
    }
});

var ResendFormModel = ModalBaseModel.extend({
    defaults: {
        email: null
    },

    url: '/user/resend',

    validate: function(attrs) {
        var errors = [];

        if (!attrs.email) {
            errors.push('Please enter an email address');
        } else {
            if (!isValidEmail(attrs.email)) {
                errors.push('Please enter a valid email address');
            }
        }

        if (errors.length) {
            this.set({
                'client_errors': errors,
                'server_errors': null
            });
            return errors;
        } else {
            this.set({
                'client_errors': null,
                'server_errors': null
            });
        }
    }
});

module.exports = {
    UserModel: UserModel,
    LoginFormModel: LoginFormModel,
    SignUpFormModel: SignUpFormModel,
    ForgotFormModel: ForgotFormModel,
    ResendFormModel: ResendFormModel
};