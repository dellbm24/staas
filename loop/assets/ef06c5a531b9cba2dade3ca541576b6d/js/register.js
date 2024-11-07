(function ($) {

    'use strict';

    function isInViewport(el) {
        const topOfElement = el.offset().top;
        const bottomOfElement = el.offset().top + el.outerHeight();
        const bottomOfScreen = $(window).scrollTop() + $(window).innerHeight();
        const topOfScreen = $(window).scrollTop();

        return (bottomOfScreen > topOfElement) && (topOfScreen < bottomOfElement);
    }

    const register = {
        randomInteger: function (min, max) {
            return Math.floor(min + Math.random() * (max + 1 - min));
        },
        replaceAt: function (string, index, replace) {
            return string.substring(0, index) + replace + string.substring(index + 1);
        },
        generateRandomString: function (length) {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;

            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return result;
        },
        generateRandomPass: function (length) {
            let password = this.generateRandomString(length);
            let index;
            let indexes = [];

            if (!/[A-Z]/.test(password)) {
                index = this.randomInteger(0, length - 1);
                while (password[index].toUpperCase() == password[index] || indexes.includes(index)) {
                    index = this.randomInteger(0, length - 1);
                }
                indexes.push(index);
                password = this.replaceAt(password, index, password[index].toUpperCase());
            }

            if (!/[a-z]/.test(password)) {
                index = this.randomInteger(0, length - 1);
                while (password[index].toLowerCase() == password[index] || indexes.includes(index)) {
                    index = this.randomInteger(0, length - 1);
                }
                indexes.push(index);
                password = this.replaceAt(password, index, password[index].toLowerCase());
            }

            if (!/[0-9]/.test(password)) {
                index = this.randomInteger(0, length - 1);
                while (indexes.includes(index)) {
                    index = this.randomInteger(0, length - 1);
                }
                indexes.push(index);
                password = this.replaceAt(password, index, this.randomInteger(0, 9));
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,12}$/.test(password)) {
                return this.generateRandomPass(length);
            }

            return password;
        },
        serializeAllArray: function (form) {
            let obj = {};

            $('input, select', form).each(function () {
                obj[this.name] = $(this).val();
            });

            return obj;
        },
        sendRequest: function (type, url, data = null, loadingPageName = "", show = false) {
            return $.ajax({
                type: type,
                url: url,
                data: data,
                beforeSend: function () {
                    register.toggleLoadingPage(loadingPageName, show);
                },
                complete: function (e) {
                    if (e.status === 200) {
                        if (!e.responseJSON.status) {
                            register.toggleLoadingPage(loadingPageName, false);
                            $.SwalError.showErrors(e.responseJSON.errors);
                        }
                    }
                },
            })
        },
        toggleLoadingPage: function (loadingPageName, show) {
            const $loadingPage = $(loadingPageName);
            if ($loadingPage.length) {
                if (show) {
                    $loadingPage.addClass('show');
                    document.body.style.overflow = 'hidden';
                } else {
                    $loadingPage.removeClass('show');
                    document.body.style.overflow = null;
                }
            } else {
                if (show) {
                    $.LoadingOverlay('show');
                } else {
                    $.LoadingOverlay('hide');
                }

            }
        },
        getGeoData: function () {
            return this.sendRequest('POST', '/ajax/geo');
        },
    };

    $(function () {
        if ($('[data-load-from-cache]').length > 0) {
            register.getGeoData().then(({ status, data }) => {
                if (status) {
                    $('[name="FunnelRegistrationForm[country]"]').val(data.code);
                    $('[name="FunnelRegistrationForm[phone_prefix]"]').val(data.prefix);
                }
            });
        }
    });

    $('.registerForm').on('beforeSubmit', function () {
        const form = $(this);
        const modal = 'register-modal';
        const client = new ClientJS();
        const data = register.serializeAllArray(form);
        data['FunnelRegistrationForm[country]'] = form.find('[name="FunnelRegistrationForm[country]"]').data('value');
        data['FunnelRegistrationForm[fingerprint]'] = client.getFingerprint();

        let loadingTemplateName = "#loadingTmpl" + form.attr("id");
        let loadingPageName = "#registerFormLoading" + form.attr("id");

        const $loadingTemplate = $(loadingTemplateName).html();
        const $loadingPage = $(loadingPageName)

        if ($(`#${modal}`).is(':visible')) {
            MicroModal.close(modal);
        }

        if ($loadingTemplate) {
            if ($loadingPage.length === 0) {
                $("body").append($loadingTemplate);
            }
        } else {
            loadingPageName = "";
        }

        $.Kilgore.PROXY.getUserUuid()
            .then(uuid => {
                data['FunnelRegistrationForm[cookieId]'] = uuid;
            })
            .catch(error => console.log(error))
            .finally(() => {
                register.sendRequest(form.attr('method'), form.attr('action'), $.param(data), loadingPageName, true)
                    .then(({ data }) => {
                        if (data && data.hasOwnProperty('redirect_url') && data.hasOwnProperty('token')) {
                            $.Kilgore.PROXY.redirectWithToken(data.redirect_url, data.token);
                        }
                    });
            });

        return false;
    });

    $(document).ready(function () {

        const phonePrefixInput = $('[name="FunnelRegistrationForm[phone_prefix]"]');

        phonePrefixInput.each(function (key, value) {
            const intTelInput = intlTelInput(value, {
                initialCountry: 'auto',
                preferredCountries: [],
                separateDialCode: true,
                geoIpLookup: function (success) {
                    register.getGeoData().then(response => success(response.data.code));
                },
            });
            $(this).on('countrychange', function (e) {
                const form = $(this).closest('form');
                const countryInput = form.find('[name="FunnelRegistrationForm[country]"]');
                const phoneNumberInput = form.find('[name="FunnelRegistrationForm[phone_number]"]');
                const country = intTelInput.getSelectedCountryData();

                $(this).val(country.dialCode);
                countryInput.data('value', country.iso2.toUpperCase()).val(country.name);

                if (isInViewport($(this))) {
                    phoneNumberInput.focus();
                }

                form.find('.iti__selected-dial-code').css(
                    {'font-size': phoneNumberInput.css('font-size')}
                );
                form.find('.iti__flag-container').css(
                    {'color': phoneNumberInput.css('color')}
                );
            })
        });



    })

    $(document).on('click', '.generate-pass', function () {
        const password = $(this).closest('.form-group').find('.Password');
        password.val(register.generateRandomPass(10)).blur();
    });


})(jQuery);
