(function ($) {

    'use strict';

    $('#AjaxLoginForm').on('beforeSubmit', function () {
        const form = $(this);
        const inputs = form.find(':disabled');
        inputs.prop('disabled', false);
        $.ajax({
            type: form.attr('method'),
            url: form.attr('action'),
            data: form.serializeArray(),
            beforeSend: function () {
                $.LoadingOverlay('show');

            },
            complete: function (e) {
                $.LoadingOverlay('hide');
                inputs.prop('disabled', true);
                if (e.status === 200 && !e.responseJSON.status) {
                    $.SwalError.showErrors(e.responseJSON.errors);
                }
            }
        });
        return false;
    });

})(jQuery);
