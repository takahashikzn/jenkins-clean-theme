// Window load event used just in case window height is dependant upon images

(function($) {

    function stickyFoot() {
        var bodyHeight = $("body.yui-skin-sam").height();
        var vwptHeight = $(window).height();
        var footHeight = 45;
        var headerHeight = $("#header").height();
        $("#main-table").css("min-height",vwptHeight-footHeight-headerHeight);
    }

    function updateExecutors() {
        $('#executors th.pane a.model-link').css('max-width',$("#side-panel").width() - 15);
    }

    $(document).ready(function() {
        stickyFoot();
        updateExecutors();

        // hook into build executor update
        _refreshPart = window.refreshPart;
        window.refreshPart = function(id, url) {
            _refreshPart(id, url);
            if(id == 'executors') updateExecutors();
        }
    });

    $(window).resize(function() {
        stickyFoot();
        updateExecutors();
    });

    $(document).scroll(function() {
        stickyFoot();
    });

    $(document).ready(function() {
        $('#main-panel')
            .removeClass('col-md-9').addClass('col-md-8')
            .attr('style', 'border-left: none !important;')
                .find("div[style='float:right'] div[align='right']")
                .attr('align', 'left');
    });

    $(document).ready(function() {
        setTimeout(function() {

            var reloadPage = function() {
                setTimeout(function() {
                    window.location.reload();
                }, 1000)
            };

            setInterval(function() {

                $(document)
                    .find("a[href^='job/'][href*='/build'], a[href='/cancelQuietDown']")
                    .each(function() {

                        var $this = $(this);

                        if ($this.data('forcePostInstrumented')) {
                            return;
                        }

                        $this.data('forcePostInstrumented', true).click(function() {

                            $.post($this.prop('href')).done(reloadPage);

                            return false;
                        });
                    });
            }, 250);

            var countExecutingJobs = function() {
                return $('#executors .progress-bar').length;
            };

            var executingJobNum = countExecutingJobs();

            setInterval(function() {
                if (executingJobNum !== countExecutingJobs()) {
                    reloadPage();
                }
            }, 1000);

        }, 1000);
    });

    window.$jq = $; // keep for later use

})(jQuery.noConflict(true));
