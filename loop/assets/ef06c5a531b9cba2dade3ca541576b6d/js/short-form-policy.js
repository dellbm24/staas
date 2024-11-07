(function ($) {
    let tooltipSelector = 'img.members-form-policy-devider';
    let tooltipElement = 'p.members-form-policy-tooltip';

    /**
     * Show tooltip on mouse hover to icon, and hover to tooltip block
     * */
    $(document).on('mouseenter', tooltipSelector, function (event) {
        $(tooltipElement).fadeTo( "fast" , 1, function() {
            $(tooltipElement).show();
        });

    });

    /**
     * Hide tooltip when mouse out from tooltip icon or tooltip block
     * */
    $(document).on('mouseleave', tooltipSelector, function (event) {
        $(tooltipElement).fadeTo( "fast" , 0, function() {
            $(tooltipElement).hide();
        });
    });
})(jQuery);