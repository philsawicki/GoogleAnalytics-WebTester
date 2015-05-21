(function (window, document, undefined) {
    'use strict';


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


    /**
     * "Preview" Slideshow image rotator.
     * 
     * @return {Object}
     */
    var PreviewAnimation = (function () {

        var _slideMap = [
            // [ Protractor ; Console ]
            ['00', '00'],
            ['01', '01'],
            [null, '02'],
            ['03', '03'],
            [null, '04'],
            [null, '05'],
            [null, '06'],
            [null, '07'],
            [null, '08'],
            [null, '09'],
            [null, '10'],
            [null, '11'],
            [null, '12'],
            [null, '13'],
            [null, '14'],
            [null, '15'],
            [null, '16'],
            [null, '17'],
            ['18', '18'],
            ['19', '19'],
            [null, '20'],
            [null, '21'],
            ['22', '22'],
            ['23', '23'],
            ['24', '24'],
            ['25', '25'],
            ['26', '26'],
            [null, '27'],
            [null, '28'],
            [null, '29']
        ];
        var _nbImages = _slideMap.length;
        var _preloadCounter = 0;
        var _slideCounter = 0;
        var _nbImagesToPreload = 0;

        /**
         * Bootstrap the "Preview" Slideshow animation.
         * 
         * @return {void}
         * @private
         */
        var _init = function () {
            var slideshow = document.getElementById('screenshotsSlideshow');
            if (slideshow) {
                var protractorScreenshot = document.getElementById('protractorScreenshot');
                var consoleScreenshot = document.getElementById('consoleScreenshot');

                if (protractorScreenshot && consoleScreenshot) {
                    // Compute the number of slides to preload:
                    for (var i = 0; i < _nbImages; i++) {
                        var slideFilenames = _slideMap[i];

                        if (slideFilenames[0] != null) {
                            _nbImagesToPreload++;
                        }
                        if (slideFilenames[1] != null) {
                            _nbImagesToPreload++;
                        }
                    }

                    _preloadScreenshotSlideshowImages();
                }
            }
        };

        /**
         * Preload the "Preview" Slideshow images.
         * 
         * @return {void}
         * @private
         */
        var _preloadScreenshotSlideshowImages = function () {
            for (var i = 0; i < _nbImages; i++) {
                try {
                    var slideFilenameIndex = _slideMap[i];

                    // Preload "Protractor" screenshots:
                    if (slideFilenameIndex[0] != null) {
                        var browserScreenshot = new Image();
                        browserScreenshot.onload = _screenshotSlideshowImagesPreloaded;
                        browserScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Protractor Screenshot ' + slideFilenameIndex[0] + '.png';
                    }

                    // Preload "Console" screenshots:
                    if (slideFilenameIndex[1] != null) {
                        var consoleScreenshot = new Image();
                        consoleScreenshot.onload = _screenshotSlideshowImagesPreloaded;
                        consoleScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Console Screenshot ' + slideFilenameIndex[1] + '.png';
                    }
                } catch (ex) { }
            }
        };

        /**
         * Callback called when each preloaded image is successfully loaded.
         * 
         * @return {void}
         * @private
         */
        var _screenshotSlideshowImagesPreloaded = function (event) {
            if (++_preloadCounter === _nbImagesToPreload) {
                _allImagesPreloaded();
            }
        };

        /**
         * Callback called after all images are preloaded, which kicks off the actual image rotation.
         * 
         * @return {void}
         * @private
         */
        var _allImagesPreloaded = function () {
            if (_slideCounter++ == _nbImages - 1) {
                _slideCounter = 0;
            }
            var imageData = _slideMap[_slideCounter];

            // Switch "Protractor" image:
            if (imageData[0] != null) {
                var browserScreenshot = document.getElementById('protractorScreenshot');
                browserScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Protractor Screenshot ' + imageData[0] + '.png';
            }

            // Switch "Console" image:
            if (imageData[1] != null) {
                var consoleScreenshot = document.getElementById('consoleScreenshot');
                consoleScreenshot.src = 'images/screenshots/Google Analytics Web Tester - Console Screenshot ' + imageData[1] + '.png';
            }

            // Queue the next image to rotate:
            setTimeout(_allImagesPreloaded, 0.5*1000);
        };

        return {
            init: _init
        };
    })();

    

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



    /**
     * Initialize the Module.
     * 
     * @return {void}
     */
    var init = function () {
        //_loadLibraries();
        _bindGoogleAnalyticsTracking();

        window.addEventListener('load', function load (event) {
            if (typeof PreviewAnimation !== 'undefined') {
                PreviewAnimation.init();
            }

            window.removeEventListener('load', load, false); // Remove listener (no longer needed).
        }, false);
    };

    init(); // Bootstrap the Module.
})(window, document);
