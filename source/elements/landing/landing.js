"use strict";
(function() {
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

            if(document.querySelector('.landing') == null) {
                return;
            }

            this.fired = false;
            this.tablet = 1200;
            this.mobile = 750;
            this.min_height = 250;
            this.meta = document.querySelector("meta[name='viewport']");

            this.onResize();

            let header = document.querySelector('.header')
                , clock = document.querySelector('.clock')
                , main = document.querySelector('.slide_main');

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
                setTimeout(()=>{
                    active.classList.toggle('active_moment', false);
                    active.classList.toggle('active', true);
                }, 0);
            }

        }

        onResize () {
            if (
                (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) > 420 )
                && (Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 500)
            ){
                this.meta.setAttribute("content", "width=400");
            } else {
                this.meta.setAttribute("content", "width=device-width, initial-scale=1.0");
            }
        }

        hideNav () {
            Velocity(this.nav, "finish");
            Velocity(this.nav, {
                opacity: 0
            }, {
                duration: 300
                , complete: ()=> {
                    this.nav.style.display = "none";
                }
            });
        }

        showNav () {
            Velocity(this.nav, "finish");
            Velocity(this.nav, {
                opacity: 1
            }, {
                duration: 300
                , begin: ()=> {
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

            [].forEach.call(document.querySelectorAll('.slide__resizable, .slide__centred'), (resizable) => {
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
                }
            Velocity(loader, props, options);
        }


        recountSlides() {

            this.onResize();

            let resizables = document.querySelectorAll('.slide__resizable')
                , centred = document.querySelector('.slide__centred')
                , steps = document.querySelectorAll('.steps__step')
                , service_slide = document.querySelector('.slide_service')
                , service_illustration = document.querySelector('.slide__illustration')
                , main = document.querySelector('.slide_main')
                , shema = document.querySelector('.shema')
                , header_height = document.querySelector('.header').offsetHeight
                , footer_height = document.querySelector('.footer').offsetHeight
                , shema_details = shema.closest('.slide__details')
                , phones = main.querySelector('.slide__phones')
                , phone = main.querySelector('.slide__phone')
                , viewport_height
                , viewport_width
                , availabale_width
                , availabale_height
                , delta = 20
                , cell
                , size
                , scale = 1
                , scale_x = 1
                , scale_y = 1
                , header
                , slide
                , border_width
                , delta_y
                , tr_y
                , tr_x
                , element_width
                , element_height
                , illustration_height
                , w_width
                , w_height
                , i_width
                , del
                , i_height;

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

            if (
                (availabale_height >= 200)
                && (viewport_width > 750)
            ) {
                phones.style.height = Math.min(availabale_height, size) + "px";
                phones.style.marginLeft = -Math.min(availabale_height, size)*0.1 + "px";
                phones.style.visibility = "visible";
            } else if (availabale_height < 200 ) {
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
            illustration_height = (Math.min(cell.offsetHeight, parseInt(cell.style.height, 10)) - header.offsetHeight - footer_height - header_height);
            service_illustration.style.height = illustration_height + "px";

            w_width = 700;
            w_height = 570;
            i_width = viewport_width*1.2;
            i_height = w_height*i_width/w_width;

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
            [].forEach.call(steps, (step) => {
                step.removeAttribute('style');
            });

            if (Math.max(document.documentElement.clientHeight, window.innerHeight || 0) > 480 ) {

                slide = centred.closest('.slide');
                cell = centred.closest('.fp-tableCell');
                viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
                viewport_width = cell.offsetWidth;

                element_height = parseInt(centred.getAttribute('data-height'),10);

                if (viewport_width > 1220){
                    // desktop
                    element_width = 1230;
                    delta_y = 170;
                } else if ((viewport_width > 750) && (viewport_width <= 1220)) {
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

                scale_x = availabale_height/element_height;
                scale_y = availabale_width/element_width;
                scale = Math.min(Math.min(scale_x, scale_y),1);

                tr_y = 0;
                tr_x = 0;

                if (viewport_width < 750) {
                    // mobile
                    scale = availabale_height/620;
                    centred.style[Modernizr.prefixed('transform')] = 'translateX(-50%) scale(' + scale + ')';

                } else {
                    // not mobile

                    if (availabale_width < element_width ) {
                        tr_x = -(element_width - viewport_width)/2 ;
                    }

                    // upscale text
                    if (scale<1) {
                        [].forEach.call(steps, (step) => {
                            step.style[Modernizr.prefixed('transform')] = 'scale(' + Math.min((1/scale)*0.8, 2) + ')';
                        });
                        tr_x += 30;
                    }

                    tr_x += 'px';
                    centred.style[Modernizr.prefixed('transform')] = 'translateX(' + tr_x + ') translateY(' + tr_y + ') scale(' + scale + ')';
                }

            }


            [].forEach.call(resizables, (resizable) => {

                slide = resizable.closest('.slide');
                header = resizable.closest('.slide__details').querySelector('.slide__header');
                cell = resizable.closest('.fp-tableCell');

                viewport_height = Math.min(cell.offsetHeight, parseInt(cell.style.height, 10));
                viewport_width = cell.offsetWidth;

                element_height = parseInt(resizable.getAttribute('data-height'),10);
                element_width = parseInt(resizable.getAttribute('data-width'),10);

                scale_x = availabale_height/element_height;
                scale_y = availabale_width/element_width;
                scale = Math.min(scale_x, scale_y);


                if (viewport_width > this.mobile) {
                    // tablet and desktop resolution

                    availabale_height = viewport_height - header_height - delta;
                    availabale_width = viewport_width/2 - 40;

                    scale_x = availabale_height/element_height;
                    scale_y = availabale_width/element_width;
                    scale = Math.min(scale_x, scale_y);

                    if( availabale_height < this.min_height ) {

                        slide.classList.add('slide_hide-resizable');

                    } else if ( scale < 1 ) {

                        slide.classList.remove('slide_hide-resizable');
                        resizable.style[Modernizr.prefixed('transform')] = 'scale(' + scale + ')';

                        if (slide.classList.contains('slide_right')){
                            border_width = (parseInt(resizable.getAttribute('data-width'),10))*scale;
                            header.style.borderLeftWidth = border_width + 'px';

                            if (viewport_width > this.tablet ) {
                                // tablet resolution
                                resizable.style.marginRight = (header.offsetWidth/2 - border_width) + 'px';
                            }

                        } else {
                            border_width = (parseInt(resizable.getAttribute('data-width'),10))*scale;
                            header.style.borderRightWidth = border_width + 'px';

                            if (viewport_width > this.tablet ) {
                                // tablet resolution
                                resizable.style.marginLeft = (header.offsetWidth/2 - border_width) + 'px';
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

                    scale_x = availabale_height/element_height;
                    scale_y = availabale_width/element_width;
                    scale = Math.min(scale_x, scale_y);

                    if (availabale_width < element_width) {
                        resizable.style.marginLeft = - (((element_width - availabale_width)/2) - 20) + "px"
                    } else {
                        resizable.style.marginLeft = 'auto';
                    }

                    if( availabale_height < 200 ) {
                        console.log('hidding');
                        slide.classList.add('slide_hide-resizable');

                    } else if ( scale < 1 ) {

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
    new Landging;
})();
