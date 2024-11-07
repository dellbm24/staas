(function ($) {

    $.SwalError = $.SwalError || {};

    $.SwalError.showErrors = function (errors, callback = null) {
        let closeBtn;
        let errorText = '';

        errors.forEach(function (val) {
            if (val.attribute !== 'scope' && val.message !== undefined && val.message !== null) {
                errorText = errorText + val.message + '\n';
            }
        });

        swal({
            title: '',
            text: errorText,
            html: true,
            type: 'error',
        }, function (response) {
            if (callback instanceof Function) {
                closeBtn.remove();
                callback(response);
            }
        });

        closeBtn = document.createElement('a');
        closeBtn.href = '#';
        closeBtn.className = 'swal-close';
        closeBtn.textContent = '×';
        closeBtn.onclick = function (e) {
            e.preventDefault();
            closeBtn.remove();
            swal.close();
        };

        document.querySelector('.sweet-alert').appendChild(closeBtn);
    }

})(jQuery);
