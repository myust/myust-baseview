define('myust-baseview', [
    'require',
    'exports',
    'module',
    'polymer',
    'underscore',
    'jquery',
    'ga'
    /* myust-modal */
], function(require, exports, module) {
    var Polymer = require('polymer');
    var $ = require('jquery');
    var _ = require('underscore');
    var ga = require('ga');

    Polymer('myust-baseview', {
        logined: false,
        logger: null,
        verticalCenter: false,
        horizontalCenter: false,
        publish: {
            selected: {
                value: false,
                reflect: true
            },
            disabled: {
                value: false,
                reflect: true
            }
        },
        $this: null,

        // Override
        ready: function() {
            this.super(arguments);
            this.logger = {
                log: function(msg) {
                    console.log(arguments);
                }
            };
            this.$this = $(this);
        },

        // Override
        attached: function() {
            this.super(arguments);
            var self = this;

            if (this.verticalCenter) {
                setTimeout(function() {
                    self.$this.css({
                        top: '50%',
                        marginTop: -(self.offsetHeight / 2)
                    });
                });
            }

            if (this.horizontalCenter) {
                setTimeout(function() {
                    self.$this.css({
                        left: '50%',
                        marginLeft: -(self.offsetWidth / 2)
                    });
                });
            }
        },

        initialize: function(options) {
            _.extend(this, options);
        },

        reset: function() {
            this.initialize();
        },

        //TODO: logger
        handleError: function(err, type) {
            this.logger.log('error', err);
            ga('send', 'event', 'Error', type, err);
            var modal = document.createElement('myust-modal');
            modal.heading = 'Error';
            modal.content = err;
            document.body.appendChild(modal);

            return this;
        },

        startTiming: function(category, variable) {
            var startTime = Date.now();
            return function() {
                ga('send', 'timing', category, variable, Date.now() - startTime);
            };
        },

        getDistributedElements: function($content) {
            if (!$content) {
                return [];
            }

            return Array.prototype.filter.call($content.getDistributedNodes(), function(el) {
                return el.nodeType === 1;
            });
        },

        selectedChanged: function(oldVal, newVal) {
            if (newVal) {
                this.asyncFire('myust-selected', this);
            } else {
                this.asyncFire('myust-deselected', this);
            }
        },

        disabledChanged: function(oldVal, newVal) {
            if (newVal) {
                this.asyncFire('myust-disabled', this);
            } else {
                this.asyncFire('myust-enabled', this);
            }
        },

        hiddenChanged: function(oldVal, newVal) {
            if (newVal) {
                this.asyncFire('myust-hidden', this);
            } else {
                this.asyncFire('myust-shown', this);
            }
        }
    });
});
require(['myust-baseview']);