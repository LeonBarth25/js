/* Start of: BMG - Price notation code */

// Global strings
const wrapperSelector = '[bmg_price-notation = "wrapper"]'
const price1Selector = '[bmg_price-notation = "price-1"]'
const price2Selector = '[bmg_price-notation = "price-2"]'
const placeholder1Selector = '[bmg_price-notation = "placeholder-1"]'
const placeholder2Selector = '[bmg_price-notation = "placeholder-2"]'

// Main function
$(wrapperSelector).each(function()
{
    // Local elements & variables
    let price1 = $(this).find(price1Selector).text()
    let price2 = $(this).find(price2Selector).text()
    let $placeholder1 = $(this).find(placeholder1Selector)
    let $placeholder2 = $(this).find(placeholder2Selector)

    // Local funtction
    $placeholder1
        .text( 
            $placeholder1
                .text()
                .replace(/x.xx/g, price1)
        )
    $placeholder2
        .text( 
            $placeholder2
                .text()
                .replace(/x.xx/g, price2)
        )
})

/* End of: BMG - Price notation code */
