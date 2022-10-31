(() => { /* Start of: GSAP animation code */

// Initialize
gsap.registerPlugin(ScrollTrigger)

// Global strings & variables
const mainWrapperSelector = '.main-wrapper',
    headingsSelector = 'h1, h2, h3, h4, h5, h6'
    splitTextSelector = headingsSelector + ', p, [text = "1"]',
    noSplitTextSelector = '[text = "0"], .cta_wrapper, .wwa_tag_wrapper',
    allTextSelctor = noSplitTextSelector + ', .line',
    dontAnimateSelector = '[bmg-gsap = "0"]',
    freeFloatImageSelector = '[bmg-gsap = "free-float-image"]',
    dynItemSelctor = '.w-dyn-item, [bmg-gsap = "dyn"]',
    bmgSectionSelctor = '[bmg-gsap = "section"]',
    fullScreenImageSelector = '[bmg-gsap = "fullscreen"]'

let isFirstTrigger = []

// # Main functions #

// Navbar
gsap.from( $( '.navbar' ), { alpha:0, y: '-10rem', duration: 2, ease: "power4.out" })

// Prepare texts
new SplitType( $(splitTextSelector).not( noSplitTextSelector ) )
$( headingsSelector ).find( '.line' ).wrap('<div class="line-parent" style="overflow:hidden;"></div>')


// Go through every section and call functions
if ( $( bmgSectionSelctor ).length < 1 )
{
    $( mainWrapperSelector ).children().each(function(index)
    {
        // Glocal elements
        let $section = $(this)
        isFirstTrigger.push(true)

        ScrollTrigger.create({
            trigger: $section[0],
            onEnter: () => { whenSectionInView( index, $section, true ) }
        })
    })
}
else
{
    $( bmgSectionSelctor ).each(function(index)
    {
        // Glocal elements
        let $section = $(this)
        isFirstTrigger.push(true)

        ScrollTrigger.create({
            trigger: $section[0],
            onEnter: () => { whenSectionInView( index, $section, false ) }
        })
    })
}


// # Helper functions #

// When section appears in view
function whenSectionInView( i, $section, navbarExists ) 
{
    if ( navbarExists && i == 0 ) // Not the navbar
    {
        return
    }
    
    if ( isFirstTrigger[i] )
    {
        isFirstTrigger[i] = false // Ensure correct function calling

        // Local variables & elements
        let tl = gsap.timeline()
        let $texts = $section.find( allTextSelctor ).not( dontAnimateSelector )
        let $freeFloatingImages = $section.find( freeFloatImageSelector )
        let $dynItems = $section.find( dynItemSelctor )
        let $fullScreenImages = $section.find( fullScreenImageSelector )

        // Free floating images
        $freeFloatingImages.each(function(index) 
        {
            gsap.from( $(this)[0],
            {
                x: $(this).attr( 'translateX' ),
                y: $(this).attr( 'translateY' ),
                alpha: 0,
                delay: .25,
                scale: 0.25,
                duration: 3, 
                ease: "power4.out" 
            })
        })
        
        // Fullscreen images
        $fullScreenImages.each(function(index) 
        {
            tl.from( $(this)[0],
            {
                alpha: 0,
                y: '25vh',
                scale: 0.85,
                duration: 1, 
                ease: "power4.out" 
            })
        })

        // Text animation
        $texts.each(function(index)
        {
            let tlPosition = ( index > 0 ) ? '-=80%' : '+=0%'
            tl.from( $(this)[0],
            {
                y: '100%', 
                alpha: 0, 
                duration: .65, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Dynamic items
        $dynItems.each(function(index) 
        {
            let tlPosition = '-=80%'
            tl.from( $(this)[0],
            {
                alpha: 0,
                scale: 0.25,
                duration: 1, 
                ease: "power4.out" 
            }, tlPosition )
        })
    }
}
    
})() /* End of: GSAP animation code */
