/**
 * Overview Controller
 *
 * Functions (controllers)
 *  - OverviewController
 */

/**
 * OverviewController - User last learn controller
 * use overview.html view
 */
function OverviewController($scope, $timeout, $location, RestFul) {
    $scope.learnLoading = true;
    RestFul.global(
        {"action": "LearningProgress:LastStudied", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.lastLearn = response.data;
                $scope.lastLearn.joined_sort = response.data.joined_sort.reverse();
            }
            $timeout(function() { $scope.learnLoading = false; }, 500)
        }
    )

    $scope.goLastSubcourse = function(type, uuid) {
        $location.url('/learn/' + type + '/detail/?ud=' + uuid);
    }

    // Initialize random data for the demo
    var now = moment().endOf('day').toDate();
    var year_ago = moment().startOf('day').subtract(1, 'year').toDate();
    $scope.example_data = d3.time.days(year_ago, now).map(function (dateElement) {
      return {
        date: dateElement,
        details: Array.apply(null, new Array(Math.floor(Math.random() * 15))).map(function(e, i, arr) {
          return {
            'name': 'Project ' + Math.floor(Math.random() * 10),
            'date': function () {
              var projectDate = new Date(dateElement.getTime());
              projectDate.setHours(Math.floor(Math.random() * 24))
              projectDate.setMinutes(Math.floor(Math.random() * 60));
              return projectDate;
            }(),
            'value': 3600 * ((arr.length - i) / 5) + Math.floor(Math.random() * 3600)
          }
        }),
        init: function () {
          this.total = this.details.reduce(function (prev, e) {
            return prev + e.value;
          }, 0);
          return this;
        }
      }.init();
    });

    // Set custom color for the calendar heatmap
    $scope.color = '#1abc9c';

    // Set overview type (choices are year, month and day)
    $scope.overview = 'year';

    // Handler function
    $scope.print = function (val) {
      console.log(val);
    };
}

angular
    .module('appLooker')
    .controller('OverviewController', OverviewController)
