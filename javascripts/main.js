(function (document, undefined) {
    'use strict';


    /**
     * Initialize the Module.
     * 
     * @return {void}
     */
    var init = function () {
        //_loadLibraries();
        _bindGoogleAnalyticsTracking();

        window.addEventListener('load', function load (event) {
            window.removeEventListener('load', load, false); // Remove listener (no longer needed).

            _startScreenshotSlideshow();
        }, false);
    };

    /**
     * Async load the required librairies.
     * 
     * @return {void}
     */
    /*var _loadLibraries = function () {
        var jQueryLoader = new Loader();
        jQueryLoader.require([
            '//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js'
        ], function () {
            _menuHandler();
        });
    };*/

    /**
     * Bind Google Analytics Event Tracking to DOMElements.
     * 
     * @return {void}
     */
    var _bindGoogleAnalyticsTracking = function () {
        var downloadZipLink = document.getElementById('downloadZip');
        if (downloadZipLink) {
            downloadZipLink.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Download Zip File');
            });
        }

        //var downloadTarGzLink = document.getElementById('downloadTarGz');
        //if (downloadTarGzLink) {
        //    downloadTarGzLink.addEventListener('click', function (event) {
        //        ga('send', 'event', 'Button', 'Click', 'Download Tar.gz File');
        //    });
        //}

        var viewOnGithub = document.getElementById('githubSite');
        if (viewOnGithub) {
            viewOnGithub.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'View Project on Github');
            });
        }

        // Contact Page:
        var contactWebsite = document.getElementById('contactWebsite');
        if (contactWebsite) {
            contactWebsite.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: Website');
            });
        }
        var contactGithub = document.getElementById('contactGithub');
        if (contactGithub) {
            contactGithub.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: Github');
            });
        }
        var contactFacebook = document.getElementById('contactFacebook');
        if (contactFacebook) {
            contactFacebook.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: Facebook');
            });
        }
        var contactTwitter = document.getElementById('contactTwitter');
        if (contactTwitter) {
            contactTwitter.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: Twitter');
            });
        }
        var contactGooglePlus = document.getElementById('contactGooglePlus');
        if (contactGooglePlus) {
            contactGooglePlus.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: Google+');
            });
        }
        var contactLinkedIn = document.getElementById('contactLinkedIn');
        if (contactLinkedIn) {
            contactLinkedIn.addEventListener('click', function (event) {
                ga('send', 'event', 'Button', 'Click', 'Contact: LinkedIn');
            });
        }
    };

    var _startScreenshotSlideshow = function () {
        var slideshow = document.getElementById('screenshotsSlideshow');
        if (slideshow) {
            var protractorScreenshot = document.getElementById('protractorScreenshot');
            var consoleScreenshot = document.getElementById('consoleScreenshot');

            if (protractorScreenshot && consoleScreenshot) {
                _preloadScreenshotSlideshowImages();
            }
        }
    };

    var _preloadScreenshotSlideshowImages = function () {
        for (var i = 0; i < _nbImages; i++) {
            try {
                var imageIndex = (i < 10 ? '0' + i : i);

                var browserScreenshot = new Image();
                browserScreenshot.onload = _screenshotSlideshowImagesPreloaded;
                browserScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Protractor Screenshot ' + imageIndex + '.png';

                var consoleScreenshot = new Image();
                consoleScreenshot.onload = _screenshotSlideshowImagesPreloaded;
                consoleScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Console Screenshot ' + imageIndex + '.png';
            } catch (e) { }
        }
    };

    var _nbImages = 29;
    var _preloadCounter = 0;
    var _screenshotSlideshowImagesPreloaded = function () {
        if (_preloadCounter++ === _nbImages*2 - 1) {
            _allImagesPreloaded();
        }
    };

    var _slideCounter = 0;
    var _allImagesPreloaded = function () {
        var imageIndex = _slideCounter++;
        if (imageIndex >= _nbImages) {
            _slideCounter = 0;
        }
        imageIndex = (_slideCounter < 10 ? '0' + _slideCounter : _slideCounter);

        var browserScreenshot = document.getElementById('protractorScreenshot');
        var consoleScreenshot = document.getElementById('consoleScreenshot');

        browserScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Protractor Screenshot ' + imageIndex + '.png';;
        consoleScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Console Screenshot ' + imageIndex + '.png';;

        setTimeout(_allImagesPreloaded, 0.5*1000);
    };

    /**
     * Handler for the Mobile/Tablet Menu.
     * 
     * @return {void}
     */
    /*var _menuHandler = function () {
        (function () {
            return {
                init: function () {
                    this.addOpenHandler();
                },
                addOpenHandler: function () {
                    $(document).on('touchend.sidebar click.sidebar', '#header-menu', function (event) {
                        event.preventDefault();

                        $(document).off('.sidebar');
                        this.open();
                        this.addCloseHandler();
                    }.bind(this));
                },
                addCloseHandler: function () {
                    $(document).on('touchend.sidebar click.sidebar', function (event) {
                        var $target = $(event.target);

                        // Close of the user clicked the close icon or clicked
                        // outside of the sidebar.
                        if ($target.closest('#sidebar-close').length || !$target.closest('#sidebar').length) {
                            event.preventDefault();

                            $(document).off('.sidebar');
                            this.close();
                            this.addOpenHandler();
                        }
                    }.bind(this));
                },
                open: function () {
                    $(document.body).addClass('is-expanded');
                },
                close: function () {
                    $(document.body).removeClass('is-expanded');
                }
            };
        })().init();
    };*/



    /*var Loader = function () { };
    Loader.prototype = {
        require: function (scripts, callback) {
            this.nbLoadedScripts = 0;
            this.nbRequiredScripts = scripts.length;
            this.callback = callback;

            for (var i = 0, nbScripts = scripts.length; i < nbScripts; i++) {
                this.writeScript(scripts[i]);
            }
        },

        loaded: function (event) {
            this.nbLoadedScripts++;

            if (this.nbLoadedScripts === this.nbRequiredScripts && typeof this.callback === 'function') {
                this.callback.call();
            }
        },

        writeScript: function (src) {
            var self = this;

            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = src;
            s.addEventListener('load', function (event) {
                self.loaded(event);
            }, false);

            var head = document.getElementsByTagName('head')[0];
            head.appendChild(s);
        }
    };*/


    init(); // Bootstrap the Module.
})(document);
