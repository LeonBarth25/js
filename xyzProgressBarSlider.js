(() => { /* Start of: bmg-custom-progress-slider code */

// Global strings
const sliderAttribute = 'bmg-custom-progress-slider',
    maskSelctor = '.w-slider-mask',
    leftSelctor = '.w-slider-arrow-left',
    rightSelctor = '.w-slider-arrow-right',
    progressBarSelector = '.home_big-slider_progress-bar'


// Main function
$(`[${ sliderAttribute }]`).each(function()
{
    // Local varaibles & elements
    let $slider = $(this),
        $left = $slider.find(leftSelctor),
        $right = $slider.find(rightSelctor),
        progressBars = $slider[0].querySelectorAll(progressBarSelector),
        animationTime = parseInt( $slider.attr( sliderAttribute ) ),
        repeatDelayTime = parseInt( $slider.attr( 'bmg-gsap-repeat-delay' ) ) || 500

    // - Local functions -

    // Click arrows
    $left.add( $right ).click(() => 
    {
        tl.pause()
        gsap.set(progressBars, { width: '0%' })
        setTimeout( () => { tl.restart() }, repeatDelayTime )
    })

    // Animation
    let tl = gsap.timeline(
    {
        repeat: -1,
        repeatDelay: repeatDelayTime / 1000
    })
    
    tl.fromTo(progressBars, 
    {
        width: '0%'
    },
    {
        width: '100%',
        duration: animationTime / 1000,
        ease: 'linear'
    })

    tl.call( clickNext )

    function clickNext()
    {
        gsap.set(progressBars, { width: '0%' })
        $right.click()
    }

    // Trigger
    ScrollTrigger.create(
    {
        trigger: $slider[0],
        onEnter: () => { startAnimation() },
        onEnterBack: () => { startAnimation() },
        onLeave: () => { stopAnimation() },
        onLeaveBack: () => { stopAnimation() }
    })

    $slider.hover( stopAnimation, startAnimation )

    // Controller functions
    function startAnimation()
    {
        tl.play()
    }

    function stopAnimation()
    {
        tl.pause()
    }
})

})() /* End of: bmg-custom-progress-slider code */
