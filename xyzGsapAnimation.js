(() => { /* Start of: GSAP animation code */

// Global strings & variables
const mainWrapperSelector = '.main-wrapper',
    sectionSelctor = '[bmg-gsap = "section"]',
    fullScreenImageSelector = '[bmg-gsap = "fullscreen"]',
    freeFloatImageSelector = '[bmg-gsap = "free-float-image"]',
    dynItemSelctor = '.w-dyn-item, [bmg-gsap = "dyn"]',
    numberSelector = '[bmg-gsap = "number"]',
    headingsSelector = 'h1, h2, h3, h4, h5, h6, [bmg-gsap = "is-heading"]',
    splitTextSelector = headingsSelector + ', p, [text = "1"]',
    noSplitTextSelector = '[text = "0"], [bmg-gsap = "text-0"], .cta_wrapper, .wwa_tag_wrapper',
    allTextSelctor = noSplitTextSelector + ', .line',
    doNotAnimateSelector = '[bmg-gsap = "0"]'

// Initialize
gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

let smoother = ScrollSmoother.create({
    content: mainWrapperSelector,
    smooth: 2,   // seconds it takes to "catch up" to native scroll position
    effects: false // look for data-speed and data-lag attributes on elements and animate accordingly
})

// Line split
new SplitType( $(splitTextSelector).not( noSplitTextSelector ) )
$( headingsSelector ).find( '.line' ).wrap('<div class="line-parent" style="overflow:hidden;"></div>')
    

// # Main functions #

// Navbar
gsap.from( $( '.navbar' ), { alpha:0, y: '-1rem', duration: 2.5, ease: "power4.out" })

// Go through every section and call functions
let isFirstTrigger = [],
    nOfSections = $( mainWrapperSelector ).children().length

if ( $( sectionSelctor ).length < 1 )
{
    $( mainWrapperSelector ).children().each(function(index)
    {
        // Glocal elements
        let $section = $(this)
        isFirstTrigger.push(true)

        prepareElments( $section )

        ScrollTrigger.create({
            trigger: $section[0],
            start: 'top 80%',
            onEnter: () => { whenSectionInView( index, $section, true, nOfSections ) }
        })
    })
}
else
{
    $( sectionSelctor ).each(function(index)
    {
        // Glocal elements
        let $section = $(this)
        isFirstTrigger.push(true)

        prepareElments( $section )

        ScrollTrigger.create({
            trigger: $section[0],
            start: 'top 80%',
            onEnter: () => { whenSectionInView( index, $section, false, NaN ) }
        })
    })
}


// # Helper functions #

// When section appears in view
function whenSectionInView( i, $section, navbarExists, nOfSections )
{
    if ( navbarExists && (i == 0 || i == nOfSections ) ) // Not the navbar, Not the footer
    {
        return
    }
    
    if ( isFirstTrigger[i] )
    {
        isFirstTrigger[i] = false // Ensure correct function calling

        // Local variables & elements
        let tl = gsap.timeline(),
            $headings = $section.find( headingsSelector ).not( doNotAnimateSelector ).not( noSplitTextSelector ).find( '.line' ),
            $texts = $section.find( allTextSelctor ).not( doNotAnimateSelector ).not( $headings ),
            $freeFloatingImages = $section.find( freeFloatImageSelector ),
            $dynItems = $section.find( dynItemSelctor ),
            $fullScreenImages = $section.find( fullScreenImageSelector )

        // Free floating images 
        $freeFloatingImages.each(function(index) 
        {
            gsap.to( $(this)[0],
            {
                x: 0,
                y: 0,
                alpha: 100,
                scale: 1,
                delay: .25,
                duration: 3, 
                ease: "power4.out" 
            })
        })

        // Fullscreen images
        $fullScreenImages.each(function(index) 
        {
            tl.to( $(this)[0],
            {
                alpha: 100,
                y: '0vh',
                scale: 1,
                duration: 1, 
                ease: "power4.out" 
            })
        })

        // Headings
        $headings.each(function(index)
        {
            let tlPosition = ( index > 0 ) ? '<+=20%' : '+=0'
            tl.to( $(this)[0],
            {
                y: '0%',
                duration: 0.65, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Texts
        $texts.each(function(index)
        {
            let tlPosition = ( index > 0 ) ? '<+=20%' : '+=0'
            tl.to( $(this)[0],
            {
                y: '0%', 
                alpha: 100, 
                duration: 0.85, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Dynamic items
        $dynItems.each(function(index) 
        {
            let tlPosition = '<+=20%'
            tl.to( $(this)[0],
            {
                alpha: 100,
                scale: 1,
                duration: 1, 
                ease: "power4.out" 
            }, tlPosition )
        })

        // Numbers
        $section.find( numberSelector ).each(function(index) 
        {
            let $this = $(this),
                n = parseFloat( $this.attr( 'bmg-gsap-amount' ) ),
                target = { val: 0 },
                tlPosition = '<+=7.5%'
    
            tl.to(target, { duration: 3, ease: "power4.out", val: n, onUpdate: function()
            {
                $this.text( target.val.toFixed(0) )
            }}, tlPosition)
        })
    }
}

// # Prepare elements #
function prepareElments( $element )
{
    // Gsap.set()
    let $headings = $element.find( headingsSelector ).not( doNotAnimateSelector ).not( noSplitTextSelector ).find( '.line' ),
        $texts = $element.find( allTextSelctor ).not( doNotAnimateSelector ).not( $headings ),
        $freeFloatingImages = $element.find( freeFloatImageSelector ),
        $dynItems = $element.find( dynItemSelctor ),
        $fullScreenImages = $element.find( fullScreenImageSelector )

    $headings.each(function() { gsap.set( $(this)[0], {y: '100%'} ) }) // Headings
    
    $texts.each(function() { gsap.set( $(this)[0], {y: '100%', alpha: 0} ) }) // Texts & buttons
    
    $freeFloatingImages.each(function() { gsap.set( $(this)[0], // Free floating images
    {
        x: $(this).attr( 'translateX' ),
        y: $(this).attr( 'translateY' ),
        alpha: 0,
        scale: 0.25
    }) })
    
    $fullScreenImages.each(function() { gsap.set( $(this)[0], {alpha: 0, y: '25vh', scale: 0.85} ) }) // Fullscreen images
    
    $dynItems.each(function() { gsap.set( $(this)[0], {alpha: 0, scale: 0.5} ) }) // Dynamic items

    // Numbers
    $element.find( numberSelector ).each(function()
    {
        $(this).attr( 'bmg-gsap-amount', $(this).text() )
        $(this).text( '0' )
    })
}
    
})() /* End of: GSAP animation code */
