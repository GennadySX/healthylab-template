let resizetimer = 0;

const headerFixer = (scrollEvent) => {
    const curScroll = $(document).scrollTop();
    const $topline = $('.topline');
    const isTopLine = ($topline.length);
    const $header = $('header');
    if (curScroll > 50) {
        $header.addClass('fixed');
        $('body').addClass('header-fixed');
        if (isTopLine) {
            $topline.addClass('fixed');
            $header.css('top', $topline.prop('offsetHeight'));
        }
        return;
    }
    if (isTopLine) {
        $topline.removeClass('fixed');
        $header.css('top', 0);
    }
    $('body').removeClass('header-fixed');
    $header.removeClass('fixed');
}


const subscribeHeadCorrection = () => {
    const $heads = $('.subscribe-wrap .head');
    $heads.css('height', 'auto');
    let h = 0;
    $heads.each(function () {
        h = ($(this).height() > h) ? $(this).height() : h;
    });
    $heads.each(function () {
        $(this).height(h);
    });
}
const onResize = () => {
    subscribeHeadCorrection();
}


const menuHandler = () => {
    const $burger = $('.js-burger');
    const $mobileMenu = $('.js-mobile-menu');

    $burger.on('click', function () {
        const opened = ($burger.hasClass('open'));

        if (!opened) {
            $mobileMenu.removeClass('process').css({'height': 'auto'});
            const menu_height = $mobileMenu.height();
            $mobileMenu.css('height', '0').addClass('process');
            setTimeout(() => { //задержка, чтобы класс process отработал на transition
                $mobileMenu.css({'opacity': 1, 'height': menu_height});
                $burger.addClass('open');
            }, 30)
        } else {
            $mobileMenu.css({'height': 0});
            $burger.removeClass('open');
            setTimeout(() => {
                $mobileMenu.css({'opacity': 0}).removeClass('process');
            }, 500)
        }

    })

    $('.mobile-menu li, section').on('touchend', () =>  {
        $mobileMenu.css({'height': 0});
        $burger.removeClass('open');
        setTimeout(() => {
            $mobileMenu.css({'opacity': 0}).removeClass('process');
        }, 500)
    })



}


const stepAnimationInit = () => {
    const controller = new ScrollMagic.Controller();

    new ScrollMagic.Scene({
        triggerElement: "#journeyTrack",
        duration: ($(window).width() > 768) ? 600 : 300
    })
        .addTo(controller)
        .on("progress", function (e) {
            let h = e.progress.toFixed(3) * $('#journeyTrack').height();
            $('.journey-timeline .track').height(h-190);
        }).on('end', function (e) {
        $('.journey-timeline .track').height($('#journeyTrack').height());
    });
    new ScrollMagic.Scene({triggerElement: "#journeyTrackIntime", duration: 3000})
        .addTo(controller)
        .on("progress", function (e) {
            let h = e.progress.toFixed(3) * $('#journeyTrackIntime').height();
            $('.intime-therapy-container .track').height(h);
        }).on('end', function (e) {
        $('.intime-therapy-container .track').height($('#journeyTrackIntime').height());
    });
    $('.step-marker').each(function () {
        new ScrollMagic.Scene({triggerElement: this, duration: 600}).setClassToggle(this, "active")
            .addTo(controller);
    })
    $('.mobile-curve').each(function () {
        new ScrollMagic.Scene({triggerElement: this, duration: 900}).setClassToggle(this, "active")
            .addTo(controller);
    })
}

const tarifSelectHandler = () => {
    const formData = {
        tarigType:'',
        tarifLength:'',
        promo:''
    }
    $('.tarif-length-select-control-button-wrap .choose').on('click', function () {
        const $tarifLengthSelectWrap = $(this).parents('.tarif-body').find('.tarif-length-select-wrap');
        //высчитываем высоту для анимации
        $tarifLengthSelectWrap.css('height','auto');
        const h = $tarifLengthSelectWrap.prop('offsetHeight');
        $tarifLengthSelectWrap.css('height',0);


        $tarifLengthSelectWrap.addClass('choosen');
        $tarifLengthSelectWrap.animate({
            'height':h,
        },300);
    });

    //выбор тарифа, переход ко второму шагу
    $('.tarif-length-select-control-button-wrap .continue').on('click',function () {
        //если необходимо, здесь можно менять get параметы и uri страницы
        const $tarifBody = $(this).parents('.tarif-body');
        const $radio = $tarifBody.find('input[type="radio"]:checked');

        $('.step-1').removeClass('active').addClass('completed');
        $('.step-2').addClass('active');

        formData.tarigType = $radio.attr('name');
        formData.tarifLength =  $radio.val();
    });

    $('.continue-pay-block button').on('click',function () {
        $('.step-2').removeClass('active').addClass('completed');
        $('.step-3').addClass('active');
    })



    $('.pay').on('click',function () {
        $('.step-3').removeClass('active');
        $('.steps-wrap').hide();
        $('.step-4').addClass('active');
    });


    //step-3
    $('.card-number').inputmask({ mask: ["4999 9999 9999 9999", "5999 9999 9999 9999", "6999 9999 9999 9999", "3999 999999 99999"], greedy: false, "placeholder": "*","keepStatic": false })
    $('.card-date').inputmask({ mask: [99+'/'+99], "placeholder": "_", });
    $('.card-cvv').inputmask({ mask: [999], "placeholder": "", });
    let current_year = new Date().getFullYear();
}

$(document).ready(function () {
    AOS.init();
    $('body').css('opacity', 1);
    subscribeHeadCorrection();
    menuHandler();
    $(window).on('resize', function () {
        if (resizetimer) clearTimeout(resizetimer);
        resizetimer = setTimeout(() => {
            onResize();
        }, 200)
    })
    stepAnimationInit();
    headerFixer();

    $('.subscribe-wrap button').on('mouseover', function () {
        $(this).parents('.subscribe-wrap ').addClass('hovered');
    }).on('mouseleave', function () {
        $(this).parents('.subscribe-wrap ').removeClass('hovered');
    })

    document.addEventListener('scroll', function (event) {
        headerFixer(event);
    }, true /*Capture event*/);

    $('.modal').on('show.bs.modal', function () { //закрытие модалок при переходе между ними
        if ($('body').hasClass('modal-open')) {
            $('.modal.show').modal('hide');
        }
    });


    tarifSelectHandler();
})

$(document).ready(() => {
    $('.faq-container a').click((e) => {
      e.preventDefault()
    })

    const width = window.innerWidth > 768 ? 70 : 140
    const isMobile = window.innerWidth <= 1005
    $('.btn-block').hover(() => $('.desc-block-col').css({'height': `${width}px`, opacity: 1}), () =>
        $('.choose-block').on('mouseleave', () =>  $('.desc-block-col').css({'height':'0px', opacity: 0})))
    $('.choose-item, .triangle-part').on('mouseover', (e) => byOver(e, 1))
    $('.choose-item, .triangle-part').on('mouseleave',(e) =>  byOver(e))

    function byOver(e, opacityValue = 0 ) {
        let elem = $(e.target)
        if(!elem.attr('data-target')) {
            elem = elem.parent('.choose-item').data('target')
        } else elem = elem.data('target')
        console.log('element is::', elem)
        $(elem).css({ opacity: 1})
         if(!opacityValue) $('#desc-reception-bx, #desc-reception-a').css({ opacity: 0});
    }


   // $('.choose-item').focus((e) =>  isMobile ?? showElemMobile(e) )
    const showElemMobile =  (e) => {
        const elem = $(e.target).data('target')
        if (elem.indexOf('bx') >= 0) {
            $('#desc-reception-a').animate({ opacity: 0}, 0)
        } else  $('#desc-reception-bx').animate({ opacity: 0}, 0)
        $(elem).animate({ opacity: 1}, 250)
        $(".block-second").animate({ "marginTop": 680}, 50)
    }


    

    if (window.innerWidth > 578) {
        $( ".faq-container .collapse" ).each(function( index ) {
            $(this).addClass('show')
        });
    }
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();

        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top-70
        }, 500);
    });


    $('.limitly-link-pill').on('click', () => {
        $('#v-pills-not-discussion-tab').trigger('click')
    })
})
