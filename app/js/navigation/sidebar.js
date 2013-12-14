/**
 * Created by jscote on 10/27/13.
 */
(function() {
    'use strict'

    var app = _$.directives;

    app.directive('llSidebar', ['$window', function($window) {
        // Repositions the sidebar on window resize
        // and opens and closes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A',
            replace: true,
            templateUrl: 'layout/sidebar.html'
        };
        var $win = $($window);
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $win.resize(resize);
            $dropdownElement.click(dropdown);

            function resize() {
                $win.width() >= 765 ? $sidebarInner.slideDown(350) : $sidebarInner.slideUp(350);
            }

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    }])
}

)();