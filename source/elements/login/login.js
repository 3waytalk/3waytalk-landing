"use strict";
(function () {
    class Menu {
        /**
         * @description Start initialization on domload
         * @constructor
         */
        constructor () {
            let ready = new Promise((resolve, reject)=>{
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", ()=> resolve());
            });
            ready.then(this.init.bind(this));
        }

        /**
         * @description Adding events and properties
         */
        init () {

            if(document.querySelector('.login') == null) {
                return;
            }

            let back_buttons =              document.querySelectorAll('.login__back')
                , login_buttons =           document.querySelectorAll('.login__login-button, .login_success .login__submit')
                , mobile_popup_buttons =    document.querySelectorAll('.menu__interpreter, .header__interpreter');

            this.menu_popup_open = false;

            this.login_button =             document.querySelector('.menu__login');
            //this.login_button =             document.querySelector('.menu__login_button');
            this.register_button =          document.querySelector('.menu__register');

            this.step1 =                    document.querySelector('.login_register-step-1');
            this.step1_form =               document.querySelector('.login_register-step-1 form.login__form');
            this.step2 =                    document.querySelector('.login_register-step-2');
            this.step2_form =               document.querySelector('.login_register-step-2 form.login__form');

            this.login_form =               document.querySelector('.login_login form.login__form');

            this.mobile_popup =             document.querySelector('.popup_mobile');
            this.mobile_popup_close =       this.mobile_popup.querySelector('.popup__close');

            this.wrapper =                  document.querySelector('.menu__wrapper');
            this.header_register_button =   document.querySelector('.header__link_register');
            this.header_login_button =      document.querySelector('.header__link_login');
            this.recovery_button =          document.querySelector('.login__password-recovery');
            this.lightbox =                 document.querySelector('body>.lightbox');
            this.login_popup =              document.querySelector('.login_login');
            this.recovery =                 document.querySelector('.login_recovery');
            this.password =                 document.querySelector('.login_password');
            this.recovery_form =            this.recovery.querySelector('.login__form');
            this.password_form =            this.password.querySelector('.login__form');

            this.error_message =            document.querySelector('.alert_form-send-fail');

            this.email =                    document.querySelector('.login_email');
            this.success =                  document.querySelector('.login_success');

            this.current = document.querySelector('.login_open');
            this.last = [];

            if(this.login_button) {
              this.login_button.addEventListener('click', this.openLoginForm.bind(this));
            }

            this.recovery_button.addEventListener('click', this.openRecovery.bind(this));
            this.lightbox.addEventListener('click', this.closeAll.bind(this));
            this.register_button.addEventListener('click', this.openRegister.bind(this));

            if(this.header_login_button) {
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

            this.language_from =        document.querySelector('.language_from');
            this.language_to =          document.querySelector('.language_to');
            this.language_location =    document.querySelector('.language_location');

            $(".login select.language_from").on("change", this.changeFromLanguage.bind(this));

            [].forEach.call(document.querySelectorAll('.login'), (element) => {
                element.style.visibility = "visible";
            });

            [].forEach.call(mobile_popup_buttons, (button) => {
                button.addEventListener('click', this.openLoginForm.bind(this));
            });

            [].forEach.call(back_buttons, (button) => {
                button.addEventListener('click', this.goback.bind(this));
            });

            [].forEach.call(login_buttons, (button) => {
                button.addEventListener('click', this.openLoginInner.bind(this));
            });

            this.WebRTCSupport = !document.documentElement.classList.contains('no-peerconnection');


            if(!this.WebRTCSupport) {

                [].forEach.call(document.querySelectorAll('form.login__form input, form.login__form button, form.login__form select'), (element) => {
                    element.setAttribute("disabled","disabled");
                });

                [].forEach.call(document.documentElement.querySelectorAll('form.login__form'), (form) => {
                    form.addEventListener("click", (event)=>{
                        form.closest('.login').querySelector('.popup_browser').open();
                    });
                });

                [].forEach.call(document.querySelectorAll('.popup_browser'), (popup) => {
                    this.showPopup(popup);
                });
            }
        }

        changeFromLanguage () {
            let value_from = this.language_from.value
                , value_to = this.language_to.value;

            if (value_from === value_to) {
                this.language_to.selectedIndex = 0;
                $(this.language_to).select2("val", "");
            }

            [].forEach.call(this.language_to.querySelectorAll('option[value][disabled]'), (to_enable)=>{
                to_enable.removeAttribute('disabled');
            });

            [].forEach.call(this.language_to.querySelectorAll('option[value="' + value_from + '"]'), (to_disable)=>{
                to_disable.setAttribute('disabled', 'disabled');
            });

            // inefficient, but it look lite there are no other way correctly disable/enable select2 dynamically
            $(this.language_to).select2();
        }

        openNext (event) {
            event.preventDefault();

            this.step1_data = {
                from: $('select.language_from').select2("val")
                , to: $('select.language_to').select2("val")
                , location: $('select.language_location').select2("val")
            };

            if (this.step1_form.validate() == false) {
                return;
            }

            this.openForm(this.step2);
        }

        reposPopup (event) {
            if(!this.menu_popup_open){
                return;
            }
            this.mobile_popup.style[Modernizr.prefixed('transform')] = "translateY(" + this.mobile_popup.offsetHeight + "px)";
        }

        closeMobilePopup () {
            if(!this.menu_popup_open){
                return;
            }
            this.menu_popup_open = false;

            Velocity(this.mobile_popup, "stop");
            Velocity(this.mobile_popup, {translateY: 0}, 250);

            Velocity(this.mobile_popup_button, "stop");
            Velocity(this.mobile_popup_button, {
                opacity: 1
            }, {
                duration: 250
                , begin: ()=> {
                    this.mobile_popup_button.style.display = "block";
                }
            });
        }

        openMobilePopup () {
            if(this.menu_popup_open){
                return;
            }
            this.menu_popup_open = true;

            Velocity(this.mobile_popup, "stop");
            Velocity(this.mobile_popup, {translateY: this.mobile_popup.offsetHeight + "px"}, 250);

            Velocity(this.mobile_popup_button, "stop");
            Velocity(this.mobile_popup_button, {
                opacity: 0
            }, {
                duration: 250
                , complete: ()=> {
                    this.mobile_popup_button.style.display = "none";
                }
            });
        }

        showPopup (popup) {
            if (popup.show != undefined){
                popup.show();
            } else {
                setTimeout(this.showPopup.bind(this, popup), 50);
            }
        }

        /**
         * @description Scroll to first slide and open login form
         */
        openLoginOuter (event) {
            event.preventDefault();
            $.fn.fullpage.moveTo(1, 0);
            setTimeout(()=>{
                this.login_button.click();
            }, 800)
        }

        /**
         * @description Scroll to first slide and open register form
         */
        openRegisterOuter (event) {
            event.preventDefault();
            $.fn.fullpage.moveTo(1, 0);
            setTimeout(()=>{
                this.register_button.click();
            }, 800)
        }

        /**
         * @description Send registration data and show message
         */
        sendData (event) {
            event.preventDefault();
            let form = event.currentTarget;
            
            console.log('sending');

            if (form.validate() == false) {
                return;
            }

            try {
                let DONE = 4
                , OK = 200
                , after_action
                , xhr = new XMLHttpRequest()
                , loaded
                , index
                , response
                , data = new FormData(form);

                if (this.step1_data != null) {
                    data.append('fos_user_registration_form[translatorProfile][nativeLanguage]',     this.step1_data.from);
                    data.append('fos_user_registration_form[translatorProfile][foreignLanguage]',       this.step1_data.to);
                    data.append('fos_user_registration_form[country]', this.step1_data.location);
                }

                loaded = new Promise((resolve, reject) => {
                    xhr.open('POST', form.getAttribute('action'));
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                    xhr.send(data);
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === DONE) {
                            if (xhr.status === OK) {
                                setTimeout(()=>{this.clearAll();}, 500);
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
        redirectTo (url) {
            document.location.href = url;
        }

        /**
         * @description Show check email message
         */
        showCheckMessage () {
            this.last = new Array();
            this.openForm(this.email, true);
        }

        /**
         * @description Show success message
         */
        showSuccessMessage () {
            this.last = new Array();
            this.openForm(this.success);
        }

        /**
         * @description Open login
         */
        openLoginInner () {
            this.openForm(this.login_popup);
        }

        /**
         * @description Show message
         */
        showErrorMessage (reason) {
            // this.last = new Array();
            var message_text = null
            , skip_popup = false
            , form = this.current.querySelector('form');

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

            if(! skip_popup) {
                this.error_message.open(message_text);
            }
        }

        /**
         * @description Open last page
         */
        goback () {
            this.openForm();
        }

        /**
         * @description Show email sent warning
         */
        emailHaveSend () {
            this.last = new Array();
            this.openForm(this.email);
        }

        /**
         * @description Open register form
         */
        openRegisterInner () {
            this.openForm(this.step1);
        }

        /**
         * @description Open register form
         */
        openRegister () {
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
                },
                options = {
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
        openRecovery (event) {
            event.preventDefault();
            if(!this.WebRTCSupport) {
                return;
            }
            this.openForm(this.recovery);
        }

        /**
         * @description Open recovery forms
         * @param form {node} Form you want to open
         * @param back {node} Form which you want to open when user press back, by default — last form opened
         */
        openForm (popup, dont_save) {
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
                    right: - this.current.offsetWidth + "px"
                },
                options = {
                    duration: 250
                };

            Velocity(this.current, props, options);
            props = {
                    right: 0
                },
                options = {
                    duration: 250
                };

            Velocity(popup, props, options);
            this.current = popup;
        }

        /**
         * @description Close all forms
         */
        closeAll () {

            $.fn.fullpage.setAllowScrolling(true);
            $.fn.fullpage.setKeyboardScrolling(true);

            let props = {
                    right: - this.current.offsetWidth + "px"
                },
                options = {
                    duration: 250
                };

            Velocity(this.current, props, options);
            this.current = null;

            props = {
                    opacity: 0
                },
                options = {
                    complete: () => {
                        this.lightbox.style.display = "none";
                    },
                    duration: 250
                };

            Velocity(this.lightbox, props, options);
            setTimeout(()=>{this.clearAll();}, 500);
        }

        clearAll () {
            console.log('clearing');
            [].forEach.call(document.querySelectorAll('form'), (form) => {
                form.clear();
            });
        }

        /**
         * @description Open login popup
         */
        openLoginForm (event) {
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
                },
                options = {
                    begin: () => {
                        this.lightbox.style.display = "block";
                    },
                    duration: 250
                };

            Velocity(this.lightbox, props, options);
        }
    }

    new Menu;
})();
