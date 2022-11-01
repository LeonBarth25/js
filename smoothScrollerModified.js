let gsap,
    _coreInitted,
    _win,
    _doc,
    _docEl,
    _body,
    _root,
    _toArray,
    _clamp,
    ScrollTrigger,
    _mainInstance,
    _expo,
    _getVelocityProp,
    _inputObserver,
    _context,
    _onResizeDelayedCall,
    _windowExists = () => "undefined" != typeof window,
    _getGSAP = () => gsap || (_windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap),
    _bonusValidated = 1,
    _isViewport = (e) => !!~_root.indexOf(e),
    _getTime = Date.now,
    _round = (e) => Math.round(1e5 * e) / 1e5 || 0,
    _autoDistance = (e, r) => {
        let t = e.parentNode || _docEl,
            o = e.getBoundingClientRect(),
            i = t.getBoundingClientRect(),
            s = i.top - o.top,
            l = i.bottom - o.bottom,
            n = (Math.abs(s) > Math.abs(l) ? s : l) / (1 - r),
            a = -n * r,
            c,
            g;
        return n > 0 && ((g = 0.5 == (c = i.height / (_win.innerHeight + i.height)) ? 2 * i.height : 2 * Math.min(i.height, (-n * c) / (2 * c - 1)) * (r || 1)), (a += r ? -g * r : -g / 2), (n += g)), { change: n, offset: a };
    },
    _wrap = (e) => {
        let r = _doc.querySelector(".ScrollSmoother-wrapper");
        return r || ((r = _doc.createElement("div")).classList.add("ScrollSmoother-wrapper"), e.parentNode.insertBefore(r, e), r.appendChild(e)), r;
    };
export class ScrollSmoother {
    constructor(e) {
        _coreInitted || ScrollSmoother.register(gsap) || console.warn("Please gsap.registerPlugin(ScrollSmoother)"), (e = this.vars = e || {}), _mainInstance && _mainInstance.kill(), (_mainInstance = this), _context(this);
        let { smoothTouch: r, onUpdate: t, onStop: o, smooth: i, onFocusIn: s, normalizeScroll: l } = e,
            n,
            a,
            c,
            g,
            d,
            p,
            h,
            $,
            u,
            f,
            m,
            S,
            y,
            T = this,
            v = "undefined" != typeof ResizeObserver && !1 !== e.autoResize && new ResizeObserver(() => ScrollTrigger.isRefreshing || _onResizeDelayedCall.restart(!0)),
            w = e.effectsPrefix || "",
            _ = ScrollTrigger.getScrollFunc(_win),
            b = 1 === ScrollTrigger.isTouch ? (!0 === r ? 0.8 : parseFloat(r) || 0) : 0 === i || !1 === i ? 0 : parseFloat(i) || 0.8,
            x = 0,
            E = 0,
            P = 1,
            A = _getVelocityProp(0),
            R = () => A.update(-x),
            k = { y: 0 },
            C = () => (n.style.overflow = "visible"),
            I,
            z = (e) => {
                e.update();
                let r = e.getTween();
                r && (r.pause(), (r._time = r._dur), (r._tTime = r._tDur)), (I = !1), e.animation.progress(e.progress, !0);
            },
            V = (e, r) => {
                ((e !== x && !f) || r) && (b && ((n.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + e + ", 0, 1)"), (n._gsap.y = e + "px")), (E = e - x), (x = e), ScrollTrigger.isUpdating || ScrollTrigger.update());
            },
            B = function (e) {
                return arguments.length ? (e < 0 && (e = 0), (k.y = -e), (I = !0), f ? (x = -e) : V(-e), ScrollTrigger.isRefreshing ? g.update() : _(e), this) : -x;
            },
            D,
            L = (e) => {
                (a.scrollTop = 0), !(e.target.contains && e.target.contains(a)) && (!s || !1 !== s(this, e)) && (ScrollTrigger.isInViewport(e.target) || e.target === D || this.scrollTo(e.target, !1, "center center"), (D = e.target));
            },
            O = (e, r) => {
                let t, o, i, s;
                d.forEach((r) => {
                    (t = r.pins),
                        (s = r.markers),
                        e.forEach((e) => {
                            r.trigger &&
                                e.trigger &&
                                r !== e &&
                                (e.trigger === r.trigger || e.pinnedContainer === r.trigger || r.trigger.contains(e.trigger)) &&
                                ((i = ((o = e.start) - r.start - r.offset) / r.ratio - (o - r.start)),
                                t.forEach((e) => (i -= e.distance / r.ratio - e.distance)),
                                e.setPositions(o + i, e.end + i),
                                e.markerStart && s.push(gsap.quickSetter([e.markerStart, e.markerEnd], "y", "px")),
                                e.pin && e.end > 0 && ((i = e.end - e.start), t.push({ start: e.start, end: e.end, distance: i, trig: e }), r.setPositions(r.start, r.end + i), r.vars.onRefresh(r)));
                        });
                });
            },
            H = () => {
                C(),
                    requestAnimationFrame(C),
                    d &&
                        (d.forEach((e) => {
                            let r = e.start,
                                t = e.auto ? Math.min(ScrollTrigger.maxScroll(e.scroller), e.end) : r + (e.end - r) / e.ratio,
                                o = (t - e.end) / 2;
                            (r -= o), (t -= o), (e.offset = o || 1e-4), (e.pins.length = 0), e.setPositions(Math.min(r, t), Math.max(r, t)), e.vars.onRefresh(e);
                        }),
                        O(ScrollTrigger.sort())),
                    A.reset();
            },
            U = () => ScrollTrigger.addEventListener("refresh", H),
            G = () => d && d.forEach((e) => e.vars.onRefresh(e)),
            N = () => (d && d.forEach((e) => e.vars.onRefreshInit(e)), G),
            q = (e, r, t, o) => () => {
                let i = "function" == typeof r ? r(t, o) : r;
                return i || 0 === i || (i = o.getAttribute("data-" + w + e) || ("speed" === e ? 1 : 0)), o.setAttribute("data-" + w + e, i), "auto" === i ? i : parseFloat(i);
            },
            M = (e, r, t, o) => {
                let i = q("speed", r, o, e),
                    s = q("lag", t, o, e),
                    l = gsap.getProperty(e, "y"),
                    n = e._gsap,
                    c,
                    g,
                    p,
                    h,
                    $,
                    u,
                    f = () => {
                        (r = i()),
                            (t = s()),
                            (c = parseFloat(r) || 1),
                            ($ = (p = "auto" === r) ? 0 : 0.5),
                            h && h.kill(),
                            (h = t && gsap.to(e, { ease: _expo, overwrite: !1, y: "+=0", duration: t })),
                            g && ((g.ratio = c), (g.autoSpeed = p));
                    },
                    m = () => {
                        (n.y = l + "px"), n.renderTransform(1), f();
                    },
                    S = [],
                    y = [],
                    T = 0,
                    v = (r) => {
                        if (p) {
                            m();
                            let t = _autoDistance(e, _clamp(0, 1, -r.start / (r.end - r.start)));
                            (T = t.change), (u = t.offset);
                        } else (T = (r.end - r.start) * (1 - c)), (u = 0);
                        S.forEach((e) => (T -= e.distance * (1 - c))), r.vars.onUpdate(r), h && h.progress(1);
                    };
                return (
                    f(),
                    (1 !== c || p || h) &&
                        ((g = ScrollTrigger.create({
                            trigger: p ? e.parentNode : e,
                            scroller: a,
                            scrub: !0,
                            refreshPriority: -999,
                            onRefreshInit: m,
                            onRefresh: v,
                            onKill(e) {
                                let r = d.indexOf(e);
                                r >= 0 && d.splice(r, 1), m();
                            },
                            onUpdate(e) {
                                let r = l + T * (e.progress - $),
                                    t = S.length,
                                    o = 0,
                                    i,
                                    s,
                                    a;
                                if (e.offset) {
                                    if (t) {
                                        for (s = -x, a = e.end; t--; ) {
                                            if ((i = S[t]).trig.isActive || (s >= i.start && s <= i.end)) {
                                                h && ((i.trig.progress += i.trig.direction < 0 ? 0.001 : -0.001), i.trig.update(0, 0, 1), h.resetTo("y", parseFloat(n.y), -E, !0), P && h.progress(1));
                                                return;
                                            }
                                            s > i.end && (o += i.distance), (a -= i.distance);
                                        }
                                        r = l + o + T * ((gsap.utils.clamp(e.start, e.end, s) - e.start - o) / (a - e.start) - $);
                                    }
                                    (r = _round(r + u)), y.length && !p && y.forEach((e) => e(r - o)), h ? (h.resetTo("y", r, -E, !0), P && h.progress(1)) : ((n.y = r + "px"), n.renderTransform(1));
                                }
                            },
                        })),
                        v(g),
                        (gsap.core.getCache(g.trigger).stRevert = N),
                        (g.startY = l),
                        (g.pins = S),
                        (g.markers = y),
                        (g.ratio = c),
                        (g.autoSpeed = p),
                        (e.style.willChange = "transform")),
                    g
                );
            };
        function Y() {
            return (c = n.clientHeight), (n.style.overflow = "visible"), (_body.style.height = c + "px"), c - _win.innerHeight;
        }
        U(),
            ScrollTrigger.addEventListener("killAll", U),
            gsap.delayedCall(0.5, () => (P = 0)),
            (this.scrollTop = B),
            (this.scrollTo = (e, r, t) => {
                let o = gsap.utils.clamp(0, ScrollTrigger.maxScroll(_win), isNaN(e) ? this.offset(e, t) : +e);
                r ? (f ? gsap.to(this, { duration: b, scrollTop: o, overwrite: "auto", ease: _expo }) : _(o)) : B(o);
            }),
            (this.offset = (e, r) => {
                let t = (e = _toArray(e)[0]).style.cssText,
                    o = ScrollTrigger.create({ trigger: e, start: r || "top top" }),
                    i;
                return d && O([o], !0), (i = o.start), o.kill(!1), (e.style.cssText = t), (gsap.core.getCache(e).uncache = 1), i;
            }),
            (this.content = function (e) {
                if (arguments.length) {
                    let r = _toArray(e || "#smooth-content")[0] || console.warn("ScrollSmoother needs a valid content element.") || _body.children[0];
                    return (
                        r !== n && ((u = (n = r).getAttribute("style") || ""), v && v.observe(n), gsap.set(n, { overflow: "visible", width: "100%", boxSizing: "border-box", y: "+=0" }), b || gsap.set(n, { clearProps: "transform" })), this
                    );
                }
                return n;
            }),
            (this.wrapper = function (e) {
                return arguments.length
                    ? (($ = (a = _toArray(e || "#smooth-wrapper")[0] || _wrap(n)).getAttribute("style") || ""),
                      Y(),
                      gsap.set(
                          a,
                          b
                              ? { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 }
                              : { overflow: "visible", position: "relative", width: "100%", height: "auto", top: "auto", bottom: "auto", left: "auto", right: "auto" }
                      ),
                      this)
                    : a;
            }),
            (this.effects = (e, r) => {
                if ((d || (d = []), !e)) return d.slice(0);
                (e = _toArray(e)).forEach((e) => {
                    let r = d.length;
                    for (; r--; ) d[r].trigger === e && d[r].kill();
                });
                let { speed: t, lag: o } = (r = r || {}),
                    i = [],
                    s,
                    l;
                for (s = 0; s < e.length; s++) (l = M(e[s], t, o, s)) && i.push(l);
                return d.push(...i), i;
            }),
            (this.sections = (e, r) => {
                if ((p || (p = []), !e)) return p.slice(0);
                let t = _toArray(e).map((e) =>
                    ScrollTrigger.create({
                        trigger: e,
                        start: "top 120%",
                        end: "bottom -20%",
                        onToggle(r) {
                            (e.style.opacity = r.isActive ? "1" : "0"), (e.style.pointerEvents = r.isActive ? "all" : "none");
                        },
                    })
                );
                return r && r.add ? p.push(...t) : (p = t.slice(0)), t;
            }),
            this.content(e.content),
            this.wrapper(e.wrapper),
            (this.render = (e) => V(e || 0 === e ? e : x)),
            (this.getVelocity = () => A.getVelocity(-x)),
            ScrollTrigger.scrollerProxy(a, {
                scrollTop: B,
                scrollHeight: () => Y() && _body.scrollHeight,
                fixedMarkers: !1 !== e.fixedMarkers && !!b,
                content: n,
                getBoundingClientRect: () => ({ top: 0, left: 0, width: _win.innerWidth, height: _win.innerHeight }),
            }),
            ScrollTrigger.defaults({ scroller: a });
        let F = ScrollTrigger.getAll().filter((e) => e.scroller === _win || e.scroller === a);
        F.forEach((e) => e.revert(!0)),
            (g = ScrollTrigger.create({
                animation: gsap.fromTo(
                    k,
                    { y: 0 },
                    {
                        y: () => -Y(),
                        immediateRender: !1,
                        ease: "none",
                        data: "ScrollSmoother",
                        duration: 100,
                        onUpdate: function () {
                            if (this._dur) {
                                let e = I;
                                e && (z(g), (k.y = x)), V(k.y, e), R(), t && !f && t(T);
                            }
                        },
                    }
                ),
                onRefreshInit(e) {
                    if (d) {
                        let r = ScrollTrigger.getAll().filter((e) => !!e.pin);
                        d.forEach((e) => {
                            e.vars.pinnedContainer ||
                                r.forEach((r) => {
                                    if (r.pin.contains(e.trigger)) {
                                        let t = e.vars;
                                        (t.pinnedContainer = r.pin), (e.vars = null), e.init(t, e.animation);
                                    }
                                });
                        });
                    }
                    let t = e.getTween();
                    (y = t && t._end > t._dp._time), (S = x), (k.y = 0), b && ((a.style.pointerEvents = "none"), (a.scrollTop = 0), setTimeout(() => a.style.removeProperty("pointer-events"), 50));
                },
                onRefresh(e) {
                    e.animation.invalidate(), e.setPositions(e.start, Y()), y || z(e), (k.y = -_()), V(k.y), P || e.animation.progress(gsap.utils.clamp(0, 1, -(S / e.end))), y && ((e.progress -= 0.001), e.update());
                },
                id: "ScrollSmoother",
                scroller: _win,
                invalidateOnRefresh: !0,
                start: 0,
                refreshPriority: -9999,
                end: Y,
                onScrubComplete: () => {
                    A.reset(), o && o(this);
                },
                scrub: b || !0,
            })),
            (this.smooth = function (e) {
                return arguments.length && (b = e || 0), arguments.length ? g.scrubDuration(e) : g.getTween() ? g.getTween().duration() : 0;
            }),
            g.getTween() && (g.getTween().vars.ease = e.ease || _expo),
            (this.scrollTrigger = g),
            e.effects && this.effects(!0 === e.effects ? "[data-" + w + "speed], [data-" + w + "lag]" : e.effects, {}),
            e.sections && this.sections(!0 === e.sections ? "[data-section]" : e.sections),
            F.forEach((e) => {
                (e.vars.scroller = a), e.init(e.vars, e.animation);
            }),
            (this.paused = function (e, r) {
                return arguments.length
                    ? (!!f !== e &&
                          (e
                              ? (g.getTween() && g.getTween().pause(),
                                _(-x),
                                A.reset(),
                                (m = ScrollTrigger.normalizeScroll()) && m.disable(),
                                ((f = ScrollTrigger.observe({ preventDefault: !0, type: "wheel,touch,scroll", debounce: !1, allowClicks: !0, onChangeY: () => B(-x) })).nested = _inputObserver(_docEl, "wheel,touch,scroll", !0, !1 !== r)))
                              : (f.nested.kill(), f.kill(), (f = 0), m && m.enable(), (g.progress = (-x - g.start) / (g.end - g.start)), z(g))),
                      this)
                    : !!f;
            }),
            (this.kill = this.revert = () => {
                this.paused(!1), z(g), g.kill();
                let e = (d || []).concat(p || []),
                    r = e.length;
                for (; r--; ) e[r].kill();
                ScrollTrigger.scrollerProxy(a), ScrollTrigger.removeEventListener("killAll", U), ScrollTrigger.removeEventListener("refresh", H), (a.style.cssText = $), (n.style.cssText = u);
                let t = ScrollTrigger.defaults({});
                t && t.scroller === a && ScrollTrigger.defaults({ scroller: _win }),
                    this.normalizer && ScrollTrigger.normalizeScroll(!1),
                    clearInterval(h),
                    (_mainInstance = null),
                    v && v.disconnect(),
                    _body.style.removeProperty("height"),
                    _win.removeEventListener("focusin", L);
            }),
            (this.refresh = (e, r) => g.refresh(e, r)),
            l && (this.normalizer = ScrollTrigger.normalizeScroll(!0 === l ? { debounce: !0, content: !b && n } : l)),
            ScrollTrigger.config(e),
            "overscrollBehavior" in _win.getComputedStyle(_body) && gsap.set([_body, _docEl], { overscrollBehavior: "none" }),
            "scrollBehavior" in _win.getComputedStyle(_body) && gsap.set([_body, _docEl], { scrollBehavior: "auto" }),
            _win.addEventListener("focusin", L),
            (h = setInterval(R, 250)),
            "loading" === _doc.readyState || requestAnimationFrame(() => ScrollTrigger.refresh());
    }
    get progress() {
        return this.scrollTrigger ? this.scrollTrigger.animation._time / 100 : 0;
    }
    static register(e) {
        return (
            !_coreInitted &&
                ((gsap = e || _getGSAP()),
                _windowExists() && window.document && ((_win = window), (_docEl = (_doc = document).documentElement), (_body = _doc.body)),
                gsap &&
                    ((_toArray = gsap.utils.toArray),
                    (_clamp = gsap.utils.clamp),
                    (_expo = gsap.parseEase("expo")),
                    (_context = gsap.core.context || function () {}),
                    (_onResizeDelayedCall = gsap.delayedCall(0.2, () => ScrollTrigger.isRefreshing || (_mainInstance && _mainInstance.refresh())).pause()),
                    (ScrollTrigger = gsap.core.globals().ScrollTrigger),
                    gsap.core.globals("ScrollSmoother", ScrollSmoother),
                    _body &&
                        ScrollTrigger &&
                        ((_root = [_win, _doc, _docEl, _body]),
                        (_getVelocityProp = ScrollTrigger.core._getVelocityProp || NaN),
                        (_inputObserver = ScrollTrigger.core._inputObserver),
                        (ScrollSmoother.refresh = ScrollTrigger.refresh),
                        (_coreInitted = 1)))),
            _coreInitted
        );
    }
}
(ScrollSmoother.version = "3.11.3"),
    (ScrollSmoother.create = (e) => (_mainInstance && e && _mainInstance.content() === _toArray(e.content)[0] ? _mainInstance : new ScrollSmoother(e))),
    (ScrollSmoother.get = () => _mainInstance),
    _getGSAP() && gsap.registerPlugin(ScrollSmoother);
export { ScrollSmoother as default };
