let resizetimer = 0;

const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()

        const blockID = anchor.getAttribute('href').substr(1)

        const yOffset = -1 * ($('header').height() + $('.topline').height());
        const element = document.getElementById(blockID)
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({top: y, behavior: 'smooth'});
    })
}

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
        return
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
        }
        else {
            $mobileMenu.css({'height': 0});
            $burger.removeClass('open');
            setTimeout(() => {
                $mobileMenu.css({'opacity': 0}).removeClass('process');
            }, 500)
        }

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
