(() => { /* Start of: BMG custom slider code */

// # Global strings #
const monthSelector = '[bmg-custom-list = "month"]',
    categorySelector = '[bmg-custom-list = "category"]',
    listWrapperSelector = '.w-dyn-list',
    listSelctor = '.w-dyn-items',
    dynItemSelctor = '.w-dyn-item',
    tabsMenuSelctor = '.journey_tabs-menu',
    tabSelctor = '.journey_tab-link',
    currentTabClass = 'is--current',
    lastTabClass = 'is--last',
    nextCurrentTabClass = '.is--next-current',
    tabMonthTextSelector = '.text-size-large',
    numberOfEventsTextSelector = '[fs-countitems-element = "value"]',
    prevButtonSelector = '[bmg-custom-list = "prev"]',
    nextButtonSelector = '[bmg-custom-list = "next"]',
    nextSlideTextSelector = '[bmg-custom-list = "next-slide"]',
    eventsCounterTextWrapperSelector = '.journey_tab-upper',
    journeyTabCurrentTextParentSelector = '[bmg-custom-list = "journeyTabCurrentParent"]'


// # Main functions #
$(listWrapperSelector).each(function()
{
    // - Glocal elements -
    let $list = $(this).find(listSelctor),
        $tabsMenu = $(this).parent().find(tabsMenuSelctor)
        $tabs = $tabsMenu.find(tabSelctor),
        $prevButton = $(this).parent().find(prevButtonSelector),
        $nextButton = $(this).parent().find(nextButtonSelector),
        $nextSlideText = $(this).parent().find(nextSlideTextSelector)

    // - Glocal functions & variables -
    let windowWidth,
        nOfItems,
        showItemN,
        monthsObject = createMonthsObject( $tabs ),
        previousCurrentMonth = 0,
        tabWidth,
        tabMaxWidth

    // Calc values
    function calcVals()
    {
        windowWidth = $( window ).width()
        nOfItems = $list.find(dynItemSelctor).length
        tabWidth = $tabs.width()
        tabMaxWidth = $tabsMenu[0].scrollWidth - windowWidth
    }
    $( window ).resize( calcVals )
    $list.click(() => { calcVals(); thisSlideIsVisible() })

    // Initialize
    calcVals()
    thisSlideIsVisible()
    
    // On scroll
    $list.scroll(function()
    {
        if ( $list.scrollLeft() % windowWidth == 0 )
        {
            thisSlideIsVisible()
        }
    })

    // Buttons
    $prevButton.click(() => { buttonClick(-1) })
    $nextButton.click(() => { buttonClick(1) })

    function buttonClick(i)
    {
        showItemN += i
        let n = ( Math.min( Math.max( showItemN, 0 ), nOfItems-1 ) ) * windowWidth
            
        scrollListToLeft( $list, n )
    }

    // This slide is visible. Do xyz
    function thisSlideIsVisible()
    {
        // Update glocal value
        showItemN = $list.scrollLeft() / windowWidth
        
        // Local elements & variables
        let $dynItems = $list.find(dynItemSelctor),
            $thisDynItem = $dynItems.eq( showItemN ),
            thisMonthText = $thisDynItem.find(monthSelector).text()
            $nextDynItem = $thisDynItem.next(),
            nextCategoryText = $nextDynItem.find(categorySelector).text(),
            newSlideNextText = `${ showItemN+2 }/${ nOfItems } - ${ nextCategoryText }`
        
        // - Local functions -

        // Next slide text
        $nextSlideText.text( newSlideNextText )

        // Animate buttons & slide text parent
        if ( nOfItems <= 1 )
        {
            gsap.set( $nextSlideText.parent()[0], { opacity: 0 } )
            gsap.to( $nextButton[0], { opacity: 0, pointerEvents: 'none', duration: .35 } )
            gsap.to( $prevButton[0], { opacity: 0, pointerEvents: 'auto', duration: .35 } )
        }
        else if ( showItemN+1 >= nOfItems )
        {
            gsap.set( $nextSlideText.parent()[0], { opacity: 0 } )
            gsap.to( $nextButton[0], { opacity: 0, pointerEvents: 'none', duration: .35 } )
            gsap.to( $prevButton[0], { opacity: 1, pointerEvents: 'auto', duration: .35 } )
        }
        else if ( showItemN > 0 )
        {
            gsap.to( $nextSlideText.parent()[0], { opacity: 1, duration: .35 } )
            gsap.to( $nextButton[0], { opacity: 1, pointerEvents: 'auto', duration: .35 } )
            gsap.to( $prevButton[0], { opacity: 1, pointerEvents: 'auto', duration: .35 } )
        }
        else
        {
            gsap.to( $nextSlideText.parent()[0], { opacity: 1, duration: .35 } )
            gsap.to( $nextButton[0], { opacity: 1, pointerEvents: 'auto', duration: .35 } )
            gsap.to( $prevButton[0], { opacity: 0, pointerEvents: 'none', duration: .35 } )
        }

        // Animate months
        for ( i = 0, n = monthsObject.length; i < n; i++ )
        {
            if ( monthsObject[i].name == thisMonthText || thisMonthText == '' )
            {
                // Other months
                let $texts = $tabs.find( journeyTabCurrentTextParentSelector )
                
                $texts.each(function(index)
                {
                    if ( index != i )
                    {
                        let $thisTab = $(this).closest(tabSelctor),
                            $thisEventsCounterTextWrapper = $thisTab.find(eventsCounterTextWrapperSelector)

                        $thisTab.css({ 'border-left-width': '1px' })

                        if ( !$thisTab.hasClass(lastTabClass) )
                        {
                            $thisTab.css({ 'border-right-width': '0px' })
                        }

                        gsap.to( $(this)[0], { height: 0, duration: .35 } )
                        gsap.to( $thisEventsCounterTextWrapper[0], { opacity: 1, duration: .35 } )
                        gsap.to( $thisTab[0], { borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.2)', duration: .35 } )
                    }
                })

                // Previous target month
                let $previousTargetTab = $texts.closest(tabSelctor).eq( previousCurrentMonth )

                $previousTargetTab.css({ 'border-left-width': '1px', 'border-right-width': '1px' })
                $previousTargetTab.next().css({ 'border-left-width': '0px' })
                $previousTargetTab.removeClass( currentTabClass )

                previousCurrentMonth = i // Set new previous target
                
                // Target month
                let $target = monthsObject[i].$.find( journeyTabCurrentTextParentSelector ),
                    $targetTab = $target.closest(tabSelctor),
                    $targetEventsCounterTextWrapper = $targetTab.find(eventsCounterTextWrapperSelector)

                $targetTab.addClass( currentTabClass )

                $targetTab.prev().css({ 'border-right-width': '0px' })
                $targetTab.css({ 'border-left-width': '1px', 'border-right-width': '1px' })
                $targetTab.next().css({ 'border-left-width': '0px' })
                
                gsap.to( $target[0], { height: 'auto', duration: .35 } )
                gsap.to( $targetEventsCounterTextWrapper[0], { opacity: 0, duration: .35 } )
                gsap.to( $targetTab[0], { borderTopWidth: 3, borderTopColor: '#fff', duration: .35 } )

                // Call scrollToThisTab function
                scrollToThisTab( i, false )

                // Break to prefend multiple firing when month is not defined
                break
            }
        }
    }

    // Months tabs get clicked
    $tabs.each(function(index){ $(this).click(() => { scrollToThisTab( index, true ) }) })

    function scrollToThisTab( i, clicked )
    {
        // Local elements
        eventCount = parseInt( $tabs.eq(i).find(numberOfEventsTextSelector).text() )

        // - Local functions -
        
        // Scroll tab menu bar
        $tabsMenu.stop().animate( { scrollLeft: Math.min( tabWidth * i, tabMaxWidth ) }, 700 )

        // When evenCount > 0 && clicked true 
        if ( clicked && eventCount )
        {
            let $dynItems = $list.find(dynItemSelctor),
                month = monthsObject[i].name,
                n = 0

            $dynItems.each(function(index)
            {
                let text = ( $(this).find(monthSelector).text() == '' ) ? monthsObject[0].name : $(this).find(monthSelector).text()
                
                if ( text == month )
                {
                    n = index
                    return false
                }
            })

            scrollListToLeft( $list, n * windowWidth  )
        }
    }
})


// # Helper functions #

function scrollListToLeft( $list, n )
{
    $list.css("scroll-snap-type", "none")
    $list.stop().animate( { scrollLeft: n }, 700, () => $list.css("scroll-snap-type", "x mandatory") )
}

// Create months object
function createMonthsObject( $tabs )
{
    let months = []
    
    $tabs.each(function(index)
    {
        months.push(
        {
            '$': $(this),
            'name': $(this).find(tabMonthTextSelector).text()
        })
    })

    return months
}

})() /* Start of: BMG custom slider code */
