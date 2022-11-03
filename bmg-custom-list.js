(() => { /* Start of: BMG custom list code */

// # Global strings #
const monthSelector = '[bmg-custom-list = "month"]',
    categorySelector = '[bmg-custom-list = "category"]',
    listWrapperSelector = '.w-dyn-list',
    listSelctor = '.w-dyn-items',
    dynItemSelctor = '.w-dyn-item',
    tabsMenuSelctor = '.journey_tabs-menu',
    tabSelctor = '.journey_tab-link',
    tabMonthTextSelector = '.text-size-large',
    numberOfEventsTextSelector = '[fs-countitems-element = "value"]',
    journeyTabCurrentTextParentSelector = '[bmg-custom-list = "journeyTabCurrentParent"]',
    journeyTabCurrentTextWrapperSelector = '.journey_tab-current',
    journeyTabCurrentTextSelector = '[bmg-custom-list = "journeyTabCurrentText"]'


// # Main functions #
$(listWrapperSelector).each(function()
{
    // - Glocal elements -
    let $listWrapper = $(this)
        $list = $listWrapper.find(listSelctor),
        $tabsMenu = $listWrapper.parent().find(tabsMenuSelctor)

    // - Glocal functions & variables -

    // Prepare current months structure
    prepareCurrentMonthsTabStructure( $tabsMenu.find(tabSelctor) )

    // Create js object
    let jsDynItems = createJsDynItems( $listWrapper.find(dynItemSelctor), $tabsMenu )

    // Sort all items by month
    displayDynItemsSortedBy( $list, jsDynItems, 'month', $tabsMenu )

    // Create current journey tab texts
    createCurrentJourneyTabText( $list, $tabsMenu )
    $list.click(() => { createCurrentJourneyTabText( $list, $tabsMenu ) })
})


// # Helper functions #

// Create current journey tab texts
function createCurrentJourneyTabText( $list, $tabsMenu )
{
    let months = createMonthsObject( $tabsMenu )

    for ( i = 0, n = months.length; i < n; i++ )
    {
        let $currentTabText = months[i].$.find(journeyTabCurrentTextSelector),
            categoriesArray = $currentTabText.text().substring(6).split('$X$X$X'),
            categoriesArrayLength = categoriesArray.length,
            newString = '',
            writeOutUpToXCategories = 2,
            notWrittenCounter = 0

        for ( i2 = 0, n2 = categoriesArrayLength; i2 < n2; i2++ )
        {
            let name = categoriesArray[i2],
                counter = 0

            for ( i3 = 0, n3 = n2; i3 < n3; i3++ )
            {
                if ( categoriesArray[i3] == name )
                {
                    counter++
                    categoriesArray[i3] = ''
                }
            }

            if ( name != '' )
            {
                categoriesArray.push(
                {
                    'name': name,
                    'count': counter
                })
            }
        }

        // New categories array created
        categoriesArray.splice(0, categoriesArrayLength)
        categoriesArrayLength = categoriesArray.length

        for ( i2 = 0, n2 = categoriesArrayLength; i2 < n2; i2++ )
        {
            let count = categoriesArray[i2].count,
                name = categoriesArray[i2].name
            
            if ( i2 < writeOutUpToXCategories )
            {
                if ( count <= 1 )
                {
                    newString += ', ' + name
                }
                else
                {
                    newString += ', (' + count + '×) ' + name
                }
            }
            else
            {
                notWrittenCounter += count
            }
        }

        newString = newString.substring(2) + ( ( notWrittenCounter > 0 ) ? ',<br>+ ' + notWrittenCounter + ' more' : '' )
        $currentTabText.html(newString)
    }
}

// Prepare current months structure
function prepareCurrentMonthsTabStructure( $tabs )
{
    $tabs.find(journeyTabCurrentTextParentSelector).remove()

    $tabs.each(function()
    {
        $(this).prepend(
        `
            <div ${ journeyTabCurrentTextParentSelector.slice(0, -1).substring(1) } style="height: 0px; overflow: hidden;">
                <div class="${ journeyTabCurrentTextWrapperSelector.substring(1) }">
                    <div ${ journeyTabCurrentTextSelector.slice(0, -1).substring(1) } class="text-size-tiny">
                        replace.
                        <br>
                        me.
                    </div>
                </div>
            </div>
        `)
    })
}

// Count number of events & display them
function countEvents( $tabsMenu, $list )
{
    let months = createMonthsObject( $tabsMenu )

    $list.find(dynItemSelctor).each(function()
    {
        let month = $(this).find( monthSelector ).text(),
            category = $(this).find( categorySelector ).text()

        month = ( month != '' ) ? month : months[0].name

        for ( i = 0, n = months.length; i < n; i++ )
        {
            if ( months[i].name == month )
            {
                months[i].eventCount ++
                months[i].eventCategoriesString += '$X$X$X' + category
            }
        }
    })

    for ( i = 0, n = months.length; i < n; i++ )
    {
        let $eventCounter = months[i].$eventCounter,
            target = { val: parseInt( $eventCounter.text() ) },
            categoriesString = months[i].eventCategoriesString,
            $journeyTabCurrentText = months[i].$.find(journeyTabCurrentTextSelector)

        $journeyTabCurrentText.text(categoriesString)

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
            'eventCount': 0,
            'eventCategoriesString': ''
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
