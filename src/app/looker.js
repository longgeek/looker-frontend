/**
 * INSPINIA - Responsive Admin Theme
 * 2.3
 *
 * Custom scripts
 */

$(document).ready(function () {


  // Full height
  function fix_height() {
    var heightWithoutNavbar = $("body > #wrapper").height() - 61;
    $(".sidebard-panel").css("min-height", heightWithoutNavbar + "px");

    var navbarHeigh = $('nav.navbar-default').height();
    var wrapperHeigh = $('#page-wrapper').height();

    if (navbarHeigh > wrapperHeigh) {
      $('#page-wrapper').css("min-height", navbarHeigh + "px");
    }

    if (navbarHeigh < wrapperHeigh) {
      $('#page-wrapper').css("min-height", $(window).height() + "px");
    }

    if ($('body').hasClass('fixed-nav')) {
      $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
    }
  }

  $(window).bind("load resize", function () {
    if (!$("body").hasClass('body-small')) {
      fix_height();
    }
    if ($("body").hasClass('study-page')) {
        $("#wrapper").height($(window).height());
    }
  })

  setTimeout(function () {
    fix_height();
  })

//  // In the plan's details page, scroll event listener
//  $(window).bind("scroll", function() {
//      function start_learn_show() {
//          $('.start-learn').show();
//          $('.start-learn').removeClass("fadeOutUp");
//          $('.start-learn').addClass("animated fadeInDown");
//      }
//      function start_learn_hide() {
//          $('.start-learn').removeClass("fadeInDown");
//          $('.start-learn').addClass("animated fadeOutUp");
//      }
//
//      if ($('body').hasClass('learn-plan-detail')) {
//          if ($(window).scrollTop() > $('.plan-detail-desc')[0].scrollHeight) {
//              start_learn_show();
//          } else {
//              start_learn_hide();
//          }
//      } else if ($('body').hasClass('learn-course-detail')) {
//          if ($(window).scrollTop() > $('.course-detail-desc')[0].scrollHeight) {
//              start_learn_show();
//          } else {
//              start_learn_hide();
//          }
//      }
//  });
//  var resizeTimer = null;
//  $(window).bind("resize", function() {
//        if (resizeTimer) {
//            clearTimeout(resizeTimer)
//        }
//        resizeTimer = setTimeout(function(){
//            if ($('body').hasClass('learn-plan-detail')) {
//                // None
//            }
//        }, 400);
//  })
});

// Minimalize menu when screen is less than 768px
$(function () {
  $(window).bind("load resize", function () {
    if ($(this).width() < 769) {
      $('body').addClass('body-small')
    } else {
      $('body').removeClass('body-small')
    }
  })

});
