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
    bmgSectionSelctor = '[bmg-gsap = "section"]'

let isFirstTrigger = []

// # Main functions #

// Navbar
gsap.fromTo( $( '.navbar' ), { y: '-10rem', opacity: '0%' }, { y: '0rem', opacity: '100%', duration: 2, ease: "power4.out" })

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
        let textTl = gsap.timeline(),
            imageTl = gsap.timeline()
        let $texts = $section.find( allTextSelctor ).not( dontAnimateSelector )
        let $freeFloatingImages = $section.find( freeFloatImageSelector )
        let dynItems = $section.find( dynItemSelctor )

        // Text animation
        $texts.each(function(index)
        {
            let tlPosition = ( index > 1 ) ? '-=80%' : '+=0%'
            textTl.from( $(this)[0],
            {
                y: '100%', 
                opacity: '0', 
                duration: .65, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Free floating images
        $freeFloatingImages.each(function(index) 
        {
            let tlPosition = ( index > 1 ) ? '-=80%' : '+=.2'
            imageTl.from( $(this)[0],
            {
                x: $(this).attr( 'translateX' ),
                y: $(this).attr( 'translateY' ),
                opacity: '0',
                scale: 0.25,
                duration: 3, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Dynamic items
        dynItems.each(function(index) 
        {
            let tlPosition = ( index > 1 ) ? '-=80%' : '+=0%'
            imageTl.from( $(this)[0],
            {
                opacity: '0',
                scale: 0.25,
                duration: 1, 
                ease: "power4.out" 
            }, tlPosition )
        })
    }
}

})() /* End of: GSAP animation code */
