// <!-- Smooth scroller code -->
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// create the smooth scroller FIRST!
let smoother = ScrollSmoother.create({
    content: ".main-wrapper",
    smooth: 1,   // seconds it takes to "catch up" to native scroll position
    effects: true // look for data-speed and data-lag attributes on elements and animate accordingly
});
