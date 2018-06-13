angular.module('dragNdrop')
    .directive('draggable', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).draggable({
                    helper: "clone"
                });
            }
        }
    }])
    .directive('sortable', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                $(element).sortable({
                    placeholder: 'sortable-palceholder'
                  }).disableSelection();
            }
        }
    }])
    .directive('dropzone', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            scope: {
                sourceElements: '=source'
            },
            link: function (scope, element, attrs) {
                $(element).droppable({
                    drop: function (event, ui) {
                        var isSortActive = $(ui.helper[0]).hasClass('ui-sortable-helper') || $(ui.helper[0]).hasClass('ui-sortable-handle');
                        if (!isSortActive) {
                            var index = parseInt($(ui.draggable).attr('index'), 10);
                            var selectedElement = scope.sourceElements[index];
                            var htmlNode = $(
                            `<div class="col-sm-12 p-0 element-control-panel">
                                <div class="element-controls">
                                    <div class="text-right delete-button">
                                        <span class="delete-element oi" data-glyph="x"></span>
                                    </div>
                                    <div class="added-element clearfix">
                                        ${selectedElement.html}
                                    </div>
                                </div>
                            </div>`);
                            $(element).append(htmlNode);
    
                            $('.delete-element').click(function () {
                                $(this).parents('.col-sm-12').remove();
                            });
                        }
                    }
                });
            }
        }
    }])
    .directive('preview', [function () {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                $(element).empty();
                var editor = $($('.editor-window').html());
                var children = editor.children().toArray();
                children.forEach(function (e) {
                    var addedElement;
                    if ($(e).hasClass('html-source')) {
                        addedElement = $($(e).html());
                    }
                    else {
                        addedElement = $($(e).find('.added-element'));
                    }

                    $(element).append(addedElement);
                });
            }
        }
      }]);
