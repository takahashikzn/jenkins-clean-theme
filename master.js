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

            // top page or view page only
            if ((window.location.pathname === '/') || /\/view\/\w+\/?$/.test(window.location.pathname)) {

                var countExecutingJobs = function() {
                    return $('#executors .progress-bar').length;
                };

                var executingJobNum = countExecutingJobs();

                setInterval(function() {
                    if (executingJobNum !== countExecutingJobs()) {
                        reloadPage();
                    }
                }, 1000);
            }

        }, 1000);
    });

    $(document).ready(function() {

        var movies = [ 'webm', 'mp4', 'ogg', 'flv' ];
        var images = [ 'jpg', 'png', 'gif', 'bmp' ];
        var binaries = movies.concat(images).concat([ 'xls', 'xlsx' ]);

        setInterval(function() {

            movies.forEach(function(ext) {

                $("a[href$='." + ext + "']").replaceWith(function() {

                    var $this = $(this);
                    var $widthSlider = $('<input />').attr({
                        type: 'range',
                        min: 50,
                        max: 150,
                        step: 20
                    });
                    var $video = $('<video />');

                    var minimumVideoControlWidth = 200;
                    var desiredVideoWidth = Math.min(Math.floor($jq(window).width() - $jq('#side-panel').width() - $jq("#main-panel div[style='float:right']").width()), 1100);
                    var videoWidthMargin = 250;
                    var videoWidth = Math.max(desiredVideoWidth - videoWidthMargin, minimumVideoControlWidth);

                    $widthSlider.bind('input', function() {
                        $video.width(($(this).val() / 100) * videoWidth);
                    });

                    $video.attr({
                        controls: 'controls',
                        width: videoWidth,
                        src: $this.prop('href')
                    }).click(function() {
                        if ($video.prop('paused')) {
                            $video[0].play().catch(e => console.error(e));
                        } else {
                            $video[0].pause().catch(e => console.error(e));
                        }
                    });

                    var $container = $('<div />');

                    $container.append($('<div />').append('<span>FrameSize </span>').append($widthSlider));
                    $container.append($video);

                    return $container;
                });
            });

            binaries.forEach(function(ext) {
                $("a[href$='." + ext + "/*view*/']").remove();
            });
        }, 250);
    });

    window.$jq = $; // keep for later use

})(jQuery.noConflict(true));
