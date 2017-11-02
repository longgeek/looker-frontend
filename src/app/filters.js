/**
 * filters
 *
 * Functions (filters)
 *  - remainingStudyTime
 */


/**
 * remainingStudyTime
 * return 剩余金额大约还能学习 N minutes | N hours | N days
 */
function remainingStudyTime() {
    return function(balance, price) {
        if (balance > 0) {
            learn_time = balance / price / 60;
            learn_type = '分钟';
            if ( learn_time >= 60) {
                learn_time = learn_time / 60;
                learn_type = '小时';
                // if (learn_time >= 24) {
                //     learn_time = learn_time / 24;
                //     learn_type = 'days';
                // }
            }
            return (learn_time).toFixed(1) + ' ' + learn_type;
        }
        return '0 minutes';
    }
}

/**
 * checkSum
 * 检测字符的数量, 包含中文.
 */
function checkSum() {
    return function(chars) {
        var sum = 0;
        for (var i=0; i<chars.length; i++) {
            var c = chars.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                sum++;
            } else {
                sum += 2;
            }
        }
        return sum;
    }
}


/**
 * setFillinInputWidth
 * 检测字符的数量, 包含中文, 返回合适的 px.
 */
function setFillinInputWidth() {
    return function(chars) {
        var sum = 0;
        for (var i=0; i<chars.length; i++) {
            var c = chars.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                sum++;
            } else {
                sum += 2;
            }
        }
        return sum * 12 + 12 + 'px';
    }
}


/**
 * objectLength
 * 统计对象有多少个 Key
 */
function objectLength() {
    return function(obj) {
        return Object.getOwnPropertyNames(obj).length;
    }
}


/**
 * toTrusted
 * trusted text
 */
function toTrusted($sce) {
    return function(text) {
        return $sce.trustAsHtml(text);
    }
}


/**
 * summernoteImage
 * in summernote editor window
 * paste the image to filter
 */
function summernoteImage() {
    return function(content) {
        if (content) {
            return content.replace(new RegExp(/(<img)/g), '<img ng-click="summernoteImageZoom($event)" class="summernote-image"')
        }
        return content;
    }
}


/**
 * toMarkDown
 * convert string to the markdown format
 */
function toMarkDown() {
    return function(content) {
        if (content) {
            return marked(content);
        }
        return;
    }
}


/**
 * convertZone
 * convert unix time to the local time zone.
 */
function convertZone() {
    return function(date) {
        if (date) {
            return date * 1000 - (new Date().getTimezoneOffset() * 60 * 1000);
        }
        return;
    }
}


/**
 * toChinaTime
 * convert time to the china format
 */
function toChinaTime() {
    return function(time) {
        Date.prototype.toRelativeTime = function(now_threshold) {
            var delta = new Date() - this;

            now_threshold = parseInt(now_threshold, 10);

            if (isNaN(now_threshold)) {
              now_threshold = 0;
            }

            if (delta <= now_threshold) {
              return '1 秒';
            }

            var units = null;
            var conversions = {
              '毫秒': 1,        // ms    -> ms
              '秒': 1000,       // ms    -> sec
              '分钟': 60,       // sec   -> min
              '小时': 60,       // min   -> hour
              '天': 24,         // hour  -> day
              '个月': 30,       // day   -> month (roughly)
              '年': 12          // month -> year
            };

            for (var key in conversions) {
              if (delta < conversions[key]) {
                break;
              } else {
                units = key; // keeps track of the selected key over the iteration
                delta = delta / conversions[key];
              }
            }

            // pluralize a unit when the difference is greater than 1.
            delta = Math.floor(delta);
            return [delta, units].join(" ");
        };
        date = new Date(time).toRelativeTime();
        if (date.indexOf('毫秒') !== -1) { return "1 秒前" }
        return date + '前';
    }
}


/**
 * toChinaTimeLine
 * convert time to the china format
 */
function toChinaTimeLine($filter) {
    return function(time) {
        Date.prototype.toRelativeTime = function(now_threshold) {
            var delta = new Date() - this;
            now_threshold = parseInt(now_threshold, 10);

            if (isNaN(now_threshold)) { now_threshold = 0; }
            if (delta <= now_threshold) { return '1 秒'; }

            var units = null;
            var conversions = {
                '毫秒': 1,        // ms    -> ms
                '秒': 1000,       // ms    -> sec
                '分钟': 60,       // sec   -> min
                '小时': 60,       // min   -> hour
                '天': 24,         // hour  -> day
                '个月': 30,       // day   -> month (roughly)
                '年': 12          // month -> year
            };

            for (var key in conversions) {
                if (delta < conversions[key]) { break; }
                else {
                  units = key; // keeps track of the selected key over the iteration
                  delta = delta / conversions[key];
                }
            }

            // pluralize a unit when the difference is greater than 1.
            delta = Math.floor(delta);
            return [delta, units].join(" ");
        };
        date = new Date(time).toRelativeTime();
        if (date.indexOf('毫秒') !== -1) { return "1 秒前" }
        else if (date.indexOf('秒') !== -1) { return date + '前'; }
        else if (date.indexOf('分钟') !== -1) { return date + '前'; }
        else if (date.indexOf('小时') !== -1) {
            now_date = new Date();
            if (now_date.getHours() <= date.split(" ")[0]) { return $filter('date')(time, "MM-dd HH:mm"); }
            else { return '今天 ' + $filter('date')(time, "HH:mm"); }
        }
        else { return $filter('date')(time, 'MM-dd HH:mm'); }
    }
}


/**
 * userUrl
 * replace check list the xxxxx.c.fuvism.com to username.c...
 */
function userUrl(ipCookie) {
    return function(doc) {
        if (doc) {
            if (ipCookie("user")) {
                user = ipCookie("user").username;
            } else {
                user = "用户名";
            }
            user = user + ".c.fuvism.com";
            return doc.replace(new RegExp(/(xxxxx\.c\.fuvism\.com)/g), user);
        }
        return;
    }
}


/**
 * textareaTab
 # textarea support tab keydown
 */
function textareaTab() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('keydown', function (event) {
                var keyCode = event.keyCode || event.which;
                if (keyCode === 9) {
                    event.preventDefault();
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    element.val(element.val().substring(0, start)
                        + '\t' + element.val().substring(end));
                    this.selectionStart = this.selectionEnd = start + 1;
                    element.triggerHandler('change');
                }
            });
        }
    }
}


/**
 * filterHtmlTags
 # 过滤字符串中所有 HTML 标签
 */
function filterHtmlTags() {
    return function(str) {
        return str.replace(/<\/?[^>]*>/g,'')
    }
}


/**
 * atUsername
 * 用 <a> 标签包裹 @用户名
 * 转义 HTML 标签和换行符
 */
function atUsername() {
    return function(val) {
        if (!val) { return; }
        // 转义 HTML 标签和换行
        n_val = val.replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;");
                   // .replace(/(\r)*\n/g,"<br/>");
        // 找到 @用户 替换为 Markdown [@用户](url)
        ats = n_val.match(/@([0-9a-zA-Z_*]{3,18})/g);

        // 查询 URL 开头是否包含 # 号
        hash = "";
        if (location.hash.startsWith('#')) { hash = "/#"; }
        for (i in ats) {
            tag = '<a target="_blank" href="' + hash + '/u/' + ats[i].split('@')[1] + '">' + ats[i] + '</a>';
            n_val = n_val.replace(ats[i], tag);
        }
        return n_val;
    }
}


angular
    .module('appLooker')
    .filter('remainingStudyTime', remainingStudyTime)
    .filter('checkSum', checkSum)
    .filter('setFillinInputWidth', setFillinInputWidth)
    .filter('objectLength', objectLength)
    .filter('toTrusted', toTrusted)
    .filter('summernoteImage', summernoteImage)
    .filter('toMarkDown', toMarkDown)
    .filter('convertZone', convertZone)
    .filter('toChinaTime', toChinaTime)
    .filter('toChinaTimeLine', toChinaTimeLine)
    .filter('userUrl', userUrl)
    .filter('textareaTab', textareaTab)
    .filter('filterHtmlTags', filterHtmlTags)
    .filter('atUsername', atUsername)
