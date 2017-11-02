/**
 * Consumption Controller
 *
 * Functions (controllers)
 *  - ConsumptionController
 */

/**
 * ConsumptionController - consumption controller
 * use consumption.html view
 */
function ConsumptionController($scope, $timeout, RestFul) {
    Date.prototype.format =function(format) {
      var o = {
      "M+" : this.getMonth()+1, //month
      "d+" : this.getDate(), //day
      "h+" : this.getHours(), //hour
      "m+" : this.getMinutes(), //minute
      "s+" : this.getSeconds(), //second
      "q+" : Math.floor((this.getMonth()+3)/3), //quarter
      "S" : this.getMilliseconds() //millisecond
      }
      if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
      (this.getFullYear()+"").substr(4- RegExp.$1.length));
      for(var k in o)if(new RegExp("("+ k +")").test(format))
      format = format.replace(RegExp.$1,
      RegExp.$1.length==1? o[k] :
      ("00"+ o[k]).substr((""+ o[k]).length));
      return format;
    }
    var week_data = [
        {
            "ymd": moment().day(0).format('YYYY-MM-DD'),
            "date": moment().day(0).toDate(),
            "total": 0,
            "details": [],
        },
        {
            "ymd": moment().day(1).format('YYYY-MM-DD'),
            "date": moment().day(1).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
        {
            "ymd": moment().day(2).format('YYYY-MM-DD'),
            "date": moment().day(2).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
        {
            "ymd": moment().day(3).format('YYYY-MM-DD'),
            "date": moment().day(3).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
        {
            "ymd": moment().day(4).format('YYYY-MM-DD'),
            "date": moment().day(4).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
        {
            "ymd": moment().day(5).format('YYYY-MM-DD'),
            "date": moment().day(5).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
        {
            "ymd": moment().day(6).format('YYYY-MM-DD'),
            "date": moment().day(6).toDate(),
            "total": 0,
            "details": [],
            init: function () {
              this.total = this.details.reduce(function (prev, e) {
                return prev + e.value;
              }, 0);
              return this;
            }
        },
    ];
    $scope.consumptionLoading = true;
    $scope.overviews = { "today": 0, "week": 0, };
    RestFul.global(
        {"action": "Account:MyTransactions", "params": {}},
        function(response) {
            if (!response) { return; };
            if (response.hasOwnProperty('message') && response.hasOwnProperty('data') && response.data) {
                $scope.bills = response.data.transactions;
                var now_time = new Date().toLocaleDateString();

                for (i in response.data.transactions) {
                    value = response.data.transactions[i];
                    if (value.ctype === "outgoing") {
                        value_time = value.start_at * 1000 - (new Date().getTimezoneOffset() * 60 * 1000);
                        value_time_date = new Date(value_time).format('yyyy-MM-dd');
                        // today
                        local_time = new Date(value_time).toLocaleDateString();
                        if (local_time === now_time) {
                            $scope.overviews.today += value.amount;
                        }
                        // week
                        if (value_time >= getWeekStartDate() && value_time <= getWeekEndDate()) {
                            $scope.overviews.week += value.amount;
                            detail_data = {
                                "name": "在线学习",
                                "date": new Date(value_time).toString(),
                                "value": value.timing,
                            }
                            if (value_time_date === week_data[0].ymd) {
                                week_data[0].total += value.timing;
                                week_data[0].details.push(detail_data);
                            } else if (value_time_date === week_data[1].ymd) {
                                week_data[1].total += value.timing;
                                week_data[1].details.push(detail_data);
                            } else if (value_time_date === week_data[2].ymd) {
                                week_data[2].total += value.timing;
                                week_data[2].details.push(detail_data);
                            } else if (value_time_date === week_data[3].ymd) {
                                week_data[3].total += value.timing;
                                week_data[3].details.push(detail_data);
                            } else if (value_time_date === week_data[4].ymd) {
                                week_data[4].total += value.timing;
                                week_data[4].details.push(detail_data);
                            } else if (value_time_date === week_data[5].ymd) {
                                week_data[5].total += value.timing;
                                week_data[5].details.push(detail_data);
                            } else if (value_time_date === week_data[6].ymd) {
                                week_data[6].total += value.timing;
                                week_data[6].details.push(detail_data);
                            }
                        }
                    }
                }
                $scope.overviews.today = angular.copy(toDecimal($scope.overviews.today));
                $scope.overviews.week = angular.copy(toDecimal($scope.overviews.week));
                $scope.week_data = angular.copy(week_data);
            }
            $timeout(function() { $scope.consumptionLoading = false; }, 300)
        }
    )

    $scope.labels = ['10:38'];
    $scope.data = [
        [4.32]
    ];
    $scope.colors = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            pointBackgroundColor: '#1abc9c',
            pointHoverBackgroundColor: '#1abc9c',
            borderColor: '#1abc9c',
            pointBorderColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
    ];
    $scope.options = {
        legend: { display: false },
        scales: {
            // xAxes: [{
            //     barPercentage: 0.2
            // }],
            yAxes: [{
                display: true,
                ticks: {
                    suggestedMin: 0,
                    stepSize: 50,
                },
            }],
        }
    };
    $scope.randomize = function () {
        $scope.data = $scope.data.map(function (data) {
            return data.map(function (y) {
                y = y + Math.random() * 10 - 5;
                return parseInt(y < 0 ? 0 : y > 100 ? 100 : y);
            });
        });
    };

    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getFullYear(); //当前年

    // 获得本周的开端日期
    function getWeekStartDate() {
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        return Date.parse(weekStartDate);
    }

    // 获得本周的停止日期
    function getWeekEndDate() {
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        return Date.parse(weekEndDate);
    }

    function toDecimal(x) {
         var val = Number(x)
        if(!isNaN(parseFloat(val))) {
           val = val.toFixed(4);
        }
        return  val;
    }






    // CALENDAR-HEATMAP
    // Set custom color for the calendar heatmap
    $scope.color = '#1abc9c';

    // Set overview type (choices are year, month and day)
    $scope.overview = 'week';

    // Handler function
    $scope.print = function (val) {
      console.log(val);
    };
}

angular
    .module('appLooker')
    .controller('ConsumptionController', ConsumptionController)
