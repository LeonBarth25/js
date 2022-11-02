(() => { /* Start of: BMG custom list code */

// # Global strings #
const monthSelector = '[bmg-custom-list = "month"]',
    categorySelector = '[bmg-custom-list = "category"]',
    listWrapperSelector = '.w-dyn-list',
    listSelctor = '.w-dyn-items',
    dynItemSelctor = '.w-dyn-item',
    tabsMenuSelctor = '.journey_tabs-menu',
    tabSelctor = '.journey_tab-link',
    currentTabClass = '.is--current',
    tabMonthTextSelector = '.text-size-large',
    numberOfEventsTextSelector = '[fs-countitems-element = "value"]'


// # Main functions #
$(listWrapperSelector).each(function()
{
    // - Glocal elements -
    let $listWrapper = $(this)
        $list = $listWrapper.find(listSelctor),
        $prevButton = $listWrapper.parent().find(prevButtonSelector),
        $nextButton = $listWrapper.parent().find(nextButtonSelector),
        $tabsMenu = $listWrapper.parent().find(tabsMenuSelctor)

    // - Glocal functions & variables -

    // Create js object
    let jsDynItems = createJsDynItems( $listWrapper.find(dynItemSelctor), $tabsMenu )

    // Sort all items by month
    displayDynItemsSortedBy( $list, jsDynItems, 'month', $tabsMenu )
})


// # Helper functions #

// Count number of events & display them
function countEvents( $tabsMenu, $list )
{
    let months = createMonthsObject( $tabsMenu )

    $list.find(dynItemSelctor).each(function()
    {
        let month = $(this).find( monthSelector ).text()

        for ( i = 0, n = months.length; i < n; i++ )
        {
            if ( months[i].name == month )
            {
                months[i].eventCount ++
            }
        }
    })

    for ( i = 0, n = months.length; i < n; i++ )
    {
        let $eventCounter = months[i].$eventCounter,
            target = { val: parseInt( $eventCounter.text() ) }

        gsap.to(target, { duration: 1, ease: "power4.out", val: months[i].eventCount, onUpdate: function()
        {
            $eventCounter.text( target.val.toFixed(0) )
        }} )
    }
}

// When category clicked
function categoryButtonClick( $list, jsDynItems, type, $tabsMenu )
{
    $list.find(dynItemSelctor).each(function()
    {
        let $category = $(this).find(categorySelector),
            categoryText = $category.text()

        $category.parent().click(function()
        {
            displayDynItemsSortedBy( $list, jsDynItems, categoryText, $tabsMenu )
        })

        if ( type != 'month' )
        {
            if ( $category.parent().next().length == 0 )
            {
                $category.parent().parent().append(
                    `<div bmg-custom-list="reset" data-alt="${categoryText} reseter." style="display: inline-block; margin-left: 1.125rem; text-decoration: underline; cursor: pointer">Back to All Events</div>`
                )
            }
            
            let $reset = $category.parent().next()
            
            gsap.to( $category[0], { color: '#172031', duration: .35 } )
            gsap.to( $category.parent()[0], { backgroundColor: '#fff', duration: .35 } )
            gsap.fromTo( $reset[0], { color: 'rgba(255, 255, 255, 0.0)' }, { color: 'rgba(255, 255, 255, 1.0)', duration: .35 } )

            $reset.click(function()
            {
                $list.find( '[bmg-custom-list = "reset"]' ).remove()

                $list.find(categorySelector).each(function()
                {
                    gsap.to( $(this)[0], { color: '#fff', duration: .35 } )
                    gsap.to( $(this).parent()[0], { backgroundColor: 'rgba(255, 255, 255, 0.1)', duration: .35 } )
                })
                
                displayDynItemsSortedBy( $list, jsDynItems, 'month', $tabsMenu )
            })
        }
    })
}

// Display dyn items sorted by month
function displayDynItemsSortedBy( $list, jsDynItems, type, $tabsMenu )
{
    // Delete previous items
    $list.empty()

    for ( i = 0, n = jsDynItems.length; i < n; i++ )
    {
        if ( type == 'month' || jsDynItems[i].category == type )
        {
            $list.append( jsDynItems[i].$ )
        }
    }

    categoryButtonClick( $list, jsDynItems, type, $tabsMenu )

    countEvents( $tabsMenu, $list )
}

// Create months object
function createMonthsObject( $tabsMenu )
{
    let months = []
    
    $tabsMenu.find(tabSelctor).each(function(index)
    {
        months.push(
        {
            '$': $(this),
            'name': $(this).find(tabMonthTextSelector).text(),
            '$eventCounter': $(this).find(numberOfEventsTextSelector),
            'eventCount': 0
        })
    })

    return months
}

// Create js object
function createJsDynItems( $dynItems, $tabsMenu )
{
    // Order of months
    let months = createMonthsObject( $tabsMenu )

    // Dyn items
    let jsDynItems = []

    $dynItems.each(function()
    {
        let month = $(this).find(monthSelector).text()
        
        jsDynItems.push(
        {
            '$': $(this),
            'sortNum': returnDynItemSortNumber( month, months ),
            'month': ( month != '' ) ? month : months[0].name,
            'category': $(this).find(categorySelector).text()
        })
    })

    jsDynItems.sort((a,b) => (a.sortNum > b.sortNum) ? 1 : ((b.sortNum > a.sortNum) ? -1 : 0))
    
    return jsDynItems
}

// Return sort number for dyn items
function returnDynItemSortNumber( month, months )
{
    for ( i = 0, n = months.length; i < n; i++ )
    {
        if ( months[i].name == month )
        {
            return i
        }
    }

    return 0
}   

})() /* Start of: BMG custom list code */
