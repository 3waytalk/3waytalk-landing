"use strict";

(function () {

    /**
     * @class Popup
     */
    class Alert {
        /**
         * @description Adding events and properties
         * @constructor
         */
        constructor(alert) {
            this.alert = alert;
            this.alert.querySelector('.alert__close').addEventListener('click', this.close.bind(this));
            this.alert.close = this.close.bind(this);
            this.alert.open = this.open.bind(this);
            this.alert.text = alert.querySelector('.alert__text');
            this.status = false;
        }

        close(event, status) {
            if (!this.status) {
                return;
            }

            if (status && this.status != status) {
                return;
            }

            Velocity(this.alert, "finish");
            Velocity(this.alert, {
                translateY: 0
            }, {
                duration: 250,
                complete: () => {
                    this.status = false;
                }
            });
        }

        open(text) {
            /*
            if (this.status) {
                return;
            }
            */

            if (!text) {
                text = 'Please check the credentials and try again.';
            }
            clearTimeout(this.alert);
            this.alert.text.textContent = text;
            this.status = new Date().getUTCMilliseconds();
            var status = this.status;

            Velocity(this.alert, "finish");
            Velocity(this.alert, {
                translateY: this.alert.offsetHeight + "px"
            }, {
                duration: 250,
                complete: () => {
                    setTimeout(() => {
                        this.close(null, status);
                    }, 3000);
                }
            });
        }
    }

    let ready = new Promise((resolve, reject) => {
        if (document.readyState != "loading") return resolve();
        document.addEventListener("DOMContentLoaded", () => resolve());
    });

    ready.then(() => {
        [].forEach.call(document.querySelectorAll('.alert'), alert => {
            new Alert(alert);
            if (alert.classList.contains('alert_open')) {
                alert.open();
            }
        });
    });
})();
"use strict";

(function () {
    class Contacts {
        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor() {
            let ready = new Promise((resolve, reject) => {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", () => resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Adding events and properties
         */
        init() {
            this.map = document.querySelector('.contact__map');
            if (this.map != null) {
                this.map.style.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - document.querySelector('.contact__wrapper').offsetHeight - document.querySelector('.footer').offsetHeight - document.querySelector('.header').offsetHeight - 52 + "px";
                window.addEventListener('resize', this.resize.bind(this));
            }
        }

        resize() {
            if (this.map != null) {
                this.map.style.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - document.querySelector('.contact__wrapper').offsetHeight - document.querySelector('.footer').offsetHeight - document.querySelector('.header').offsetHeight - 52 + "px";
            }
        }
    }
    new Contacts();
})();
"use strict";

(function () {
    class Landging {
        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor() {
            let ready = new Promise((resolve, reject) => {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", () => resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Adding events and properties
         */
        init() {

            if (document.querySelector('.landing') == null) {
                return;
            }

            this.fired = false;
            this.tablet = 1200;
            this.mobile = 750;
            this.min_height = 250;
            this.meta = document.querySelector("meta[name='viewport']");

            this.onResize();

            let header = document.querySelector('.header'),
                clock = document.querySelector('.clock'),
                main = document.querySelector('.slide_main');

            window.requestAnimFrame = window.requestAnimationFrame;
            $(".landing").fullpage({
                sectionSelector: ".landing__section",
                navigation: true,
                scrollingSpeed: 350,
                afterLoad: this.hideLoader.bind(this),
                afterRender: this.recountSlides.bind(this),
                afterResize: this.recountSlides.bind(this),
                onLeave: (index, nextIndex, direction) => {

                    if (nextIndex == 1) {
                        header.classList.toggle('header_open', false);
                        this.hideNav();
                    } else {
                        header.classList.toggle('header_open', true);
                        this.showNav();
                    }

                    if (nextIndex == 6) {
                        clock.classList.toggle('clock_visible', true);
                    } else {
                        clock.classList.toggle('clock_visible', false);
                    }
                }
            });
            document.querySelector(".footer__top").addEventListener("click", this.scrollToTop.bind(this));

            window.addEventListener('resize', this.onResize.bind(this));

            let active = document.querySelector('.landing__section.active');
            if (active != null) {
                active.classList.toggle('active_moment', true);
                active.classList.toggle('active', false);
                setTimeout(() => {
                    active.classList.toggle('active_moment', false);
                    active.classList.toggle('active', true);
                }, 0);
            }
        }

        onResize() {
            if (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) > 420 && Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 500) {
                this.meta.setAttribute("content", "width=400");
            } else {
                this.meta.setAttribute("content", "width=device-width, initial-scale=1.0");
            }
        }

        hideNav() {
            Velocity(this.nav, "finish");
            Velocity(this.nav, {
                opacity: 0
            }, {
                duration: 300,
                complete: () => {
                    this.nav.style.display = "none";
                }
            });
        }

        showNav() {
            Velocity(this.nav, "finish");
            Velocity(this.nav, {
                opacity: 1
            }, {
                duration: 300,
                begin: () => {
                    this.nav.style.display = "block";
                }
            });
        }

        hideLoader() {
            this.onResize();
            if (this.fired) {
                return;
            }
            this.fired = true;
            this.nav = document.getElementById('fp-nav');
            this.hideNav();

            [].forEach.call(document.querySelectorAll('.slide__resizable, .slide__centred'), resizable => {
                resizable.setAttribute('data-height', resizable.offsetHeight);
                resizable.setAttribute('data-width', resizable.offsetWidth);
            });

            let loader = document.querySelector('.loader__wrapper'),
                props = {
                opacity: 0
            },
                options = {
                duration: 500,
                complete: () => {
                    loader.parentNode.removeChild(loader);
                }
            };
            Velocity(loader, props, options);
        }

        recountSlides() {

            this.onResize();

            let resizables = document.querySelectorAll('.slide__resizable'),
                centred = document.querySelector('.slide__centred'),
                steps = document.querySelectorAll('.steps__step'),
                service_slide = document.querySelector('.slide_service'),
                service_illustration = document.querySelector('.slide__illustration'),
                main = document.querySelector('.slide_main'),
                shema = document.querySelector('.shema'),
                header_height = document.querySelector('.header').offsetHeight,
                footer_height = document.querySelector('.footer').offsetHeight,
                shema_details = shema.closest('.slide__details'),
                phones = main.querySelector('.slide__phones'),
                phone = main.querySelector('.slide__phone'),
                viewport_height,
                viewport_width,
                availabale_width,
                availabale_height,
                delta = 20,
                cell,
                size,
                scale = 1,
                scale_x = 1,
                scale_y = 1,
                header,
                slide,
                border_width,
                delta_y,
                tr_y,
                tr_x,
                element_width,
                element_height,
                illustration_height,
                w_width,
                w_height,
                i_width,
                del,
                i_height;

            cell = main.querySelector('.fp-tableCell');
            viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
            viewport_width = cell.offsetWidth;

            header = main.querySelector('.slide__header');
            main.style.backgroundSize = "auto " + viewport_height + "px";

            if (viewport_width > 750) {
                del = 0;
                size = 550;
            } else {
                del = 100;
                size = 480;
            }
            availabale_height = viewport_height - del - header.offsetHeight;

            if (availabale_height >= 200 && viewport_width > 750) {
                phones.style.height = Math.min(availabale_height, size) + "px";
                phones.style.marginLeft = -Math.min(availabale_height, size) * 0.1 + "px";
                phones.style.visibility = "visible";
            } else if (availabale_height < 200) {
                phones.style.visibility = "hidden";
            } else {
                phones.removeAttribute('style');
            }

            if (viewport_width <= 750) {
                phone.style.height = availabale_height + "px";
            }

            cell = service_slide.querySelector('.fp-tableCell');
            viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
            viewport_width = cell.offsetWidth;
            header = service_slide.querySelector('.slide__header');
            illustration_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10)) - header.offsetHeight - footer_height - header_height;
            service_illustration.style.height = illustration_height + "px";

            w_width = 700;
            w_height = 570;
            i_width = viewport_width * 1.2;
            i_height = w_height * i_width / w_width;

            if (i_height < illustration_height) {
                service_illustration.classList.toggle('slide__illustration_hidden', false);
                service_illustration.style.backgroundPosition = "50% 100%";
            } else if (illustration_height < 370) {
                service_illustration.classList.toggle('slide__illustration_hidden', true);
            } else {
                service_illustration.classList.toggle('slide__illustration_hidden', false);
                service_illustration.style.backgroundPosition = "50% 0";
            }

            // Centred style

            // Чистим все стили привнесенные
            centred.removeAttribute('style');
            [].forEach.call(steps, step => {
                step.removeAttribute('style');
            });

            if (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) > 480) {

                slide = centred.closest('.slide');
                cell = centred.closest('.fp-tableCell');
                viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
                viewport_width = cell.offsetWidth;

                element_height = parseInt(centred.getAttribute('data-height'), 10);

                if (viewport_width > 1220) {
                    // desktop
                    element_width = 1230;
                    delta_y = 170;
                } else if (viewport_width > 750 && viewport_width <= 1220) {
                    // tablet
                    element_width = 1050;
                    delta_y = 170;
                } else {
                    // mobile
                    element_width = 400;
                    element_height = 900;
                    delta_y = 0;
                }

                availabale_height = viewport_height - header_height;
                availabale_width = viewport_width - 40;

                scale_x = availabale_height / element_height;
                scale_y = availabale_width / element_width;
                scale = Math.min(Math.min(scale_x, scale_y), 1);

                tr_y = 0;
                tr_x = 0;

                if (viewport_width < 750) {
                    // mobile
                    scale = availabale_height / 620;
                    centred.style[Modernizr.prefixed('transform')] = 'translateX(-50%) scale(' + scale + ')';
                } else {
                    // not mobile

                    if (availabale_width < element_width) {
                        tr_x = -(element_width - viewport_width) / 2;
                    }

                    // upscale text
                    if (scale < 1) {
                        [].forEach.call(steps, step => {
                            step.style[Modernizr.prefixed('transform')] = 'scale(' + Math.min(1 / scale * 0.8, 2) + ')';
                        });
                        tr_x += 30;
                    }

                    tr_x += 'px';
                    centred.style[Modernizr.prefixed('transform')] = 'translateX(' + tr_x + ') translateY(' + tr_y + ') scale(' + scale + ')';
                }
            }

            [].forEach.call(resizables, resizable => {

                slide = resizable.closest('.slide');
                header = resizable.closest('.slide__details').querySelector('.slide__header');
                cell = resizable.closest('.fp-tableCell');

                viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
                viewport_width = cell.offsetWidth;

                element_height = parseInt(resizable.getAttribute('data-height'), 10);
                element_width = parseInt(resizable.getAttribute('data-width'), 10);

                scale_x = availabale_height / element_height;
                scale_y = availabale_width / element_width;
                scale = Math.min(scale_x, scale_y);

                if (viewport_width > this.mobile) {
                    // tablet and desktop resolution

                    availabale_height = viewport_height - header_height - delta;
                    availabale_width = viewport_width / 2 - 40;

                    scale_x = availabale_height / element_height;
                    scale_y = availabale_width / element_width;
                    scale = Math.min(scale_x, scale_y);

                    if (availabale_height < this.min_height) {

                        slide.classList.add('slide_hide-resizable');
                    } else if (scale < 1) {

                        slide.classList.remove('slide_hide-resizable');
                        resizable.style[Modernizr.prefixed('transform')] = 'scale(' + scale + ')';

                        if (slide.classList.contains('slide_right')) {
                            border_width = parseInt(resizable.getAttribute('data-width'), 10) * scale;
                            header.style.borderLeftWidth = border_width + 'px';

                            if (viewport_width > this.tablet) {
                                // tablet resolution
                                resizable.style.marginRight = header.offsetWidth / 2 - border_width + 'px';
                            }
                        } else {
                            border_width = parseInt(resizable.getAttribute('data-width'), 10) * scale;
                            header.style.borderRightWidth = border_width + 'px';

                            if (viewport_width > this.tablet) {
                                // tablet resolution
                                resizable.style.marginLeft = header.offsetWidth / 2 - border_width + 'px';
                            }
                        }
                    } else {
                        slide.classList.remove('slide_hide-resizable');
                        resizable.removeAttribute('style');
                        header.removeAttribute('style');
                    }
                } else {
                    // mobile resolution
                    availabale_height = viewport_height - header_height - header.offsetHeight - 60;
                    availabale_width = viewport_width - 40;

                    scale_x = availabale_height / element_height;
                    scale_y = availabale_width / element_width;
                    scale = Math.min(scale_x, scale_y);

                    if (availabale_width < element_width) {
                        resizable.style.marginLeft = -((element_width - availabale_width) / 2 - 20) + "px";
                    } else {
                        resizable.style.marginLeft = 'auto';
                    }

                    if (availabale_height < 200) {
                        console.log('hidding');
                        slide.classList.add('slide_hide-resizable');
                    } else if (scale < 1) {

                        slide.classList.remove('slide_hide-resizable');
                        resizable.style[Modernizr.prefixed('transform')] = 'scale(' + scale + ')';
                    } else {
                        slide.classList.remove('slide_hide-resizable');
                        resizable.removeAttribute('style');
                        header.removeAttribute('style');
                    }
                }
            });

            this.onResize();
        }

        scrollToTop(event) {
            event.preventDefault();
            $.fn.fullpage.moveTo(1, 0);
        }
    }
    new Landging();
})();
"use strict";

(function () {
    window.mobileAndTabletcheck = function () {
        var check = false;
        (function (a) {
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };

    window.isMobile = {
        Android: function () {
            return (/Android/i.test(navigator.userAgent)
            );
        },
        BlackBerry: function () {
            return (/BlackBerry/i.test(navigator.userAgent)
            );
        },
        iOS: function () {
            return (/iPhone|iPad|iPod/i.test(navigator.userAgent)
            );
        },
        Windows: function () {
            return (/IEMobile/i.test(navigator.userAgent)
            );
        },
        any: function () {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows();
        }
    };

    class Layout {
        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor() {
            let ready = new Promise((resolve, reject) => {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", () => resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Adding events and properties
         */
        init() {
            if (window.isMobile.Android()) {
                document.body.parentNode.classList.add('android');
            } else if (window.isMobile.iOS()) {
                document.body.parentNode.classList.add('ios');
            } else if (window.mobileAndTabletcheck()) {
                document.body.parentNode.classList.add('unknown-mobile');
            } else {
                document.body.parentNode.classList.add('desktop');
            }
        }
    }
    new Layout();
})();
"use strict";

(function () {
    class Menu {
        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor() {
            let ready = new Promise((resolve, reject) => {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", () => resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Adding events and properties
         */
        init() {

            if (document.querySelector('.login') == null) {
                return;
            }

            let back_buttons = document.querySelectorAll('.login__back'),
                login_buttons = document.querySelectorAll('.login__login-button, .login_success .login__submit'),
                mobile_popup_buttons = document.querySelectorAll('.menu__interpreter, .header__interpreter');

            this.menu_popup_open = false;

            this.login_button = document.querySelector('.menu__login');
            //this.login_button =             document.querySelector('.menu__login_button');
            this.register_button = document.querySelector('.menu__register');

            this.step1 = document.querySelector('.login_register-step-1');
            this.step1_form = document.querySelector('.login_register-step-1 form.login__form');
            this.step2 = document.querySelector('.login_register-step-2');
            this.step2_form = document.querySelector('.login_register-step-2 form.login__form');

            this.login_form = document.querySelector('.login_login form.login__form');

            this.mobile_popup = document.querySelector('.popup_mobile');
            this.mobile_popup_close = this.mobile_popup.querySelector('.popup__close');

            this.wrapper = document.querySelector('.menu__wrapper');
            this.header_register_button = document.querySelector('.header__link_register');
            this.header_login_button = document.querySelector('.header__link_login');
            this.recovery_button = document.querySelector('.login__password-recovery');
            this.lightbox = document.querySelector('body>.lightbox');
            this.login_popup = document.querySelector('.login_login');
            this.recovery = document.querySelector('.login_recovery');
            this.password = document.querySelector('.login_password');
            this.recovery_form = this.recovery.querySelector('.login__form');
            this.password_form = this.password.querySelector('.login__form');

            this.error_message = document.querySelector('.alert_form-send-fail');

            this.email = document.querySelector('.login_email');
            this.success = document.querySelector('.login_success');

            this.current = document.querySelector('.login_open');
            this.last = [];

            if (this.login_button) {
                this.login_button.addEventListener('click', this.openLoginForm.bind(this));
            }

            this.recovery_button.addEventListener('click', this.openRecovery.bind(this));
            this.lightbox.addEventListener('click', this.closeAll.bind(this));
            this.register_button.addEventListener('click', this.openRegister.bind(this));

            if (this.header_login_button) {
                this.header_login_button.addEventListener('click', this.openLoginOuter.bind(this));
            }
            if (this.header_register_button) {
                this.header_register_button.addEventListener('click', this.openRegisterOuter.bind(this));
            }

            this.mobile_popup_close.addEventListener('click', this.closeMobilePopup.bind(this));

            this.recovery_form.addEventListener('submit', this.sendData.bind(this));
            this.password_form.addEventListener('submit', this.sendData.bind(this));
            this.step1_form.addEventListener('submit', this.openNext.bind(this));
            this.step2_form.addEventListener('submit', this.sendData.bind(this));
            this.login_form.addEventListener('submit', this.sendData.bind(this));

            window.addEventListener('resize', this.reposPopup.bind(this));

            $('select.language_from').select2();
            $('select.language_to').select2();
            $('select.language_location').select2();

            this.language_from = document.querySelector('.language_from');
            this.language_to = document.querySelector('.language_to');
            this.language_location = document.querySelector('.language_location');

            $(".login select.language_from").on("change", this.changeFromLanguage.bind(this));

            [].forEach.call(document.querySelectorAll('.login'), element => {
                element.style.visibility = "visible";
            });

            [].forEach.call(mobile_popup_buttons, button => {
                button.addEventListener('click', this.openMobilePopup.bind(this));
            });

            [].forEach.call(back_buttons, button => {
                button.addEventListener('click', this.goback.bind(this));
            });

            [].forEach.call(login_buttons, button => {
                button.addEventListener('click', this.openLoginInner.bind(this));
            });

            this.WebRTCSupport = !document.documentElement.classList.contains('no-peerconnection');

            if (!this.WebRTCSupport) {

                [].forEach.call(document.querySelectorAll('form.login__form input, form.login__form button, form.login__form select'), element => {
                    element.setAttribute("disabled", "disabled");
                });

                [].forEach.call(document.documentElement.querySelectorAll('form.login__form'), form => {
                    form.addEventListener("click", event => {
                        form.closest('.login').querySelector('.popup_browser').open();
                    });
                });

                [].forEach.call(document.querySelectorAll('.popup_browser'), popup => {
                    this.showPopup(popup);
                });
            }
        }

        changeFromLanguage() {
            let value_from = this.language_from.value,
                value_to = this.language_to.value;

            if (value_from === value_to) {
                this.language_to.selectedIndex = 0;
                $(this.language_to).select2("val", "");
            }

            [].forEach.call(this.language_to.querySelectorAll('option[value][disabled]'), to_enable => {
                to_enable.removeAttribute('disabled');
            });

            [].forEach.call(this.language_to.querySelectorAll('option[value="' + value_from + '"]'), to_disable => {
                to_disable.setAttribute('disabled', 'disabled');
            });

            // inefficient, but it look lite there are no other way correctly disable/enable select2 dynamically
            $(this.language_to).select2();
        }

        openNext(event) {
            event.preventDefault();

            this.step1_data = {
                from: $('select.language_from').select2("val"),
                to: $('select.language_to').select2("val"),
                location: $('select.language_location').select2("val")
            };

            if (this.step1_form.validate() == false) {
                return;
            }

            this.openForm(this.step2);
        }

        reposPopup(event) {
            if (!this.menu_popup_open) {
                return;
            }
            this.mobile_popup.style[Modernizr.prefixed('transform')] = "translateY(" + this.mobile_popup.offsetHeight + "px)";
        }

        closeMobilePopup() {
            if (!this.menu_popup_open) {
                return;
            }
            this.menu_popup_open = false;

            Velocity(this.mobile_popup, "stop");
            Velocity(this.mobile_popup, { translateY: 0 }, 250);

            Velocity(this.mobile_popup_button, "stop");
            Velocity(this.mobile_popup_button, {
                opacity: 1
            }, {
                duration: 250,
                begin: () => {
                    this.mobile_popup_button.style.display = "block";
                }
            });
        }

        openMobilePopup() {
            if (this.menu_popup_open) {
                return;
            }
            this.menu_popup_open = true;

            Velocity(this.mobile_popup, "stop");
            Velocity(this.mobile_popup, { translateY: this.mobile_popup.offsetHeight + "px" }, 250);

            Velocity(this.mobile_popup_button, "stop");
            Velocity(this.mobile_popup_button, {
                opacity: 0
            }, {
                duration: 250,
                complete: () => {
                    this.mobile_popup_button.style.display = "none";
                }
            });
        }

        showPopup(popup) {
            if (popup.show != undefined) {
                popup.show();
            } else {
                setTimeout(this.showPopup.bind(this, popup), 50);
            }
        }

        /**
         * @description Scroll to first slide and open login form
         */
        openLoginOuter(event) {
            event.preventDefault();
            $.fn.fullpage.moveTo(1, 0);
            setTimeout(() => {
                this.login_button.click();
            }, 800);
        }

        /**
         * @description Scroll to first slide and open register form
         */
        openRegisterOuter(event) {
            event.preventDefault();
            $.fn.fullpage.moveTo(1, 0);
            setTimeout(() => {
                this.register_button.click();
            }, 800);
        }

        /**
         * @description Send registration data and show message
         */
        sendData(event) {
            event.preventDefault();
            let form = event.currentTarget;

            console.log('sending');

            if (form.validate() == false) {
                return;
            }

            try {
                let DONE = 4,
                    OK = 200,
                    after_action,
                    xhr = new XMLHttpRequest(),
                    loaded,
                    index,
                    response,
                    data = new FormData(form);

                if (this.step1_data != null) {
                    data.append('fos_user_registration_form[translatorProfile][nativeLanguage]', this.step1_data.from);
                    data.append('fos_user_registration_form[translatorProfile][foreignLanguage]', this.step1_data.to);
                    data.append('fos_user_registration_form[country]', this.step1_data.location);
                }

                loaded = new Promise((resolve, reject) => {
                    xhr.open('POST', form.getAttribute('action'));
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.send(data);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === DONE) {
                            if (xhr.status === OK) {
                                setTimeout(() => {
                                    this.clearAll();
                                }, 500);
                                this.step1Data = null;
                                resolve();
                            } else {
                                reject({
                                    code: parseInt(xhr.status, 10),
                                    message: xhr.statusText,
                                    response: xhr.responseText,
                                    form: form
                                });
                            }
                        }
                    };
                });

                if (form.hasAttribute('data-success')) {
                    after_action = this.redirectTo.bind(this, form.getAttribute('data-success'));
                } else if (form.hasAttribute('data-check')) {
                    after_action = this.showCheckMessage.bind(this);
                } else {
                    after_action = this.showSuccessMessage.bind(this);
                }

                loaded.then(after_action).catch(this.showErrorMessage.bind(this));
                // loaded.then(after_action).catch(after_action);
            } catch (err) {
                console.log('error: ', err);
            }
        }

        /**
         * @description Redirect to url
         */
        redirectTo(url) {
            document.location.href = url;
        }

        /**
         * @description Show check email message
         */
        showCheckMessage() {
            this.last = new Array();
            this.openForm(this.email, true);
        }

        /**
         * @description Show success message
         */
        showSuccessMessage() {
            this.last = new Array();
            this.openForm(this.success);
        }

        /**
         * @description Open login
         */
        openLoginInner() {
            this.openForm(this.login_popup);
        }

        /**
         * @description Show message
         */
        showErrorMessage(reason) {
            // this.last = new Array();
            var message_text = null,
                skip_popup = false,
                form = this.current.querySelector('form');

            var isset = function (fn) {
                var value;
                try {
                    value = fn();
                } catch (e) {
                    value = undefined;
                } finally {
                    return value !== undefined;
                }
            };

            if (reason.response) {
                var response = JSON.parse(reason.response);
                if (isset(() => response.error)) {
                    message_text = response.error;
                }
                if (isset(() => response.content.form.children.email.errors)) {
                    skip_popup = true;
                    message_text = response.content.form.children.email.errors[0];
                    form.invalidate('#fos_user_registration_form_email', message_text);
                }
            }
            console.log(reason.code, 'Response status code: ' + reason.code + '. ' + reason.message + '.');

            if (!skip_popup) {
                this.error_message.open(message_text);
            }
        }

        /**
         * @description Open last page
         */
        goback() {
            this.openForm();
        }

        /**
         * @description Show email sent warning
         */
        emailHaveSend() {
            this.last = new Array();
            this.openForm(this.email);
        }

        /**
         * @description Open register form
         */
        openRegisterInner() {
            this.openForm(this.step1);
        }

        /**
         * @description Open register form
         */
        openRegister() {
            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);

            let props = {
                right: 0
            },
                options = {
                duration: 250
            };

            Velocity(this.step1, props, options);
            this.current = this.step1;

            props = {
                opacity: 1
            }, options = {
                begin: () => {
                    this.lightbox.style.display = "block";
                },
                duration: 250
            };

            Velocity(this.lightbox, props, options);
        }

        /**
         * @description Open recovery forms
         */
        openRecovery(event) {
            event.preventDefault();
            if (!this.WebRTCSupport) {
                return;
            }
            this.openForm(this.recovery);
        }

        /**
         * @description Open recovery forms
         * @param form {node} Form you want to open
         * @param back {node} Form which you want to open when user press back, by default — last form opened
         */
        openForm(popup, dont_save) {
            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);

            var form = this.current.querySelector('form');

            // $('select.language_from').select2("val", "");
            // $('select.language_to').select2("val", "");
            // $('select.language_location').select2("val", "");
            // if ((form != null) && (typeof form.clear != 'undefined')) {
            //     setTimeout(()=>{
            //         if (form!=null) {
            //             form.clear();
            //         }
            //     }, 500);
            // }

            if (typeof popup == "undefined" && this.last.length > 0) {
                popup = this.last.pop();
            } else if (typeof popup == "undefined" && this.last.length == 0) {
                this.closeAll();
                return;
            } else if (dont_save != true) {
                this.last.push(this.current);
            }

            // form = popup.querySelector('form');
            // if (form != null) {
            //     setTimeout(()=>{
            //         if (form!=null) {
            //             form.clear();
            //         }
            //     }, 500);
            // }

            let props = {
                right: -this.current.offsetWidth + "px"
            },
                options = {
                duration: 250
            };

            Velocity(this.current, props, options);
            props = {
                right: 0
            }, options = {
                duration: 250
            };

            Velocity(popup, props, options);
            this.current = popup;
        }

        /**
         * @description Close all forms
         */
        closeAll() {

            $.fn.fullpage.setAllowScrolling(true);
            $.fn.fullpage.setKeyboardScrolling(true);

            let props = {
                right: -this.current.offsetWidth + "px"
            },
                options = {
                duration: 250
            };

            Velocity(this.current, props, options);
            this.current = null;

            props = {
                opacity: 0
            }, options = {
                complete: () => {
                    this.lightbox.style.display = "none";
                },
                duration: 250
            };

            Velocity(this.lightbox, props, options);
            setTimeout(() => {
                this.clearAll();
            }, 500);
        }

        clearAll() {
            console.log('clearing');
            [].forEach.call(document.querySelectorAll('form'), form => {
                form.clear();
            });
        }

        /**
         * @description Open login popup
         */
        openLoginForm(event) {
            event.preventDefault();

            $.fn.fullpage.setAllowScrolling(false);
            $.fn.fullpage.setKeyboardScrolling(false);

            let props = {
                right: 0
            },
                options = {
                duration: 250
            };

            Velocity(this.login_popup, props, options);
            this.current = this.login_popup;

            props = {
                opacity: 1
            }, options = {
                begin: () => {
                    this.lightbox.style.display = "block";
                },
                duration: 250
            };

            Velocity(this.lightbox, props, options);
        }
    }

    new Menu();
})();
"use strict";

(function () {

    /**
     * @class Popup
     */
    class Popup {
        /**
         * @description Adding events and properties
         * @constructor
         */
        constructor(popup) {
            this.popup = popup;
            popup.querySelector('.popup__close').addEventListener('click', this.close.bind(this));
            this.popup.close = this.close.bind(this);
            this.popup.open = this.open.bind(this);
            this.popup.show = this.show.bind(this);
            this.status = false;
            this.jamping = false;
        }

        show() {
            this.popup.style.display = "block";
            this.popup.style[Modernizr.prefixed('transform')] = "rotateX(0)";
            this.status = true;
        }

        hide() {
            this.popup.style.display = "none";
            this.popup.style[Modernizr.prefixed('transform')] = "rotateX(180deg)";
            this.status = false;
            Velocity(this.popup, "stop");
        }

        close() {
            if (this.jamping) {
                return;
            }
            if (!this.status) {
                return;
            }
            Velocity(this.popup, "finish");
            Velocity(this.popup, {
                rotateX: "120deg"
            }, {
                duration: 500,
                begin: () => {
                    this.popup.style.display = "block";
                },
                complete: () => {
                    this.status = false;
                }
            });
        }

        open() {
            if (this.jamping) {
                return;
            }
            if (this.status) {
                this.jump();
                return;
            }
            this.jamping = true;
            Velocity(this.popup, "finish");
            Velocity(this.popup, {
                rotateX: "0deg"
            }, {
                duration: 500,
                begin: () => {
                    this.popup.style.display = "block";
                },
                complete: () => {
                    this.status = true;
                }
            });
            Velocity(this.popup, { rotateX: "20deg" }, 150);
            Velocity(this.popup, { rotateX: "0deg" }, 125);
            Velocity(this.popup, { rotateX: "10deg" }, 200);
            Velocity(this.popup, { rotateX: "0deg" }, {
                duration: 175,
                complete: () => {
                    this.jamping = false;
                }
            });
        }

        jump() {
            this.jamping = true;
            Velocity(this.popup, "finish");
            Velocity(this.popup, { rotateX: "35deg" }, 150);
            Velocity(this.popup, { rotateX: "0deg" }, 125);
            Velocity(this.popup, { rotateX: "20deg" }, 200);
            Velocity(this.popup, { rotateX: "0deg" }, 175);
            Velocity(this.popup, { rotateX: "15deg" }, 250);
            Velocity(this.popup, { rotateX: "0deg" }, {
                duration: 225,
                complete: () => {
                    this.jamping = false;
                }
            });
        }

    }

    let ready = new Promise((resolve, reject) => {
        if (document.readyState != "loading") return resolve();
        document.addEventListener("DOMContentLoaded", () => resolve());
    });

    ready.then(() => {
        [].forEach.call(document.querySelectorAll('.popup_browser'), popup => {
            new Popup(popup);
        });

        [].forEach.call(document.querySelectorAll('.popup_common'), popup => {
            new Popup(popup);
            if (popup.classList.contains('popup_open')) {
                popup.open();
            }
        });
    });
})();
"use strict";

(function () {

    /**
     * @classdesc Class representing form validation
     * @class
     */

    class Validation {
        /**
         * @description Adding events and properties
         * @constructor
         */
        constructor(form) {
            this.form = form;
            form.setAttribute("novalidate", "novalidate");
            form.addEventListener('submit', this.validate.bind(this));
            form.validate = this.validate.bind(this);
            form.invalidate = this.invalidate.bind(this);
            form.clear = this.clear.bind(this);

            this.messages = {
                en: {
                    required: "Required field",
                    email: "Wrong email format",
                    equal: "Password fields should be equal",
                    unequal: "Languages shouldn't be equal",
                    unselected: "You should select value from dropdown",
                    url: "Wrong url format"
                },
                ru: {
                    required: "Поле обязательно для заполнения",
                    email: "Проверьте формат email",
                    equal: "Пароли должны совпадать",
                    unequal: "Языки не должны совпадать",
                    unselected: "Не выбрано значение из списка",
                    url: "Проверьте формат URL"
                }
            };
        }

        /**
         * @description Reset form and clear errors
         */
        clear() {

            let selects = $(this.form).find('select'),
                index = selects.length;
            while (index--) {

                if (typeof selects[index].select2 != null) {
                    $(selects[index]).select2("val", "");
                } else {
                    selects[index].selectedIndex = 0;
                }

                [].forEach.call(selects[index].querySelectorAll('option[value][disabled]'), option => {
                    option.removeAttribute('disabled');
                });
            }

            this.form.reset();

            setTimeout(() => {
                let errors = document.querySelectorAll('.form-error'),
                    fields = document.querySelectorAll('[data-valid], [data-invalid]');

                [].forEach.call(errors, error => {
                    error.parentNode.removeChild(error);
                });

                [].forEach.call(fields, field => {
                    field.removeAttribute('data-invalid');
                    field.removeAttribute('data-valid');
                });
            }, 100);
        }

        /**
         * @description Remove error message after element
         * @param {Node} element - element, after which we will add error message
         * @param {String} message - error message
         * @param {String} typpe - error type
         */
        addError(element, message, type) {

            if (element.parentNode.querySelector('.form-error[data-type="' + type + '"]') != null) {
                return;
            }
            let error = document.createElement('P');
            error.appendChild(document.createTextNode(message));
            error.classList.add('form-error');
            error.setAttribute('data-type', type);
            element.parentNode.appendChild(error);
        }

        /**
         * @description Remove error message of some type after element
         * @param {Node} element - element, after which error message is
         * @param {String} typpe - error type
         */
        clearError(element, type) {

            let err = element.parentNode.querySelector('.form-error[data-type="' + type + '"]');
            if (err != null) {
                element.parentNode.removeChild(err);
            }
        }

        invalidate(field_selector, custom_error) {
            let element = this.form.querySelector(field_selector);
            let invalid = document.createAttribute("data-invalid");
            element.setAttributeNode(invalid);
            element.removeAttribute('data-valid');
            this.addError(element, custom_error, "custom");
        }

        /**
         * @description Validate form
         * @param {Event} event - submit event
         * @todo Implement login validation
         */
        validate(event) {
            if (typeof event != "undefined" && !event.currentTarget.hasAttribute('data-reload')) {
                event.preventDefault();
            }

            let valid = true,
                next = null,
                equal_fields = this.form.querySelectorAll('[data-equal]'),
                unequal_fields = this.form.querySelectorAll('[data-unequal]'),
                required_fields = this.form.querySelectorAll('[required]'),
                url_fields = this.form.querySelectorAll('input[type="url"]'),
                email_fields = this.form.querySelectorAll('input[type="email"]'),
                url_regex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$", "i"),
                email_regex = new RegExp("^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$");

            /* Remove custom errors */
            [].forEach.call(this.form.querySelectorAll('[data-type-custom]'), element => {
                element.parentNode.removeChild(element);
            });

            /* check equal fields */
            [].forEach.call(equal_fields, element => {
                let equal = this.form.querySelector(element.getAttribute("data-equal"));
                if (element.value.trim() != equal.value.trim()) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].equal, "equal");
                } else {
                    this.clearError(element, "equal");
                }
            });

            /* check unequal fields */
            [].forEach.call(unequal_fields, element => {
                let unequal = this.form.querySelector(element.getAttribute("data-unequal"));

                if (unequal.selectedIndex < 0 || element.selectedIndex < 0) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].unselected, "unselected");
                    return;
                }

                if (element.options[element.selectedIndex].value.trim() == unequal.options[unequal.selectedIndex].value.trim()) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].unequal, "unequal");
                } else {
                    this.clearError(element, "unequal");
                }
            });

            /* check required fields */
            [].forEach.call(required_fields, element => {
                if (element.value.trim() === "") {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].required, "required");
                } else {
                    this.clearError(element, 'required');
                }
            });

            /* check url fields */
            [].forEach.call(url_fields, element => {
                if (element.value.trim().length > 0 && url_regex.test(element.value.trim()) === false) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].url, 'url');
                } else {
                    this.clearError(element, 'url');
                }
            });

            /* check email fields */
            [].forEach.call(email_fields, element => {
                if (element.value.trim().length > 0 && email_regex.test(element.value.trim()) === false) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].email, 'email');
                } else {
                    this.clearError(element, 'email');
                }
            });

            let all_fields = Array.prototype.slice.call(equal_fields).concat(Array.prototype.slice.call(required_fields), Array.prototype.slice.call(url_fields), Array.prototype.slice.call(email_fields));

            [].forEach.call(all_fields, element => {
                let err = element.parentNode.querySelector('.form-error');
                if (err != null) {
                    let invalid = document.createAttribute("data-invalid");
                    invalid.value = true;

                    if (element.tagName == "SELECT") {
                        element.nextSibling.setAttributeNode(invalid);
                        element.nextSibling.removeAttribute('data-valid');
                    } else {
                        element.setAttributeNode(invalid);
                        element.removeAttribute('data-valid');
                    }
                } else {

                    let valid = document.createAttribute("data-valid");
                    valid.value = true;
                    if (element.tagName == "SELECT") {
                        element.nextSibling.setAttributeNode(valid);
                        element.nextSibling.removeAttribute('data-invalid');
                    } else {
                        element.setAttributeNode(valid);
                        element.removeAttribute('data-invalid');
                    }
                }
            });

            let errors_count = this.form.querySelectorAll('.form_error').length;
            if (errors_count > 0) {
                valid = false;
            }

            if (valid === false) {
                if (typeof event != "undefined") {
                    event.preventDefault();
                }
            }

            return valid;
        }
    }

    let ready = new Promise((resolve, reject) => {
        if (document.readyState != "loading") return resolve();
        document.addEventListener("DOMContentLoaded", () => resolve());
    });

    ready.then(function () {
        let forms = document.querySelectorAll('form');
        [].forEach.call(forms, form => {
            new Validation(form);
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFsZXJ0L2FsZXJ0LmpzIiwiY29udGFjdC9jb250YWN0cy5qcyIsImxhbmRpbmcvbGFuZGluZy5qcyIsImxheW91dC9sYXlvdXQuanMiLCJsb2dpbi9sb2dpbi5qcyIsInBvcHVwL3BvcHVwLmpzIiwidmFsaWRhdG9yL3ZhbGlkYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLENBQUMsWUFBWTs7Ozs7QUFLVCxVQUFNLEtBQUssQ0FBQzs7Ozs7QUFLUixtQkFBVyxDQUFFLEtBQUssRUFBRTtBQUNoQixnQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsZ0JBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNGLGdCQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN6QyxnQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkMsZ0JBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDckQsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3ZCOztBQUVELGFBQUssQ0FBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2xCLGdCQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNkLHVCQUFPO2FBQ1Y7O0FBRUQsZ0JBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksTUFBTSxFQUFFO0FBQ2pDLHVCQUFPO2FBQ1Y7O0FBRUQsb0JBQVEsQ0FBQyxJQUFJLENBQUMsS0FB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Q0FBQyxDQUFDOztBQUVILGdCQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUNwRSxnQkFBSSxZQUFZLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLHFCQUFLLEdBQUcsS0FBSyxDQUFDO2FBQ2pCOztBQUVELGdCQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDakIsb0JBQUksT0FBTyxLQUFLLElBQUksV0FBVyxFQUFFO0FBQzdCLHlCQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7aUJBQzFCO2FBQ0o7O0FBRUQsbUJBQU8sS0FBSyxDQUFDO1NBRWhCO0tBQ0o7O0FBR0QsUUFBSSxLQUFLLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxLQUFLO0FBQ3pDLFlBQUksUUFBUSxDQUFDLFVBQVUsSUFBSSxTQUFTLEVBQUUsT0FBTyxPQUFPLEVBQUUsQ0FBQztBQUN2RCxnQkFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLE1BQU0sT0FBTyxFQUFFLENBQUMsQ0FBQztLQUNsRSxDQUFDLENBQUM7O0FBRUgsU0FBSyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQ2xCLFlBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5QyxVQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQUFBQyxJQUFJLElBQUs7QUFDN0IsZ0JBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCLENBQUMsQ0FBQztLQUNOLENBQUMsQ0FBQztDQUVOLENBQUEsRUFBRyxDQUFDIiwiZmlsZSI6InNjcmlwdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbihmdW5jdGlvbiAoKSB7XG5cbiAgICAvKipcbiAgICAgKiBAY2xhc3MgUG9wdXBcbiAgICAgKi9cbiAgICBjbGFzcyBBbGVydCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkaW5nIGV2ZW50cyBhbmQgcHJvcGVydGllc1xuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yIChhbGVydCkge1xuICAgICAgICAgICAgdGhpcy5hbGVydCA9IGFsZXJ0O1xuICAgICAgICAgICAgdGhpcy5hbGVydC5xdWVyeVNlbGVjdG9yKCcuYWxlcnRfX2Nsb3NlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5hbGVydC5jbG9zZSA9IHRoaXMuY2xvc2UuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuYWxlcnQub3BlbiA9IHRoaXMub3Blbi5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5hbGVydC50ZXh0ID0gYWxlcnQucXVlcnlTZWxlY3RvcignLmFsZXJ0X190ZXh0JylcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjbG9zZSAoZXZlbnQsIHN0YXR1cykge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHN0YXR1cyAmJiB0aGlzLnN0YXR1cyAhPSBzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMuYWxlcnQsIFwiZmluaXNoXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5hbGVydCwge1xuICAgICAgICAgICAgICAgIHRyYW5zbGF0ZVk6IDBcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcGVuICh0ZXh0KSB7XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKi9cblxuICAgICAgICAgICAgaWYgKCEgdGV4dCkge1xuICAgICAgICAgICAgICAgIHRleHQgPSAnUGxlYXNlIGNoZWNrIHRoZSBjcmVkZW50aWFscyBhbmQgdHJ5IGFnYWluLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5hbGVydCk7XG4gICAgICAgICAgICB0aGlzLmFsZXJ0LnRleHQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBuZXcgRGF0ZSgpLmdldFVUQ01pbGxpc2Vjb25kcygpO1xuICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHRoaXMuc3RhdHVzO1xuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmFsZXJ0LCBcImZpbmlzaFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMuYWxlcnQsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2xhdGVZOiB0aGlzLmFsZXJ0Lm9mZnNldEhlaWdodCArIFwicHhcIlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTBcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZShudWxsLCBzdGF0dXMpO1xuICAgICAgICAgICAgICAgICAgICB9LCAzMDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9IFwibG9hZGluZ1wiKSByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKT0+IHJlc29sdmUoKSk7XG4gICAgfSk7XG5cbiAgICByZWFkeS50aGVuKCgpPT57XG4gICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuYWxlcnQnKSwgKGFsZXJ0KSA9PiB7XG4gICAgICAgICAgICBuZXcgQWxlcnQoYWxlcnQpO1xuICAgICAgICAgICAgaWYgKGFsZXJ0LmNsYXNzTGlzdC5jb250YWlucygnYWxlcnRfb3BlbicpKXtcbiAgICAgICAgICAgICAgICBhbGVydC5vcGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4oZnVuY3Rpb24oKSB7XG4gICAgY2xhc3MgQ29udGFjdHMge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFN0YXJ0IGluaXRpYWxpemF0aW9uIG9uIGRvbWxvYWRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRpbmdcIikgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkaW5nIGV2ZW50cyBhbmQgcHJvcGVydGllc1xuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcbiAgICAgICAgICAgIHRoaXMubWFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRhY3RfX21hcCcpO1xuICAgICAgICAgICAgaWYodGhpcy5tYXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLnN0eWxlLmhlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKSAtIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0X193cmFwcGVyJykub2Zmc2V0SGVpZ2h0IC0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpLm9mZnNldEhlaWdodCAtIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS5vZmZzZXRIZWlnaHQgLSA1MiArIFwicHhcIjtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXNpemUgKCkge1xuICAgICAgICAgICAgaWYodGhpcy5tYXAgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMubWFwLnN0eWxlLmhlaWdodCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKSAtIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250YWN0X193cmFwcGVyJykub2Zmc2V0SGVpZ2h0IC0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3RlcicpLm9mZnNldEhlaWdodCAtIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKS5vZmZzZXRIZWlnaHQgLSA1MiArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBuZXcgQ29udGFjdHM7XG59KSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4oZnVuY3Rpb24oKSB7XG4gICAgY2xhc3MgTGFuZGdpbmcge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFN0YXJ0IGluaXRpYWxpemF0aW9uIG9uIGRvbWxvYWRcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRpbmdcIikgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkaW5nIGV2ZW50cyBhbmQgcHJvcGVydGllc1xuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCgpIHtcblxuICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmcnKSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmZpcmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnRhYmxldCA9IDEyMDA7XG4gICAgICAgICAgICB0aGlzLm1vYmlsZSA9IDc1MDtcbiAgICAgICAgICAgIHRoaXMubWluX2hlaWdodCA9IDI1MDtcbiAgICAgICAgICAgIHRoaXMubWV0YSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J3ZpZXdwb3J0J11cIik7XG5cbiAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcblxuICAgICAgICAgICAgbGV0IGhlYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXInKVxuICAgICAgICAgICAgICAgICwgY2xvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvY2snKVxuICAgICAgICAgICAgICAgICwgbWFpbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9tYWluJyk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbUZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgICAgICQoXCIubGFuZGluZ1wiKS5mdWxscGFnZSh7XG4gICAgICAgICAgICAgICAgc2VjdGlvblNlbGVjdG9yOiBcIi5sYW5kaW5nX19zZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgbmF2aWdhdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzY3JvbGxpbmdTcGVlZDogMzUwLFxuICAgICAgICAgICAgICAgIGFmdGVyTG9hZDogdGhpcy5oaWRlTG9hZGVyLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgYWZ0ZXJSZW5kZXI6IHRoaXMucmVjb3VudFNsaWRlcy5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGFmdGVyUmVzaXplOiB0aGlzLnJlY291bnRTbGlkZXMuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBvbkxlYXZlOiAoaW5kZXgsIG5leHRJbmRleCwgZGlyZWN0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIuY2xhc3NMaXN0LnRvZ2dsZSgnaGVhZGVyX29wZW4nLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGVOYXYoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlci5jbGFzc0xpc3QudG9nZ2xlKCdoZWFkZXJfb3BlbicsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93TmF2KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAobmV4dEluZGV4ID09IDYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2NrLmNsYXNzTGlzdC50b2dnbGUoJ2Nsb2NrX3Zpc2libGUnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsb2NrLmNsYXNzTGlzdC50b2dnbGUoJ2Nsb2NrX3Zpc2libGUnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuZm9vdGVyX190b3BcIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuc2Nyb2xsVG9Ub3AuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBsZXQgYWN0aXZlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxhbmRpbmdfX3NlY3Rpb24uYWN0aXZlJyk7XG4gICAgICAgICAgICBpZiAoYWN0aXZlICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlX21vbWVudCcsIHRydWUpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlX21vbWVudCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScsIHRydWUpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICBvblJlc2l6ZSAoKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgKE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKSA+IDQyMCApXG4gICAgICAgICAgICAgICAgJiYgKE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCwgd2luZG93LmlubmVyV2lkdGggfHwgMCkgPCA1MDApXG4gICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgIHRoaXMubWV0YS5zZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIsIFwid2lkdGg9NDAwXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGEuc2V0QXR0cmlidXRlKFwiY29udGVudFwiLCBcIndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xLjBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlTmF2ICgpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2LCBcImZpbmlzaFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubmF2LCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDBcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd05hdiAoKSB7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdiwgXCJmaW5pc2hcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm5hdiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMzAwXG4gICAgICAgICAgICAgICAgLCBiZWdpbjogKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmF2LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBoaWRlTG9hZGVyKCkge1xuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlyZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMubmF2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZwLW5hdicpO1xuICAgICAgICAgICAgdGhpcy5oaWRlTmF2KCk7XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVfX3Jlc2l6YWJsZSwgLnNsaWRlX19jZW50cmVkJyksIChyZXNpemFibGUpID0+IHtcbiAgICAgICAgICAgICAgICByZXNpemFibGUuc2V0QXR0cmlidXRlKCdkYXRhLWhlaWdodCcsIHJlc2l6YWJsZS5vZmZzZXRIZWlnaHQpO1xuICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnLCByZXNpemFibGUub2Zmc2V0V2lkdGgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGVyX193cmFwcGVyJyksXG4gICAgICAgICAgICAgICAgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2FkZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChsb2FkZXIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmVsb2NpdHkobG9hZGVyLCBwcm9wcywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHJlY291bnRTbGlkZXMoKSB7XG5cbiAgICAgICAgICAgIHRoaXMub25SZXNpemUoKTtcblxuICAgICAgICAgICAgbGV0IHJlc2l6YWJsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc2xpZGVfX3Jlc2l6YWJsZScpXG4gICAgICAgICAgICAgICAgLCBjZW50cmVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNsaWRlX19jZW50cmVkJylcbiAgICAgICAgICAgICAgICAsIHN0ZXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN0ZXBzX19zdGVwJylcbiAgICAgICAgICAgICAgICAsIHNlcnZpY2Vfc2xpZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfc2VydmljZScpXG4gICAgICAgICAgICAgICAgLCBzZXJ2aWNlX2lsbHVzdHJhdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9faWxsdXN0cmF0aW9uJylcbiAgICAgICAgICAgICAgICAsIG1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfbWFpbicpXG4gICAgICAgICAgICAgICAgLCBzaGVtYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaGVtYScpXG4gICAgICAgICAgICAgICAgLCBoZWFkZXJfaGVpZ2h0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcicpLm9mZnNldEhlaWdodFxuICAgICAgICAgICAgICAgICwgZm9vdGVyX2hlaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mb290ZXInKS5vZmZzZXRIZWlnaHRcbiAgICAgICAgICAgICAgICAsIHNoZW1hX2RldGFpbHMgPSBzaGVtYS5jbG9zZXN0KCcuc2xpZGVfX2RldGFpbHMnKVxuICAgICAgICAgICAgICAgICwgcGhvbmVzID0gbWFpbi5xdWVyeVNlbGVjdG9yKCcuc2xpZGVfX3Bob25lcycpXG4gICAgICAgICAgICAgICAgLCBwaG9uZSA9IG1haW4ucXVlcnlTZWxlY3RvcignLnNsaWRlX19waG9uZScpXG4gICAgICAgICAgICAgICAgLCB2aWV3cG9ydF9oZWlnaHRcbiAgICAgICAgICAgICAgICAsIHZpZXdwb3J0X3dpZHRoXG4gICAgICAgICAgICAgICAgLCBhdmFpbGFiYWxlX3dpZHRoXG4gICAgICAgICAgICAgICAgLCBhdmFpbGFiYWxlX2hlaWdodFxuICAgICAgICAgICAgICAgICwgZGVsdGEgPSAyMFxuICAgICAgICAgICAgICAgICwgY2VsbFxuICAgICAgICAgICAgICAgICwgc2l6ZVxuICAgICAgICAgICAgICAgICwgc2NhbGUgPSAxXG4gICAgICAgICAgICAgICAgLCBzY2FsZV94ID0gMVxuICAgICAgICAgICAgICAgICwgc2NhbGVfeSA9IDFcbiAgICAgICAgICAgICAgICAsIGhlYWRlclxuICAgICAgICAgICAgICAgICwgc2xpZGVcbiAgICAgICAgICAgICAgICAsIGJvcmRlcl93aWR0aFxuICAgICAgICAgICAgICAgICwgZGVsdGFfeVxuICAgICAgICAgICAgICAgICwgdHJfeVxuICAgICAgICAgICAgICAgICwgdHJfeFxuICAgICAgICAgICAgICAgICwgZWxlbWVudF93aWR0aFxuICAgICAgICAgICAgICAgICwgZWxlbWVudF9oZWlnaHRcbiAgICAgICAgICAgICAgICAsIGlsbHVzdHJhdGlvbl9oZWlnaHRcbiAgICAgICAgICAgICAgICAsIHdfd2lkdGhcbiAgICAgICAgICAgICAgICAsIHdfaGVpZ2h0XG4gICAgICAgICAgICAgICAgLCBpX3dpZHRoXG4gICAgICAgICAgICAgICAgLCBkZWxcbiAgICAgICAgICAgICAgICAsIGlfaGVpZ2h0O1xuXG4gICAgICAgICAgICBjZWxsID0gbWFpbi5xdWVyeVNlbGVjdG9yKCcuZnAtdGFibGVDZWxsJyk7XG4gICAgICAgICAgICB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1pbihjZWxsLm9mZnNldEhlaWdodCwgcGFyc2VJbnQoY2VsbC5zdHlsZS5oZWlnaHQsIDEwKSk7XG4gICAgICAgICAgICB2aWV3cG9ydF93aWR0aCA9IGNlbGwub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgIGhlYWRlciA9IG1haW4ucXVlcnlTZWxlY3RvcignLnNsaWRlX19oZWFkZXInKTtcbiAgICAgICAgICAgIG1haW4uc3R5bGUuYmFja2dyb3VuZFNpemUgPSBcImF1dG8gXCIgKyB2aWV3cG9ydF9oZWlnaHQgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGlmICh2aWV3cG9ydF93aWR0aCA+IDc1MCkge1xuICAgICAgICAgICAgICAgIGRlbCA9IDA7XG4gICAgICAgICAgICAgICAgc2l6ZSA9IDU1MDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVsID0gMTAwO1xuICAgICAgICAgICAgICAgIHNpemUgPSA0ODA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhdmFpbGFiYWxlX2hlaWdodCA9IHZpZXdwb3J0X2hlaWdodCAtIGRlbCAtIGhlYWRlci5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAoYXZhaWxhYmFsZV9oZWlnaHQgPj0gMjAwKVxuICAgICAgICAgICAgICAgICYmICh2aWV3cG9ydF93aWR0aCA+IDc1MClcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHBob25lcy5zdHlsZS5oZWlnaHQgPSBNYXRoLm1pbihhdmFpbGFiYWxlX2hlaWdodCwgc2l6ZSkgKyBcInB4XCI7XG4gICAgICAgICAgICAgICAgcGhvbmVzLnN0eWxlLm1hcmdpbkxlZnQgPSAtTWF0aC5taW4oYXZhaWxhYmFsZV9oZWlnaHQsIHNpemUpKjAuMSArIFwicHhcIjtcbiAgICAgICAgICAgICAgICBwaG9uZXMuc3R5bGUudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhdmFpbGFiYWxlX2hlaWdodCA8IDIwMCApIHtcbiAgICAgICAgICAgICAgICBwaG9uZXMuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBob25lcy5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgaWYgKHZpZXdwb3J0X3dpZHRoIDw9IDc1MCkge1xuICAgICAgICAgICAgICAgIHBob25lLnN0eWxlLmhlaWdodCA9IGF2YWlsYWJhbGVfaGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjZWxsID0gc2VydmljZV9zbGlkZS5xdWVyeVNlbGVjdG9yKCcuZnAtdGFibGVDZWxsJyk7XG4gICAgICAgICAgICB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1pbihjZWxsLm9mZnNldEhlaWdodCwgcGFyc2VJbnQoY2VsbC5zdHlsZS5oZWlnaHQsIDEwKSk7XG4gICAgICAgICAgICB2aWV3cG9ydF93aWR0aCA9IGNlbGwub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICBoZWFkZXIgPSBzZXJ2aWNlX3NsaWRlLnF1ZXJ5U2VsZWN0b3IoJy5zbGlkZV9faGVhZGVyJyk7XG4gICAgICAgICAgICBpbGx1c3RyYXRpb25faGVpZ2h0ID0gKE1hdGgubWluKGNlbGwub2Zmc2V0SGVpZ2h0LCBwYXJzZUludChjZWxsLnN0eWxlLmhlaWdodCwgMTApKSAtIGhlYWRlci5vZmZzZXRIZWlnaHQgLSBmb290ZXJfaGVpZ2h0IC0gaGVhZGVyX2hlaWdodCk7XG4gICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5zdHlsZS5oZWlnaHQgPSBpbGx1c3RyYXRpb25faGVpZ2h0ICsgXCJweFwiO1xuXG4gICAgICAgICAgICB3X3dpZHRoID0gNzAwO1xuICAgICAgICAgICAgd19oZWlnaHQgPSA1NzA7XG4gICAgICAgICAgICBpX3dpZHRoID0gdmlld3BvcnRfd2lkdGgqMS4yO1xuICAgICAgICAgICAgaV9oZWlnaHQgPSB3X2hlaWdodCppX3dpZHRoL3dfd2lkdGg7XG5cbiAgICAgICAgICAgIGlmIChpX2hlaWdodCA8IGlsbHVzdHJhdGlvbl9oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCdzbGlkZV9faWxsdXN0cmF0aW9uX2hpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjUwJSAxMDAlXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlsbHVzdHJhdGlvbl9oZWlnaHQgPCAzNzApIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCdzbGlkZV9faWxsdXN0cmF0aW9uX2hpZGRlbicsIHRydWUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5jbGFzc0xpc3QudG9nZ2xlKCdzbGlkZV9faWxsdXN0cmF0aW9uX2hpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlX2lsbHVzdHJhdGlvbi5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBcIjUwJSAwXCI7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgLy8gQ2VudHJlZCBzdHlsZVxuXG4gICAgICAgICAgICAvLyDQp9C40YHRgtC40Lwg0LLRgdC1INGB0YLQuNC70Lgg0L/RgNC40LLQvdC10YHQtdC90L3Ri9C1XG4gICAgICAgICAgICBjZW50cmVkLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChzdGVwcywgKHN0ZXApID0+IHtcbiAgICAgICAgICAgICAgICBzdGVwLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDApID4gNDgwICkge1xuXG4gICAgICAgICAgICAgICAgc2xpZGUgPSBjZW50cmVkLmNsb3Nlc3QoJy5zbGlkZScpO1xuICAgICAgICAgICAgICAgIGNlbGwgPSBjZW50cmVkLmNsb3Nlc3QoJy5mcC10YWJsZUNlbGwnKTtcbiAgICAgICAgICAgICAgICB2aWV3cG9ydF9oZWlnaHQgPSBNYXRoLm1pbihjZWxsLm9mZnNldEhlaWdodCwgcGFyc2VJbnQoY2VsbC5zdHlsZS5oZWlnaHQsIDEwKSk7XG4gICAgICAgICAgICAgICAgdmlld3BvcnRfd2lkdGggPSBjZWxsLm9mZnNldFdpZHRoO1xuXG4gICAgICAgICAgICAgICAgZWxlbWVudF9oZWlnaHQgPSBwYXJzZUludChjZW50cmVkLmdldEF0dHJpYnV0ZSgnZGF0YS1oZWlnaHQnKSwxMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmlld3BvcnRfd2lkdGggPiAxMjIwKXtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGVza3RvcFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50X3dpZHRoID0gMTIzMDtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGFfeSA9IDE3MDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCh2aWV3cG9ydF93aWR0aCA+IDc1MCkgJiYgKHZpZXdwb3J0X3dpZHRoIDw9IDEyMjApKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHRhYmxldFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50X3dpZHRoID0gMTA1MDtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGFfeSA9IDE3MDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBtb2JpbGVcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudF93aWR0aCA9IDQwMDtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudF9oZWlnaHQgPSA5MDA7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhX3kgPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGF2YWlsYWJhbGVfaGVpZ2h0ID0gdmlld3BvcnRfaGVpZ2h0IC0gaGVhZGVyX2hlaWdodDtcbiAgICAgICAgICAgICAgICBhdmFpbGFiYWxlX3dpZHRoID0gdmlld3BvcnRfd2lkdGggLSA0MDtcblxuICAgICAgICAgICAgICAgIHNjYWxlX3ggPSBhdmFpbGFiYWxlX2hlaWdodC9lbGVtZW50X2hlaWdodDtcbiAgICAgICAgICAgICAgICBzY2FsZV95ID0gYXZhaWxhYmFsZV93aWR0aC9lbGVtZW50X3dpZHRoO1xuICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0aC5taW4oTWF0aC5taW4oc2NhbGVfeCwgc2NhbGVfeSksMSk7XG5cbiAgICAgICAgICAgICAgICB0cl95ID0gMDtcbiAgICAgICAgICAgICAgICB0cl94ID0gMDtcblxuICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydF93aWR0aCA8IDc1MCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBtb2JpbGVcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBhdmFpbGFiYWxlX2hlaWdodC82MjA7XG4gICAgICAgICAgICAgICAgICAgIGNlbnRyZWQuc3R5bGVbTW9kZXJuaXpyLnByZWZpeGVkKCd0cmFuc2Zvcm0nKV0gPSAndHJhbnNsYXRlWCgtNTAlKSBzY2FsZSgnICsgc2NhbGUgKyAnKSc7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBub3QgbW9iaWxlXG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGF2YWlsYWJhbGVfd2lkdGggPCBlbGVtZW50X3dpZHRoICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJfeCA9IC0oZWxlbWVudF93aWR0aCAtIHZpZXdwb3J0X3dpZHRoKS8yIDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwc2NhbGUgdGV4dFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2NhbGU8MSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKHN0ZXBzLCAoc3RlcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXAuc3R5bGVbTW9kZXJuaXpyLnByZWZpeGVkKCd0cmFuc2Zvcm0nKV0gPSAnc2NhbGUoJyArIE1hdGgubWluKCgxL3NjYWxlKSowLjgsIDIpICsgJyknO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cl94ICs9IDMwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdHJfeCArPSAncHgnO1xuICAgICAgICAgICAgICAgICAgICBjZW50cmVkLnN0eWxlW01vZGVybml6ci5wcmVmaXhlZCgndHJhbnNmb3JtJyldID0gJ3RyYW5zbGF0ZVgoJyArIHRyX3ggKyAnKSB0cmFuc2xhdGVZKCcgKyB0cl95ICsgJykgc2NhbGUoJyArIHNjYWxlICsgJyknO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChyZXNpemFibGVzLCAocmVzaXphYmxlKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBzbGlkZSA9IHJlc2l6YWJsZS5jbG9zZXN0KCcuc2xpZGUnKTtcbiAgICAgICAgICAgICAgICBoZWFkZXIgPSByZXNpemFibGUuY2xvc2VzdCgnLnNsaWRlX19kZXRhaWxzJykucXVlcnlTZWxlY3RvcignLnNsaWRlX19oZWFkZXInKTtcbiAgICAgICAgICAgICAgICBjZWxsID0gcmVzaXphYmxlLmNsb3Nlc3QoJy5mcC10YWJsZUNlbGwnKTtcblxuICAgICAgICAgICAgICAgIHZpZXdwb3J0X2hlaWdodCA9IE1hdGgubWluKGNlbGwub2Zmc2V0SGVpZ2h0LCBwYXJzZUludChjZWxsLnN0eWxlLmhlaWdodCwgMTApKTtcbiAgICAgICAgICAgICAgICB2aWV3cG9ydF93aWR0aCA9IGNlbGwub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgICAgICBlbGVtZW50X2hlaWdodCA9IHBhcnNlSW50KHJlc2l6YWJsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGVpZ2h0JyksMTApO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRfd2lkdGggPSBwYXJzZUludChyZXNpemFibGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJyksMTApO1xuXG4gICAgICAgICAgICAgICAgc2NhbGVfeCA9IGF2YWlsYWJhbGVfaGVpZ2h0L2VsZW1lbnRfaGVpZ2h0O1xuICAgICAgICAgICAgICAgIHNjYWxlX3kgPSBhdmFpbGFiYWxlX3dpZHRoL2VsZW1lbnRfd2lkdGg7XG4gICAgICAgICAgICAgICAgc2NhbGUgPSBNYXRoLm1pbihzY2FsZV94LCBzY2FsZV95KTtcblxuXG4gICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0X3dpZHRoID4gdGhpcy5tb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFibGV0IGFuZCBkZXNrdG9wIHJlc29sdXRpb25cblxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiYWxlX2hlaWdodCA9IHZpZXdwb3J0X2hlaWdodCAtIGhlYWRlcl9oZWlnaHQgLSBkZWx0YTtcbiAgICAgICAgICAgICAgICAgICAgYXZhaWxhYmFsZV93aWR0aCA9IHZpZXdwb3J0X3dpZHRoLzIgLSA0MDtcblxuICAgICAgICAgICAgICAgICAgICBzY2FsZV94ID0gYXZhaWxhYmFsZV9oZWlnaHQvZWxlbWVudF9oZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlX3kgPSBhdmFpbGFiYWxlX3dpZHRoL2VsZW1lbnRfd2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIHNjYWxlID0gTWF0aC5taW4oc2NhbGVfeCwgc2NhbGVfeSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGF2YWlsYWJhbGVfaGVpZ2h0IDwgdGhpcy5taW5faGVpZ2h0ICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QuYWRkKCdzbGlkZV9oaWRlLXJlc2l6YWJsZScpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNjYWxlIDwgMSApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVfaGlkZS1yZXNpemFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5zdHlsZVtNb2Rlcm5penIucHJlZml4ZWQoJ3RyYW5zZm9ybScpXSA9ICdzY2FsZSgnICsgc2NhbGUgKyAnKSc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoJ3NsaWRlX3JpZ2h0Jykpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlcl93aWR0aCA9IChwYXJzZUludChyZXNpemFibGUuZ2V0QXR0cmlidXRlKCdkYXRhLXdpZHRoJyksMTApKSpzY2FsZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIuc3R5bGUuYm9yZGVyTGVmdFdpZHRoID0gYm9yZGVyX3dpZHRoICsgJ3B4JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydF93aWR0aCA+IHRoaXMudGFibGV0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YWJsZXQgcmVzb2x1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNpemFibGUuc3R5bGUubWFyZ2luUmlnaHQgPSAoaGVhZGVyLm9mZnNldFdpZHRoLzIgLSBib3JkZXJfd2lkdGgpICsgJ3B4JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyX3dpZHRoID0gKHBhcnNlSW50KHJlc2l6YWJsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtd2lkdGgnKSwxMCkpKnNjYWxlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhlYWRlci5zdHlsZS5ib3JkZXJSaWdodFdpZHRoID0gYm9yZGVyX3dpZHRoICsgJ3B4JztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydF93aWR0aCA+IHRoaXMudGFibGV0ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0YWJsZXQgcmVzb2x1dGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNpemFibGUuc3R5bGUubWFyZ2luTGVmdCA9IChoZWFkZXIub2Zmc2V0V2lkdGgvMiAtIGJvcmRlcl93aWR0aCkgKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVfaGlkZS1yZXNpemFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBtb2JpbGUgcmVzb2x1dGlvblxuICAgICAgICAgICAgICAgICAgICBhdmFpbGFiYWxlX2hlaWdodCA9IHZpZXdwb3J0X2hlaWdodCAtIGhlYWRlcl9oZWlnaHQgLSBoZWFkZXIub2Zmc2V0SGVpZ2h0IC0gNjA7XG4gICAgICAgICAgICAgICAgICAgIGF2YWlsYWJhbGVfd2lkdGggPSB2aWV3cG9ydF93aWR0aCAtIDQwO1xuXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlX3ggPSBhdmFpbGFiYWxlX2hlaWdodC9lbGVtZW50X2hlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVfeSA9IGF2YWlsYWJhbGVfd2lkdGgvZWxlbWVudF93aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgc2NhbGUgPSBNYXRoLm1pbihzY2FsZV94LCBzY2FsZV95KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoYXZhaWxhYmFsZV93aWR0aCA8IGVsZW1lbnRfd2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5zdHlsZS5tYXJnaW5MZWZ0ID0gLSAoKChlbGVtZW50X3dpZHRoIC0gYXZhaWxhYmFsZV93aWR0aCkvMikgLSAyMCkgKyBcInB4XCJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5zdHlsZS5tYXJnaW5MZWZ0ID0gJ2F1dG8nO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGF2YWlsYWJhbGVfaGVpZ2h0IDwgMjAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hpZGRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5hZGQoJ3NsaWRlX2hpZGUtcmVzaXphYmxlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2NhbGUgPCAxICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCdzbGlkZV9oaWRlLXJlc2l6YWJsZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzaXphYmxlLnN0eWxlW01vZGVybml6ci5wcmVmaXhlZCgndHJhbnNmb3JtJyldID0gJ3NjYWxlKCcgKyBzY2FsZSArICcpJztcblxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuY2xhc3NMaXN0LnJlbW92ZSgnc2xpZGVfaGlkZS1yZXNpemFibGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc2l6YWJsZS5yZW1vdmVBdHRyaWJ1dGUoJ3N0eWxlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBoZWFkZXIucmVtb3ZlQXR0cmlidXRlKCdzdHlsZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuXG4gICAgICAgIH1cblxuICAgICAgICBzY3JvbGxUb1RvcChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2UubW92ZVRvKDEsIDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5ldyBMYW5kZ2luZztcbn0pKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbihmdW5jdGlvbigpIHtcbiAgICB3aW5kb3cubW9iaWxlQW5kVGFibGV0Y2hlY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGNoZWNrID0gZmFsc2U7XG4gICAgICAgIChmdW5jdGlvbihhKSB7XG4gICAgICAgICAgICBpZiAoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWlub3xhbmRyb2lkfGlwYWR8cGxheWJvb2t8c2lsay9pLnRlc3QoYSkgfHwgLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLCA0KSkpIGNoZWNrID0gdHJ1ZVxuICAgICAgICB9KShuYXZpZ2F0b3IudXNlckFnZW50IHx8IG5hdmlnYXRvci52ZW5kb3IgfHwgd2luZG93Lm9wZXJhKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH07XG5cbiAgICB3aW5kb3cuaXNNb2JpbGUgPSB7XG4gICAgICAgIEFuZHJvaWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIC9BbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgQmxhY2tCZXJyeTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gL0JsYWNrQmVycnkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgICAgICB9LFxuICAgICAgICBpT1M6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIC9pUGhvbmV8aVBhZHxpUG9kL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgV2luZG93czogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gL0lFTW9iaWxlL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgYW55OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAoaXNNb2JpbGUuQW5kcm9pZCgpIHx8IGlzTW9iaWxlLkJsYWNrQmVycnkoKSB8fCBpc01vYmlsZS5pT1MoKSB8fCBpc01vYmlsZS5XaW5kb3dzKCkpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNsYXNzIExheW91dCB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgbGV0IHJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlICE9IFwibG9hZGluZ1wiKSByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJlYWR5LnRoZW4odGhpcy5pbml0LmJpbmQodGhpcykpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBBZGRpbmcgZXZlbnRzIGFuZCBwcm9wZXJ0aWVzXG4gICAgICAgICAqL1xuICAgICAgICBpbml0KCkge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5pc01vYmlsZS5BbmRyb2lkKCkpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnYW5kcm9pZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuaXNNb2JpbGUuaU9TKCkpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuY2xhc3NMaXN0LmFkZCgnaW9zJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tb2JpbGVBbmRUYWJsZXRjaGVjaygpKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ3Vua25vd24tbW9iaWxlJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdkZXNrdG9wJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgbmV3IExheW91dDtcbn0pKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbihmdW5jdGlvbiAoKSB7XG4gICAgY2xhc3MgTWVudSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnQgaW5pdGlhbGl6YXRpb24gb24gZG9tbG9hZFxuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZWFkeS50aGVuKHRoaXMuaW5pdC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkaW5nIGV2ZW50cyBhbmQgcHJvcGVydGllc1xuICAgICAgICAgKi9cbiAgICAgICAgaW5pdCAoKSB7XG5cbiAgICAgICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbicpID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBiYWNrX2J1dHRvbnMgPSAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxvZ2luX19iYWNrJylcbiAgICAgICAgICAgICAgICAsIGxvZ2luX2J1dHRvbnMgPSAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxvZ2luX19sb2dpbi1idXR0b24sIC5sb2dpbl9zdWNjZXNzIC5sb2dpbl9fc3VibWl0JylcbiAgICAgICAgICAgICAgICAsIG1vYmlsZV9wb3B1cF9idXR0b25zID0gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm1lbnVfX2ludGVycHJldGVyLCAuaGVhZGVyX19pbnRlcnByZXRlcicpO1xuXG4gICAgICAgICAgICB0aGlzLm1lbnVfcG9wdXBfb3BlbiA9IGZhbHNlO1xuXG4gICAgICAgICAgICB0aGlzLmxvZ2luX2J1dHRvbiA9ICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19sb2dpbicpO1xuICAgICAgICAgICAgLy90aGlzLmxvZ2luX2J1dHRvbiA9ICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X19sb2dpbl9idXR0b24nKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJfYnV0dG9uID0gICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnVfX3JlZ2lzdGVyJyk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RlcDEgPSAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luX3JlZ2lzdGVyLXN0ZXAtMScpO1xuICAgICAgICAgICAgdGhpcy5zdGVwMV9mb3JtID0gICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW5fcmVnaXN0ZXItc3RlcC0xIGZvcm0ubG9naW5fX2Zvcm0nKTtcbiAgICAgICAgICAgIHRoaXMuc3RlcDIgPSAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luX3JlZ2lzdGVyLXN0ZXAtMicpO1xuICAgICAgICAgICAgdGhpcy5zdGVwMl9mb3JtID0gICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW5fcmVnaXN0ZXItc3RlcC0yIGZvcm0ubG9naW5fX2Zvcm0nKTtcblxuICAgICAgICAgICAgdGhpcy5sb2dpbl9mb3JtID0gICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW5fbG9naW4gZm9ybS5sb2dpbl9fZm9ybScpO1xuXG4gICAgICAgICAgICB0aGlzLm1vYmlsZV9wb3B1cCA9ICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cF9tb2JpbGUnKTtcbiAgICAgICAgICAgIHRoaXMubW9iaWxlX3BvcHVwX2Nsb3NlID0gICAgICAgdGhpcy5tb2JpbGVfcG9wdXAucXVlcnlTZWxlY3RvcignLnBvcHVwX19jbG9zZScpO1xuXG4gICAgICAgICAgICB0aGlzLndyYXBwZXIgPSAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tZW51X193cmFwcGVyJyk7XG4gICAgICAgICAgICB0aGlzLmhlYWRlcl9yZWdpc3Rlcl9idXR0b24gPSAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5oZWFkZXJfX2xpbmtfcmVnaXN0ZXInKTtcbiAgICAgICAgICAgIHRoaXMuaGVhZGVyX2xvZ2luX2J1dHRvbiA9ICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbGlua19sb2dpbicpO1xuICAgICAgICAgICAgdGhpcy5yZWNvdmVyeV9idXR0b24gPSAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW5fX3Bhc3N3b3JkLXJlY292ZXJ5Jyk7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0Ym94ID0gICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHk+LmxpZ2h0Ym94Jyk7XG4gICAgICAgICAgICB0aGlzLmxvZ2luX3BvcHVwID0gICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbl9sb2dpbicpO1xuICAgICAgICAgICAgdGhpcy5yZWNvdmVyeSA9ICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9naW5fcmVjb3ZlcnknKTtcbiAgICAgICAgICAgIHRoaXMucGFzc3dvcmQgPSAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luX3Bhc3N3b3JkJyk7XG4gICAgICAgICAgICB0aGlzLnJlY292ZXJ5X2Zvcm0gPSAgICAgICAgICAgIHRoaXMucmVjb3ZlcnkucXVlcnlTZWxlY3RvcignLmxvZ2luX19mb3JtJyk7XG4gICAgICAgICAgICB0aGlzLnBhc3N3b3JkX2Zvcm0gPSAgICAgICAgICAgIHRoaXMucGFzc3dvcmQucXVlcnlTZWxlY3RvcignLmxvZ2luX19mb3JtJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZXJyb3JfbWVzc2FnZSA9ICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFsZXJ0X2Zvcm0tc2VuZC1mYWlsJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZW1haWwgPSAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxvZ2luX2VtYWlsJyk7XG4gICAgICAgICAgICB0aGlzLnN1Y2Nlc3MgPSAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbl9zdWNjZXNzJyk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2dpbl9vcGVuJyk7XG4gICAgICAgICAgICB0aGlzLmxhc3QgPSBbXTtcblxuICAgICAgICAgICAgaWYodGhpcy5sb2dpbl9idXR0b24pIHtcbiAgICAgICAgICAgICAgdGhpcy5sb2dpbl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5Mb2dpbkZvcm0uYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMucmVjb3ZlcnlfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuUmVjb3ZlcnkuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmxpZ2h0Ym94LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5jbG9zZUFsbC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMucmVnaXN0ZXJfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuUmVnaXN0ZXIuYmluZCh0aGlzKSk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuaGVhZGVyX2xvZ2luX2J1dHRvbikge1xuICAgICAgICAgICAgICB0aGlzLmhlYWRlcl9sb2dpbl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5Mb2dpbk91dGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaGVhZGVyX3JlZ2lzdGVyX2J1dHRvbikge1xuICAgICAgICAgICAgICB0aGlzLmhlYWRlcl9yZWdpc3Rlcl9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9wZW5SZWdpc3Rlck91dGVyLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm1vYmlsZV9wb3B1cF9jbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2VNb2JpbGVQb3B1cC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgdGhpcy5yZWNvdmVyeV9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuc2VuZERhdGEuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnBhc3N3b3JkX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5zZW5kRGF0YS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuc3RlcDFfZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLm9wZW5OZXh0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5zdGVwMl9mb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuc2VuZERhdGEuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmxvZ2luX2Zvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5zZW5kRGF0YS5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVwb3NQb3B1cC5iaW5kKHRoaXMpKTtcblxuICAgICAgICAgICAgJCgnc2VsZWN0Lmxhbmd1YWdlX2Zyb20nKS5zZWxlY3QyKCk7XG4gICAgICAgICAgICAkKCdzZWxlY3QubGFuZ3VhZ2VfdG8nKS5zZWxlY3QyKCk7XG4gICAgICAgICAgICAkKCdzZWxlY3QubGFuZ3VhZ2VfbG9jYXRpb24nKS5zZWxlY3QyKCk7XG5cbiAgICAgICAgICAgIHRoaXMubGFuZ3VhZ2VfZnJvbSA9ICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGFuZ3VhZ2VfZnJvbScpO1xuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZV90byA9ICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYW5ndWFnZV90bycpO1xuICAgICAgICAgICAgdGhpcy5sYW5ndWFnZV9sb2NhdGlvbiA9ICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sYW5ndWFnZV9sb2NhdGlvbicpO1xuXG4gICAgICAgICAgICAkKFwiLmxvZ2luIHNlbGVjdC5sYW5ndWFnZV9mcm9tXCIpLm9uKFwiY2hhbmdlXCIsIHRoaXMuY2hhbmdlRnJvbUxhbmd1YWdlLmJpbmQodGhpcykpO1xuXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmxvZ2luJyksIChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKG1vYmlsZV9wb3B1cF9idXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuTW9iaWxlUG9wdXAuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGJhY2tfYnV0dG9ucywgKGJ1dHRvbikgPT4ge1xuICAgICAgICAgICAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZ29iYWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChsb2dpbl9idXR0b25zLCAoYnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vcGVuTG9naW5Jbm5lci5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLldlYlJUQ1N1cHBvcnQgPSAhZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm8tcGVlcmNvbm5lY3Rpb24nKTtcblxuXG4gICAgICAgICAgICBpZighdGhpcy5XZWJSVENTdXBwb3J0KSB7XG5cbiAgICAgICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybS5sb2dpbl9fZm9ybSBpbnB1dCwgZm9ybS5sb2dpbl9fZm9ybSBidXR0b24sIGZvcm0ubG9naW5fX2Zvcm0gc2VsZWN0JyksIChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIixcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtLmxvZ2luX19mb3JtJyksIChmb3JtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm0uY2xvc2VzdCgnLmxvZ2luJykucXVlcnlTZWxlY3RvcignLnBvcHVwX2Jyb3dzZXInKS5vcGVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wb3B1cF9icm93c2VyJyksIChwb3B1cCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3dQb3B1cChwb3B1cCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjaGFuZ2VGcm9tTGFuZ3VhZ2UgKCkge1xuICAgICAgICAgICAgbGV0IHZhbHVlX2Zyb20gPSB0aGlzLmxhbmd1YWdlX2Zyb20udmFsdWVcbiAgICAgICAgICAgICAgICAsIHZhbHVlX3RvID0gdGhpcy5sYW5ndWFnZV90by52YWx1ZTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlX2Zyb20gPT09IHZhbHVlX3RvKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYW5ndWFnZV90by5zZWxlY3RlZEluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAkKHRoaXMubGFuZ3VhZ2VfdG8pLnNlbGVjdDIoXCJ2YWxcIiwgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmxhbmd1YWdlX3RvLnF1ZXJ5U2VsZWN0b3JBbGwoJ29wdGlvblt2YWx1ZV1bZGlzYWJsZWRdJyksICh0b19lbmFibGUpPT57XG4gICAgICAgICAgICAgICAgdG9fZW5hYmxlLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwodGhpcy5sYW5ndWFnZV90by5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb25bdmFsdWU9XCInICsgdmFsdWVfZnJvbSArICdcIl0nKSwgKHRvX2Rpc2FibGUpPT57XG4gICAgICAgICAgICAgICAgdG9fZGlzYWJsZS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gaW5lZmZpY2llbnQsIGJ1dCBpdCBsb29rIGxpdGUgdGhlcmUgYXJlIG5vIG90aGVyIHdheSBjb3JyZWN0bHkgZGlzYWJsZS9lbmFibGUgc2VsZWN0MiBkeW5hbWljYWxseVxuICAgICAgICAgICAgJCh0aGlzLmxhbmd1YWdlX3RvKS5zZWxlY3QyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBvcGVuTmV4dCAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuc3RlcDFfZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBmcm9tOiAkKCdzZWxlY3QubGFuZ3VhZ2VfZnJvbScpLnNlbGVjdDIoXCJ2YWxcIilcbiAgICAgICAgICAgICAgICAsIHRvOiAkKCdzZWxlY3QubGFuZ3VhZ2VfdG8nKS5zZWxlY3QyKFwidmFsXCIpXG4gICAgICAgICAgICAgICAgLCBsb2NhdGlvbjogJCgnc2VsZWN0Lmxhbmd1YWdlX2xvY2F0aW9uJykuc2VsZWN0MihcInZhbFwiKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcDFfZm9ybS52YWxpZGF0ZSgpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLm9wZW5Gb3JtKHRoaXMuc3RlcDIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVwb3NQb3B1cCAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmKCF0aGlzLm1lbnVfcG9wdXBfb3Blbil7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tb2JpbGVfcG9wdXAuc3R5bGVbTW9kZXJuaXpyLnByZWZpeGVkKCd0cmFuc2Zvcm0nKV0gPSBcInRyYW5zbGF0ZVkoXCIgKyB0aGlzLm1vYmlsZV9wb3B1cC5vZmZzZXRIZWlnaHQgKyBcInB4KVwiO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xvc2VNb2JpbGVQb3B1cCAoKSB7XG4gICAgICAgICAgICBpZighdGhpcy5tZW51X3BvcHVwX29wZW4pe1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWVudV9wb3B1cF9vcGVuID0gZmFsc2U7XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubW9iaWxlX3BvcHVwLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm1vYmlsZV9wb3B1cCwge3RyYW5zbGF0ZVk6IDB9LCAyNTApO1xuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm1vYmlsZV9wb3B1cF9idXR0b24sIFwic3RvcFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubW9iaWxlX3BvcHVwX2J1dHRvbiwge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgLCBiZWdpbjogKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubW9iaWxlX3BvcHVwX2J1dHRvbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3Blbk1vYmlsZVBvcHVwICgpIHtcbiAgICAgICAgICAgIGlmKHRoaXMubWVudV9wb3B1cF9vcGVuKXtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm1lbnVfcG9wdXBfb3BlbiA9IHRydWU7XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubW9iaWxlX3BvcHVwLCBcInN0b3BcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLm1vYmlsZV9wb3B1cCwge3RyYW5zbGF0ZVk6IHRoaXMubW9iaWxlX3BvcHVwLm9mZnNldEhlaWdodCArIFwicHhcIn0sIDI1MCk7XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubW9iaWxlX3BvcHVwX2J1dHRvbiwgXCJzdG9wXCIpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5tb2JpbGVfcG9wdXBfYnV0dG9uLCB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTBcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2JpbGVfcG9wdXBfYnV0dG9uLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3dQb3B1cCAocG9wdXApIHtcbiAgICAgICAgICAgIGlmIChwb3B1cC5zaG93ICE9IHVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgcG9wdXAuc2hvdygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuc2hvd1BvcHVwLmJpbmQodGhpcywgcG9wdXApLCA1MCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFNjcm9sbCB0byBmaXJzdCBzbGlkZSBhbmQgb3BlbiBsb2dpbiBmb3JtXG4gICAgICAgICAqL1xuICAgICAgICBvcGVuTG9naW5PdXRlciAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLm1vdmVUbygxLCAwKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgICAgICB0aGlzLmxvZ2luX2J1dHRvbi5jbGljaygpO1xuICAgICAgICAgICAgfSwgODAwKVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBTY3JvbGwgdG8gZmlyc3Qgc2xpZGUgYW5kIG9wZW4gcmVnaXN0ZXIgZm9ybVxuICAgICAgICAgKi9cbiAgICAgICAgb3BlblJlZ2lzdGVyT3V0ZXIgKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5tb3ZlVG8oMSwgMCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgdGhpcy5yZWdpc3Rlcl9idXR0b24uY2xpY2soKTtcbiAgICAgICAgICAgIH0sIDgwMClcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gU2VuZCByZWdpc3RyYXRpb24gZGF0YSBhbmQgc2hvdyBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBzZW5kRGF0YSAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZm9ybSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZW5kaW5nJyk7XG5cbiAgICAgICAgICAgIGlmIChmb3JtLnZhbGlkYXRlKCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IERPTkUgPSA0XG4gICAgICAgICAgICAgICAgLCBPSyA9IDIwMFxuICAgICAgICAgICAgICAgICwgYWZ0ZXJfYWN0aW9uXG4gICAgICAgICAgICAgICAgLCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICAgICAgICAgICAgICAgICwgbG9hZGVkXG4gICAgICAgICAgICAgICAgLCBpbmRleFxuICAgICAgICAgICAgICAgICwgcmVzcG9uc2VcbiAgICAgICAgICAgICAgICAsIGRhdGEgPSBuZXcgRm9ybURhdGEoZm9ybSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGVwMV9kYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YS5hcHBlbmQoJ2Zvc191c2VyX3JlZ2lzdHJhdGlvbl9mb3JtW3RyYW5zbGF0b3JQcm9maWxlXVtuYXRpdmVMYW5ndWFnZV0nLCAgICAgdGhpcy5zdGVwMV9kYXRhLmZyb20pO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnZm9zX3VzZXJfcmVnaXN0cmF0aW9uX2Zvcm1bdHJhbnNsYXRvclByb2ZpbGVdW2ZvcmVpZ25MYW5ndWFnZV0nLCAgICAgICB0aGlzLnN0ZXAxX2RhdGEudG8pO1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmFwcGVuZCgnZm9zX3VzZXJfcmVnaXN0cmF0aW9uX2Zvcm1bY291bnRyeV0nLCB0aGlzLnN0ZXAxX2RhdGEubG9jYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxvYWRlZCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBmb3JtLmdldEF0dHJpYnV0ZSgnYWN0aW9uJykpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gRE9ORSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSBPSykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy5jbGVhckFsbCgpO30sIDUwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RlcDFEYXRhID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBwYXJzZUludCh4aHIuc3RhdHVzLCAxMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiB4aHIuc3RhdHVzVGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiB4aHIucmVzcG9uc2VUZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybTogZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoZm9ybS5oYXNBdHRyaWJ1dGUoJ2RhdGEtc3VjY2VzcycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVyX2FjdGlvbiA9IHRoaXMucmVkaXJlY3RUby5iaW5kKHRoaXMsIGZvcm0uZ2V0QXR0cmlidXRlKCdkYXRhLXN1Y2Nlc3MnKSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtLmhhc0F0dHJpYnV0ZSgnZGF0YS1jaGVjaycpKSB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVyX2FjdGlvbiA9IHRoaXMuc2hvd0NoZWNrTWVzc2FnZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFmdGVyX2FjdGlvbiA9IHRoaXMuc2hvd1N1Y2Nlc3NNZXNzYWdlLmJpbmQodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbG9hZGVkLnRoZW4oYWZ0ZXJfYWN0aW9uKS5jYXRjaCh0aGlzLnNob3dFcnJvck1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICAgICAgLy8gbG9hZGVkLnRoZW4oYWZ0ZXJfYWN0aW9uKS5jYXRjaChhZnRlcl9hY3Rpb24pO1xuXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gUmVkaXJlY3QgdG8gdXJsXG4gICAgICAgICAqL1xuICAgICAgICByZWRpcmVjdFRvICh1cmwpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFNob3cgY2hlY2sgZW1haWwgbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvd0NoZWNrTWVzc2FnZSAoKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3QgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgIHRoaXMub3BlbkZvcm0odGhpcy5lbWFpbCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFNob3cgc3VjY2VzcyBtZXNzYWdlXG4gICAgICAgICAqL1xuICAgICAgICBzaG93U3VjY2Vzc01lc3NhZ2UgKCkge1xuICAgICAgICAgICAgdGhpcy5sYXN0ID0gbmV3IEFycmF5KCk7XG4gICAgICAgICAgICB0aGlzLm9wZW5Gb3JtKHRoaXMuc3VjY2Vzcyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIE9wZW4gbG9naW5cbiAgICAgICAgICovXG4gICAgICAgIG9wZW5Mb2dpbklubmVyICgpIHtcbiAgICAgICAgICAgIHRoaXMub3BlbkZvcm0odGhpcy5sb2dpbl9wb3B1cCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFNob3cgbWVzc2FnZVxuICAgICAgICAgKi9cbiAgICAgICAgc2hvd0Vycm9yTWVzc2FnZSAocmVhc29uKSB7XG4gICAgICAgICAgICAvLyB0aGlzLmxhc3QgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgICAgIHZhciBtZXNzYWdlX3RleHQgPSBudWxsXG4gICAgICAgICAgICAsIHNraXBfcG9wdXAgPSBmYWxzZVxuICAgICAgICAgICAgLCBmb3JtID0gdGhpcy5jdXJyZW50LnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcblxuICAgICAgICAgICAgdmFyIGlzc2V0ID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZm4oKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSAhPT0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmIChyZWFzb24ucmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlYXNvbi5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzc2V0KCgpID0+IHJlc3BvbnNlLmVycm9yKSkge1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlX3RleHQgPSByZXNwb25zZS5lcnJvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGlzc2V0KCgpID0+IHJlc3BvbnNlLmNvbnRlbnQuZm9ybS5jaGlsZHJlbi5lbWFpbC5lcnJvcnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNraXBfcG9wdXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlX3RleHQgPSByZXNwb25zZS5jb250ZW50LmZvcm0uY2hpbGRyZW4uZW1haWwuZXJyb3JzWzBdO1xuICAgICAgICAgICAgICAgICAgICBmb3JtLmludmFsaWRhdGUoJyNmb3NfdXNlcl9yZWdpc3RyYXRpb25fZm9ybV9lbWFpbCcsIG1lc3NhZ2VfdGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVhc29uLmNvZGUsICdSZXNwb25zZSBzdGF0dXMgY29kZTogJyArIHJlYXNvbi5jb2RlICsgJy4gJyArIHJlYXNvbi5tZXNzYWdlICsgJy4nKTtcblxuICAgICAgICAgICAgaWYoISBza2lwX3BvcHVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcl9tZXNzYWdlLm9wZW4obWVzc2FnZV90ZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gT3BlbiBsYXN0IHBhZ2VcbiAgICAgICAgICovXG4gICAgICAgIGdvYmFjayAoKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5Gb3JtKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIFNob3cgZW1haWwgc2VudCB3YXJuaW5nXG4gICAgICAgICAqL1xuICAgICAgICBlbWFpbEhhdmVTZW5kICgpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdCA9IG5ldyBBcnJheSgpO1xuICAgICAgICAgICAgdGhpcy5vcGVuRm9ybSh0aGlzLmVtYWlsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gT3BlbiByZWdpc3RlciBmb3JtXG4gICAgICAgICAqL1xuICAgICAgICBvcGVuUmVnaXN0ZXJJbm5lciAoKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW5Gb3JtKHRoaXMuc3RlcDEpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBPcGVuIHJlZ2lzdGVyIGZvcm1cbiAgICAgICAgICovXG4gICAgICAgIG9wZW5SZWdpc3RlciAoKSB7XG4gICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEFsbG93U2Nyb2xsaW5nKGZhbHNlKTtcbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcoZmFsc2UpO1xuXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5zdGVwMSwgcHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50ID0gdGhpcy5zdGVwMTtcblxuICAgICAgICAgICAgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGJlZ2luOiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxpZ2h0Ym94LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyNTBcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLmxpZ2h0Ym94LCBwcm9wcywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIE9wZW4gcmVjb3ZlcnkgZm9ybXNcbiAgICAgICAgICovXG4gICAgICAgIG9wZW5SZWNvdmVyeSAoZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZighdGhpcy5XZWJSVENTdXBwb3J0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vcGVuRm9ybSh0aGlzLnJlY292ZXJ5KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gT3BlbiByZWNvdmVyeSBmb3Jtc1xuICAgICAgICAgKiBAcGFyYW0gZm9ybSB7bm9kZX0gRm9ybSB5b3Ugd2FudCB0byBvcGVuXG4gICAgICAgICAqIEBwYXJhbSBiYWNrIHtub2RlfSBGb3JtIHdoaWNoIHlvdSB3YW50IHRvIG9wZW4gd2hlbiB1c2VyIHByZXNzIGJhY2ssIGJ5IGRlZmF1bHQg4oCUwqBsYXN0IGZvcm0gb3BlbmVkXG4gICAgICAgICAqL1xuICAgICAgICBvcGVuRm9ybSAocG9wdXAsIGRvbnRfc2F2ZSkge1xuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyhmYWxzZSk7XG4gICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblxuICAgICAgICAgICAgdmFyIGZvcm0gPSB0aGlzLmN1cnJlbnQucXVlcnlTZWxlY3RvcignZm9ybScpO1xuXG4gICAgICAgICAgICAvLyAkKCdzZWxlY3QubGFuZ3VhZ2VfZnJvbScpLnNlbGVjdDIoXCJ2YWxcIiwgXCJcIik7XG4gICAgICAgICAgICAvLyAkKCdzZWxlY3QubGFuZ3VhZ2VfdG8nKS5zZWxlY3QyKFwidmFsXCIsIFwiXCIpO1xuICAgICAgICAgICAgLy8gJCgnc2VsZWN0Lmxhbmd1YWdlX2xvY2F0aW9uJykuc2VsZWN0MihcInZhbFwiLCBcIlwiKTtcbiAgICAgICAgICAgIC8vIGlmICgoZm9ybSAhPSBudWxsKSAmJiAodHlwZW9mIGZvcm0uY2xlYXIgIT0gJ3VuZGVmaW5lZCcpKSB7XG4gICAgICAgICAgICAvLyAgICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgLy8gICAgICAgICBpZiAoZm9ybSE9bnVsbCkge1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZm9ybS5jbGVhcigpO1xuICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfSwgNTAwKTtcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwb3B1cCA9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMubGFzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcG9wdXAgPSB0aGlzLmxhc3QucG9wKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBwb3B1cCA9PSBcInVuZGVmaW5lZFwiICYmIHRoaXMubGFzdC5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2VBbGwoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRvbnRfc2F2ZSAhPSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0LnB1c2godGhpcy5jdXJyZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZm9ybSA9IHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICAgICAgICAgIC8vIGlmIChmb3JtICE9IG51bGwpIHtcbiAgICAgICAgICAgIC8vICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAvLyAgICAgICAgIGlmIChmb3JtIT1udWxsKSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBmb3JtLmNsZWFyKCk7XG4gICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgICB9LCA1MDApO1xuICAgICAgICAgICAgLy8gfVxuXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAtIHRoaXMuY3VycmVudC5vZmZzZXRXaWR0aCArIFwicHhcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMuY3VycmVudCwgcHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgcHJvcHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAwXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVmVsb2NpdHkocG9wdXAsIHByb3BzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHBvcHVwO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBDbG9zZSBhbGwgZm9ybXNcbiAgICAgICAgICovXG4gICAgICAgIGNsb3NlQWxsICgpIHtcblxuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyh0cnVlKTtcbiAgICAgICAgICAgICQuZm4uZnVsbHBhZ2Uuc2V0S2V5Ym9hcmRTY3JvbGxpbmcodHJ1ZSk7XG5cbiAgICAgICAgICAgIGxldCBwcm9wcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IC0gdGhpcy5jdXJyZW50Lm9mZnNldFdpZHRoICsgXCJweFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5jdXJyZW50LCBwcm9wcywgb3B0aW9ucyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuXG4gICAgICAgICAgICBwcm9wcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubGlnaHRib3guc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5saWdodGJveCwgcHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuY2xlYXJBbGwoKTt9LCA1MDApO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJBbGwgKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsZWFyaW5nJyk7XG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnZm9ybScpLCAoZm9ybSkgPT4ge1xuICAgICAgICAgICAgICAgIGZvcm0uY2xlYXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBPcGVuIGxvZ2luIHBvcHVwXG4gICAgICAgICAqL1xuICAgICAgICBvcGVuTG9naW5Gb3JtIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgJC5mbi5mdWxscGFnZS5zZXRBbGxvd1Njcm9sbGluZyhmYWxzZSk7XG4gICAgICAgICAgICAkLmZuLmZ1bGxwYWdlLnNldEtleWJvYXJkU2Nyb2xsaW5nKGZhbHNlKTtcblxuICAgICAgICAgICAgbGV0IHByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICByaWdodDogMFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IDI1MFxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMubG9naW5fcG9wdXAsIHByb3BzLCBvcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IHRoaXMubG9naW5fcG9wdXA7XG5cbiAgICAgICAgICAgIHByb3BzID0ge1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBiZWdpbjogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5saWdodGJveC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogMjUwXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5saWdodGJveCwgcHJvcHMsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV3IE1lbnU7XG59KSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG4oZnVuY3Rpb24gKCkge1xuXG4gICAgLyoqXG4gICAgICogQGNsYXNzIFBvcHVwXG4gICAgICovXG4gICAgY2xhc3MgUG9wdXAge1xuICAgICAgICAvKipcbiAgICAgICAgICogQGRlc2NyaXB0aW9uIEFkZGluZyBldmVudHMgYW5kIHByb3BlcnRpZXNcbiAgICAgICAgICogQGNvbnN0cnVjdG9yXG4gICAgICAgICAqL1xuICAgICAgICBjb25zdHJ1Y3RvciAocG9wdXApIHtcbiAgICAgICAgICAgIHRoaXMucG9wdXAgPSBwb3B1cDtcbiAgICAgICAgICAgIHBvcHVwLnF1ZXJ5U2VsZWN0b3IoJy5wb3B1cF9fY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLmNsb3NlID0gdGhpcy5jbG9zZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5vcGVuID0gdGhpcy5vcGVuLmJpbmQodGhpcyk7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLnNob3cgPSB0aGlzLnNob3cuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmphbXBpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNob3cgKCkge1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgdGhpcy5wb3B1cC5zdHlsZVtNb2Rlcm5penIucHJlZml4ZWQoJ3RyYW5zZm9ybScpXSA9IFwicm90YXRlWCgwKVwiO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaGlkZSAoKSB7XG4gICAgICAgICAgICB0aGlzLnBvcHVwLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICAgIHRoaXMucG9wdXAuc3R5bGVbTW9kZXJuaXpyLnByZWZpeGVkKCd0cmFuc2Zvcm0nKV0gPSBcInJvdGF0ZVgoMTgwZGVnKVwiO1xuICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucG9wdXAsIFwic3RvcFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsb3NlICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmphbXBpbmcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwgXCJmaW5pc2hcIik7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBvcHVwLCB7XG4gICAgICAgICAgICAgICAgcm90YXRlWDogXCIxMjBkZWdcIlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgICAgICAsIGJlZ2luOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wZW4gKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuamFtcGluZykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXR1cykge1xuICAgICAgICAgICAgICAgIHRoaXMuanVtcCgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuamFtcGluZyA9IHRydWU7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBvcHVwLCBcImZpbmlzaFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucG9wdXAsIHtcbiAgICAgICAgICAgICAgICByb3RhdGVYOiBcIjBkZWdcIlxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MDBcbiAgICAgICAgICAgICAgICAsIGJlZ2luOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3B1cC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXMgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwge3JvdGF0ZVg6IFwiMjBkZWdcIn0sIDE1MCk7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBvcHVwLCB7cm90YXRlWDogXCIwZGVnXCJ9LCAxMjUpO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwge3JvdGF0ZVg6IFwiMTBkZWdcIn0sIDIwMCk7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBvcHVwLCB7cm90YXRlWDogXCIwZGVnXCJ9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246MTc1XG4gICAgICAgICAgICAgICAgLCBjb21wbGV0ZTogKCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuamFtcGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBqdW1wICgpIHtcbiAgICAgICAgICAgIHRoaXMuamFtcGluZyA9IHRydWU7XG4gICAgICAgICAgICBWZWxvY2l0eSh0aGlzLnBvcHVwLCBcImZpbmlzaFwiKTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucG9wdXAsIHtyb3RhdGVYOiBcIjM1ZGVnXCJ9LCAxNTApO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwge3JvdGF0ZVg6IFwiMGRlZ1wifSwgMTI1KTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucG9wdXAsIHtyb3RhdGVYOiBcIjIwZGVnXCJ9LCAyMDApO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwge3JvdGF0ZVg6IFwiMGRlZ1wifSwgMTc1KTtcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMucG9wdXAsIHtyb3RhdGVYOiBcIjE1ZGVnXCJ9LCAyNTApO1xuICAgICAgICAgICAgVmVsb2NpdHkodGhpcy5wb3B1cCwge3JvdGF0ZVg6IFwiMGRlZ1wifSwge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAyMjVcbiAgICAgICAgICAgICAgICAsIGNvbXBsZXRlOiAoKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qYW1waW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICBsZXQgcmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSAhPSBcImxvYWRpbmdcIikgcmV0dXJuIHJlc29sdmUoKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCk9PiByZXNvbHZlKCkpO1xuICAgIH0pO1xuXG4gICAgcmVhZHkudGhlbigoKT0+e1xuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcHVwX2Jyb3dzZXInKSwgKHBvcHVwKSA9PiB7XG4gICAgICAgICAgICBuZXcgUG9wdXAocG9wdXApO1xuICAgICAgICB9KTtcblxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBvcHVwX2NvbW1vbicpLCAocG9wdXApID0+IHtcbiAgICAgICAgICAgIG5ldyBQb3B1cChwb3B1cCk7XG4gICAgICAgICAgICBpZiAocG9wdXAuY2xhc3NMaXN0LmNvbnRhaW5zKCdwb3B1cF9vcGVuJykpe1xuICAgICAgICAgICAgICAgIHBvcHVwLm9wZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbihmdW5jdGlvbigpIHtcblxuICAgIC8qKlxuICAgICAqIEBjbGFzc2Rlc2MgQ2xhc3MgcmVwcmVzZW50aW5nIGZvcm0gdmFsaWRhdGlvblxuICAgICAqIEBjbGFzc1xuICAgICAqL1xuXG4gICAgY2xhc3MgVmFsaWRhdGlvbiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gQWRkaW5nIGV2ZW50cyBhbmQgcHJvcGVydGllc1xuICAgICAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0cnVjdG9yKGZvcm0pIHtcbiAgICAgICAgICAgIHRoaXMuZm9ybSA9IGZvcm07XG4gICAgICAgICAgICBmb3JtLnNldEF0dHJpYnV0ZShcIm5vdmFsaWRhdGVcIiwgXCJub3ZhbGlkYXRlXCIpO1xuICAgICAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLnZhbGlkYXRlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgZm9ybS52YWxpZGF0ZSA9IHRoaXMudmFsaWRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIGZvcm0uaW52YWxpZGF0ZSA9IHRoaXMuaW52YWxpZGF0ZS5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgZm9ybS5jbGVhciA9IHRoaXMuY2xlYXIuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgdGhpcy5tZXNzYWdlcyA9IHtcbiAgICAgICAgICAgICAgICBlbjoge1xuICAgICAgICAgICAgICAgICAgICByZXF1aXJlZDogXCJSZXF1aXJlZCBmaWVsZFwiXG4gICAgICAgICAgICAgICAgICAgICwgZW1haWw6IFwiV3JvbmcgZW1haWwgZm9ybWF0XCJcbiAgICAgICAgICAgICAgICAgICAgLCBlcXVhbDogXCJQYXNzd29yZCBmaWVsZHMgc2hvdWxkIGJlIGVxdWFsXCJcbiAgICAgICAgICAgICAgICAgICAgLCB1bmVxdWFsOiBcIkxhbmd1YWdlcyBzaG91bGRuJ3QgYmUgZXF1YWxcIlxuICAgICAgICAgICAgICAgICAgICAsIHVuc2VsZWN0ZWQ6IFwiWW91IHNob3VsZCBzZWxlY3QgdmFsdWUgZnJvbSBkcm9wZG93blwiXG4gICAgICAgICAgICAgICAgICAgICwgdXJsOiBcIldyb25nIHVybCBmb3JtYXRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAsIHJ1OiB7XG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmVkOiBcItCf0L7Qu9C1INC+0LHRj9C30LDRgtC10LvRjNC90L4g0LTQu9GPINC30LDQv9C+0LvQvdC10L3QuNGPXCJcbiAgICAgICAgICAgICAgICAgICAgLCBlbWFpbDogXCLQn9GA0L7QstC10YDRjNGC0LUg0YTQvtGA0LzQsNGCIGVtYWlsXCJcbiAgICAgICAgICAgICAgICAgICAgLCBlcXVhbDogXCLQn9Cw0YDQvtC70Lgg0LTQvtC70LbQvdGLINGB0L7QstC/0LDQtNCw0YLRjFwiXG4gICAgICAgICAgICAgICAgICAgICwgdW5lcXVhbDogXCLQr9C30YvQutC4INC90LUg0LTQvtC70LbQvdGLINGB0L7QstC/0LDQtNCw0YLRjFwiXG4gICAgICAgICAgICAgICAgICAgICwgdW5zZWxlY3RlZDogXCLQndC1INCy0YvQsdGA0LDQvdC+INC30L3QsNGH0LXQvdC40LUg0LjQtyDRgdC/0LjRgdC60LBcIlxuICAgICAgICAgICAgICAgICAgICAsIHVybDogXCLQn9GA0L7QstC10YDRjNGC0LUg0YTQvtGA0LzQsNGCIFVSTFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBSZXNldCBmb3JtIGFuZCBjbGVhciBlcnJvcnNcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyICgpIHtcblxuICAgICAgICAgICAgbGV0IHNlbGVjdHMgPSAkKHRoaXMuZm9ybSkuZmluZCgnc2VsZWN0JylcbiAgICAgICAgICAgICAgICAsIGluZGV4ID0gc2VsZWN0cy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaW5kZXgtLSkge1xuXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHNlbGVjdHNbaW5kZXhdLnNlbGVjdDIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAkKHNlbGVjdHNbaW5kZXhdKS5zZWxlY3QyKFwidmFsXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdHNbaW5kZXhdLnNlbGVjdGVkSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChzZWxlY3RzW2luZGV4XS5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb25bdmFsdWVdW2Rpc2FibGVkXScpLCAob3B0aW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZm9ybS5yZXNldCgpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICAgICAgbGV0IGVycm9ycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5mb3JtLWVycm9yJyksXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXZhbGlkXSwgW2RhdGEtaW52YWxpZF0nKTtcblxuICAgICAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChlcnJvcnMsIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlcnJvci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChmaWVsZHMsIChmaWVsZCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtaW52YWxpZCcpO1xuICAgICAgICAgICAgICAgICAgICBmaWVsZC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdmFsaWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb24gUmVtb3ZlIGVycm9yIG1lc3NhZ2UgYWZ0ZXIgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgLSBlbGVtZW50LCBhZnRlciB3aGljaCB3ZSB3aWxsIGFkZCBlcnJvciBtZXNzYWdlXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlIC0gZXJyb3IgbWVzc2FnZVxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHlwcGUgLSBlcnJvciB0eXBlXG4gICAgICAgICAqL1xuICAgICAgICBhZGRFcnJvcihlbGVtZW50LCBtZXNzYWdlLCB0eXBlKSB7XG5cbiAgICAgICAgICAgIGlmIChlbGVtZW50LnBhcmVudE5vZGUucXVlcnlTZWxlY3RvcignLmZvcm0tZXJyb3JbZGF0YS10eXBlPVwiJyArIHR5cGUgKyAnXCJdJykgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBlcnJvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ1AnKTtcbiAgICAgICAgICAgIGVycm9yLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG1lc3NhZ2UpKTtcbiAgICAgICAgICAgIGVycm9yLmNsYXNzTGlzdC5hZGQoJ2Zvcm0tZXJyb3InKTtcbiAgICAgICAgICAgIGVycm9yLnNldEF0dHJpYnV0ZSgnZGF0YS10eXBlJywgdHlwZSk7XG4gICAgICAgICAgICBlbGVtZW50LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZXJyb3IpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBSZW1vdmUgZXJyb3IgbWVzc2FnZSBvZiBzb21lIHR5cGUgYWZ0ZXIgZWxlbWVudFxuICAgICAgICAgKiBAcGFyYW0ge05vZGV9IGVsZW1lbnQgLSBlbGVtZW50LCBhZnRlciB3aGljaCBlcnJvciBtZXNzYWdlIGlzXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBwZSAtIGVycm9yIHR5cGVcbiAgICAgICAgICovXG4gICAgICAgIGNsZWFyRXJyb3IoZWxlbWVudCwgdHlwZSkge1xuXG4gICAgICAgICAgICBsZXQgZXJyID0gZWxlbWVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yW2RhdGEtdHlwZT1cIicgKyB0eXBlICsgJ1wiXScpO1xuICAgICAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbnZhbGlkYXRlKGZpZWxkX3NlbGVjdG9yLCBjdXN0b21fZXJyb3IpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3IoZmllbGRfc2VsZWN0b3IpO1xuICAgICAgICAgICAgbGV0IGludmFsaWQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLWludmFsaWRcIik7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5vZGUoaW52YWxpZCk7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS12YWxpZCcpO1xuICAgICAgICAgICAgdGhpcy5hZGRFcnJvcihlbGVtZW50LCBjdXN0b21fZXJyb3IsIFwiY3VzdG9tXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvbiBWYWxpZGF0ZSBmb3JtXG4gICAgICAgICAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IC0gc3VibWl0IGV2ZW50XG4gICAgICAgICAqIEB0b2RvIEltcGxlbWVudCBsb2dpbiB2YWxpZGF0aW9uXG4gICAgICAgICAqL1xuICAgICAgICB2YWxpZGF0ZShldmVudCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCAhPSBcInVuZGVmaW5lZFwiICYmICFldmVudC5jdXJyZW50VGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1yZWxvYWQnKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZCA9IHRydWUsXG4gICAgICAgICAgICAgICAgbmV4dCA9IG51bGwsXG4gICAgICAgICAgICAgICAgZXF1YWxfZmllbGRzID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWVxdWFsXScpLFxuICAgICAgICAgICAgICAgIHVuZXF1YWxfZmllbGRzID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXVuZXF1YWxdJyksXG4gICAgICAgICAgICAgICAgcmVxdWlyZWRfZmllbGRzID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyZXF1aXJlZF0nKSxcbiAgICAgICAgICAgICAgICB1cmxfZmllbGRzID0gdGhpcy5mb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9XCJ1cmxcIl0nKSxcbiAgICAgICAgICAgICAgICBlbWFpbF9maWVsZHMgPSB0aGlzLmZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1cImVtYWlsXCJdJyksXG4gICAgICAgICAgICAgICAgdXJsX3JlZ2V4ID0gbmV3IFJlZ0V4cChcIl4oaHR0cHxodHRwc3xmdHApXFw6Ly8oW2EtekEtWjAtOVxcLlxcLV0rKFxcOlthLXpBLVowLTlcXC4mYW1wOyVcXCRcXC1dKykqQCkqKCgyNVswLTVdfDJbMC00XVswLTldfFswLTFdezF9WzAtOV17Mn18WzEtOV17MX1bMC05XXsxfXxbMS05XSlcXC4oMjVbMC01XXwyWzAtNF1bMC05XXxbMC0xXXsxfVswLTldezJ9fFsxLTldezF9WzAtOV17MX18WzEtOV18MClcXC4oMjVbMC01XXwyWzAtNF1bMC05XXxbMC0xXXsxfVswLTldezJ9fFsxLTldezF9WzAtOV17MX18WzEtOV18MClcXC4oMjVbMC01XXwyWzAtNF1bMC05XXxbMC0xXXsxfVswLTldezJ9fFsxLTldezF9WzAtOV17MX18WzAtOV0pfChbYS16QS1aMC05XFwtXStcXC4pKlthLXpBLVowLTlcXC1dK1xcLihjb218ZWR1fGdvdnxpbnR8bWlsfG5ldHxvcmd8Yml6fGFycGF8aW5mb3xuYW1lfHByb3xhZXJvfGNvb3B8bXVzZXVtfFthLXpBLVpdezJ9KSkoXFw6WzAtOV0rKSooLygkfFthLXpBLVowLTlcXC5cXCxcXD9cXCdcXFxcXFwrJmFtcDslXFwkI1xcPX5fXFwtXSspKSokXCIsIFwiaVwiKSxcbiAgICAgICAgICAgICAgICBlbWFpbF9yZWdleCA9IG5ldyBSZWdFeHAoXCJeKFthLXpBLVowLTlfXFwuXFwtXSkrXFxAKChbYS16QS1aMC05XFwtXSkrXFwuKSsoW2EtekEtWjAtOV17Miw0fSkrJFwiKTtcblxuICAgICAgICAgICAgLyogUmVtb3ZlIGN1c3RvbSBlcnJvcnMgKi9cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbCh0aGlzLmZvcm0ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdHlwZS1jdXN0b21dJyksIChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGNoZWNrIGVxdWFsIGZpZWxkcyAqL1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVxdWFsX2ZpZWxkcywgKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZXF1YWwgPSB0aGlzLmZvcm0ucXVlcnlTZWxlY3RvcihlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtZXF1YWxcIikpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnZhbHVlLnRyaW0oKSAhPSBlcXVhbC52YWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRFcnJvcihlbGVtZW50LCB0aGlzLm1lc3NhZ2VzW2RvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoJ2xhbmcnKV0uZXF1YWwsIFwiZXF1YWxcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckVycm9yKGVsZW1lbnQsIFwiZXF1YWxcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGNoZWNrIHVuZXF1YWwgZmllbGRzICovXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwodW5lcXVhbF9maWVsZHMsIChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHVuZXF1YWwgPSB0aGlzLmZvcm0ucXVlcnlTZWxlY3RvcihlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdW5lcXVhbFwiKSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHVuZXF1YWwuc2VsZWN0ZWRJbmRleCA8IDAgfHwgZWxlbWVudC5zZWxlY3RlZEluZGV4IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEVycm9yKGVsZW1lbnQsIHRoaXMubWVzc2FnZXNbZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnbGFuZycpXS51bnNlbGVjdGVkLCBcInVuc2VsZWN0ZWRcIik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5vcHRpb25zW2VsZW1lbnQuc2VsZWN0ZWRJbmRleF0udmFsdWUudHJpbSgpID09IHVuZXF1YWwub3B0aW9uc1t1bmVxdWFsLnNlbGVjdGVkSW5kZXhdLnZhbHVlLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEVycm9yKGVsZW1lbnQsIHRoaXMubWVzc2FnZXNbZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnbGFuZycpXS51bmVxdWFsLCBcInVuZXF1YWxcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhckVycm9yKGVsZW1lbnQsIFwidW5lcXVhbFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLyogY2hlY2sgcmVxdWlyZWQgZmllbGRzICovXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwocmVxdWlyZWRfZmllbGRzLCAoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnZhbHVlLnRyaW0oKSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZEVycm9yKGVsZW1lbnQsIHRoaXMubWVzc2FnZXNbZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnbGFuZycpXS5yZXF1aXJlZCwgXCJyZXF1aXJlZFwiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyRXJyb3IoZWxlbWVudCwgJ3JlcXVpcmVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGNoZWNrIHVybCBmaWVsZHMgKi9cbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbCh1cmxfZmllbGRzLCAoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgoZWxlbWVudC52YWx1ZS50cmltKCkubGVuZ3RoID4gMCkgJiYgKHVybF9yZWdleC50ZXN0KGVsZW1lbnQudmFsdWUudHJpbSgpKSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXJyb3IoZWxlbWVudCwgdGhpcy5tZXNzYWdlc1tkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdsYW5nJyldLnVybCwgJ3VybCcpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJFcnJvcihlbGVtZW50LCAndXJsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIGNoZWNrIGVtYWlsIGZpZWxkcyAqL1xuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVtYWlsX2ZpZWxkcywgKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoKGVsZW1lbnQudmFsdWUudHJpbSgpLmxlbmd0aCA+IDApICYmIChlbWFpbF9yZWdleC50ZXN0KGVsZW1lbnQudmFsdWUudHJpbSgpKSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkRXJyb3IoZWxlbWVudCwgdGhpcy5tZXNzYWdlc1tkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdsYW5nJyldLmVtYWlsLCAnZW1haWwnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyRXJyb3IoZWxlbWVudCwgJ2VtYWlsJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBhbGxfZmllbGRzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZXF1YWxfZmllbGRzKS5jb25jYXQoXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocmVxdWlyZWRfZmllbGRzKSxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh1cmxfZmllbGRzKSxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlbWFpbF9maWVsZHMpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBbXS5mb3JFYWNoLmNhbGwoYWxsX2ZpZWxkcywgKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZXJyID0gZWxlbWVudC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3IoJy5mb3JtLWVycm9yJyk7XG4gICAgICAgICAgICAgICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnZhbGlkID0gZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKFwiZGF0YS1pbnZhbGlkXCIpO1xuICAgICAgICAgICAgICAgICAgICBpbnZhbGlkLnZhbHVlID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09IFwiU0VMRUNUXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubmV4dFNpYmxpbmcuc2V0QXR0cmlidXRlTm9kZShpbnZhbGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubmV4dFNpYmxpbmcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXZhbGlkJyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZU5vZGUoaW52YWxpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS12YWxpZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgdmFsaWQgPSBkb2N1bWVudC5jcmVhdGVBdHRyaWJ1dGUoXCJkYXRhLXZhbGlkXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZC52YWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT0gXCJTRUxFQ1RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5uZXh0U2libGluZy5zZXRBdHRyaWJ1dGVOb2RlKHZhbGlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQubmV4dFNpYmxpbmcucmVtb3ZlQXR0cmlidXRlKCdkYXRhLWludmFsaWQnKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlTm9kZSh2YWxpZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnZGF0YS1pbnZhbGlkJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGVycm9yc19jb3VudCA9IHRoaXMuZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9ybV9lcnJvcicpLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChlcnJvcnNfY291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHZhbGlkID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZXZlbnQgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHZhbGlkO1xuXG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGxldCByZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgIT0gXCJsb2FkaW5nXCIpIHJldHVybiByZXNvbHZlKCk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHJlc29sdmUoKSk7XG4gICAgfSk7XG5cbiAgICByZWFkeS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZm9ybXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdmb3JtJyk7XG4gICAgICAgIFtdLmZvckVhY2guY2FsbChmb3JtcywgKGZvcm0pID0+IHtcbiAgICAgICAgICAgIG5ldyBWYWxpZGF0aW9uKGZvcm0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkoKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
