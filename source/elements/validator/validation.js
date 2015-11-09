"use strict";
(function() {

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
                    required: "Required field"
                    , email: "Wrong email format"
                    , equal: "Password fields should be equal"
                    , unequal: "Languages shouldn't be equal"
                    , url: "Wrong url format"
                }
                , ru: {
                    required: "Поле обязательно для заполнения"
                    , email: "Проверьте формат email"
                    , equal: "Пароли должны совпадать"
                    , unequal: "Языки не должны совпадать"
                    , url: "Проверьте формат URL"
                }
            };
        }


        /**
         * @description Reset form and clear errors
         */
        clear () {

            let selects = $(this.form).find('select')
                , index = selects.length;
            while (index--) {

                if(typeof selects[index].select2 != null) {
                    $(selects[index]).select2("val", "");
                } else {
                    selects[index].selectedIndex = 0;
                }

                [].forEach.call(selects[index].querySelectorAll('option[value][disabled]'), (option) => {
                    option.removeAttribute('disabled');
                });
            }

            this.form.reset();

            setTimeout(()=>{
                let errors = document.querySelectorAll('.form-error'),
                    fields = document.querySelectorAll('[data-valid], [data-invalid]');

                [].forEach.call(errors, (error) => {
                    error.parentNode.removeChild(error);
                });

                [].forEach.call(fields, (field) => {
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
            [].forEach.call(this.form.querySelectorAll('[data-type-custom]'), (element) => {
                element.parentNode.removeChild(element);
            });

            /* check equal fields */
            [].forEach.call(equal_fields, (element) => {
                let equal = this.form.querySelector(element.getAttribute("data-equal"));
                if (element.value.trim() != equal.value.trim()) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].equal, "equal");
                } else {
                    this.clearError(element, "equal");
                }
            });

            /* check unequal fields */
            [].forEach.call(unequal_fields, (element) => {
                let unequal = this.form.querySelector(element.getAttribute("data-unequal"));
                if (element.options[element.selectedIndex].value.trim() == unequal.options[unequal.selectedIndex].value.trim()) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].unequal, "unequal");
                } else {
                    this.clearError(element, "unequal");
                }
            });

            /* check required fields */
            [].forEach.call(required_fields, (element) => {
                if (element.value.trim() === "") {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].required, "required");
                } else {
                    this.clearError(element, 'required');
                }
            });

            /* check url fields */
            [].forEach.call(url_fields, (element) => {
                if ((element.value.trim().length > 0) && (url_regex.test(element.value.trim()) === false)) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].url, 'url');
                } else {
                    this.clearError(element, 'url');
                }
            });

            /* check email fields */
            [].forEach.call(email_fields, (element) => {
                if ((element.value.trim().length > 0) && (email_regex.test(element.value.trim()) === false)) {
                    valid = false;
                    this.addError(element, this.messages[document.body.parentNode.getAttribute('lang')].email, 'email');
                } else {
                    this.clearError(element, 'email');
                }
            });

            let all_fields = Array.prototype.slice.call(equal_fields).concat(
                Array.prototype.slice.call(required_fields),
                Array.prototype.slice.call(url_fields),
                Array.prototype.slice.call(email_fields)
            );

            [].forEach.call(all_fields, (element) => {
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

    ready.then(function() {
        let forms = document.querySelectorAll('form');
        [].forEach.call(forms, (form) => {
            new Validation(form);
        });
    });

})();
