var funnelInfoFunction = function () {
    const registerFormSubmitBtn = $('.optin-form button[type="submit"], .registerForm button[type="submit"]');

    if (!$.Kilgore.isAuthed) {
        registerFormSubmitBtn.prop('disabled', true);

        $.Kilgore.PROXY.getFunnelInfo(function (response) {
            if (response.status) {
                $.Kilgore.isAuthed = true;
                registerFormSubmitBtn.prop('disabled', false);
                document.dispatchEvent($.Kilgore.PROXY.createNewEvent('funnelAuthed', {
                    trackingParams: response.data
                }));
            } else {
                console.error('Funnel is not authorized');
            }
        }, function(error) {
            console.error('Funnel is not authorized');
        });
    } else {
        document.dispatchEvent($.Kilgore.PROXY.createNewEvent('funnelAuthed'));
        registerFormSubmitBtn.prop('disabled', false);
    }
};
document.addEventListener('DOMContentLoaded', funnelInfoFunction);
window.addEventListener('jquery', funnelInfoFunction);
