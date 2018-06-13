// const vscode = acquireVsCodeApi();

angular.element(document).ready(function () {  
    angular.bootstrap(document, ['dragNdrop']);
});

angular.module('dragNdrop', ['ngSanitize'])
    .controller('DragNDropController', ['$sce', '$scope', function ($sce, $scope) {
        var Draggable = function (args) {
            this.id = args.id;
            this.name = args.name;
            this.html = args.html;
        }

        $scope.vscode = acquireVsCodeApi();

        var dragDrop = this;
        $scope.isPrviewActive = false;
        $scope.draggables = [];
        $scope.droppings = [];

        var init = function () {
            $scope.draggables.push(new Draggable({ id: 1, name: 'Primary Button', html: '<button class="btn btn-primary mt-2 mx-2">Primary Button</button>' }));
            $scope.draggables.push(new Draggable({ id: 2, name: 'Secondary Button', html: '<button class="btn btn-secondary mt-2 mx-2">Secondary Button</button>' }));
            $scope.draggables.push(new Draggable({ id: 3, name: 'Danger Button', html: '<button class="btn btn-danger mt-2 mx-2">Danger Button</button>' }));
            $scope.draggables.push(new Draggable({ id: 4, name: 'Success Button', html: '<button class="btn btn-success mt-2 mx-2">Success Button</button>' }));
            $scope.draggables.push(new Draggable({ id: 5, name: 'Dark Button', html: '<button class="btn btn-dark mt-2 mx-2">Dark Button</button>' }));
            $scope.draggables.push(new Draggable({ id: 5, name: 'Dark Button Right', html: '<button class="btn btn-dark float-right mt-2 mx-2">Dark Button</button>' }));
        }

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.showPreview = function () {
            $scope.isPrviewActive = !$scope.isPrviewActive;
        }

        init();
    }]);