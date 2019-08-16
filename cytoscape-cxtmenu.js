(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["cytoscapeCxtmenu"] = factory();
	else
		root["cytoscapeCxtmenu"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const defaults = __webpack_require__(2);
const assign = __webpack_require__(1);
const { removeEles, setStyles, createElement, getPixelRatio, getOffset } = __webpack_require__(3);

let cxtmenu = function (params) {
    let options = assign({}, defaults, params);
    let cy = this;
    let container = cy.container();
    let target;

    let data = {
        options: options,
        handlers: [],
        container: createElement({ class: 'cxtmenu' })
    };

    let wrapper = data.container;
    let parent = createElement();
    let canvas = createElement({ tag: 'canvas' });
    let commands = [];
    let submenu_commands = [];
    let c2d = canvas.getContext('2d');
    let r = options.menuRadius;
    let containerSize = (r + options.activePadding) * 2 + 2 * r;
    let activeCommandI;
    let activeSubCommandI;
    let offset;

    container.insertBefore(wrapper, container.firstChild);
    wrapper.appendChild(parent);
    parent.appendChild(canvas);

    setStyles(wrapper, {
        position: 'absolute',
        marginLeft: -containerSize / 4 + 'px',
        marginTop: -containerSize / 4 + 'px',
        zIndex: options.zIndex,
        userSelect: 'none',
        pointerEvents: 'none' // prevent events on menu in modern browsers
    });

    // prevent events on menu in legacy browsers
    ['mousedown', 'mousemove', 'mouseup', 'contextmenu'].forEach(evt => {
        wrapper.addEventListener(evt, e => {
            e.preventDefault();
            return false;
        });
    });

    setStyles(parent, {
        display: 'none',
        width: containerSize + 'px',
        height: containerSize + 'px',
        position: 'absolute',
        zIndex: 1,
        marginLeft: -options.activePadding + 'px',
        marginTop: -options.activePadding + 'px',
        userSelect: 'none'
    });

    canvas.width = containerSize;
    canvas.height = containerSize;

    function createMenuItems() {
        removeEles('.cxtmenu-item', parent);
        let dtheta = 2 * Math.PI / commands.length;
        let theta1 = Math.PI / 2;
        let theta2 = theta1 + dtheta;

        for (let command of commands) {
            let midtheta = (theta1 + theta2) / 2;
            let rx1 = 0.66 * r * Math.cos(midtheta);
            let ry1 = 0.66 * r * Math.sin(midtheta);

            let item = createElement({ class: 'cxtmenu-item' });
            setStyles(item, {
                color: options.itemColor,
                cursor: 'default',
                display: 'table',
                'text-align': 'center',
                //background: 'red',
                position: 'absolute',
                'text-shadow': '-1px -1px 2px ' + options.itemTextShadowColor + ', 1px -1px 2px ' + options.itemTextShadowColor + ', -1px 1px 2px ' + options.itemTextShadowColor + ', 1px 1px 1px ' + options.itemTextShadowColor,
                left: '50%',
                top: '50%',
                'min-height': r * 0.66 + 'px',
                width: r * 0.66 + 'px',
                height: r * 0.66 + 'px',
                marginLeft: rx1 - r * 0.33 + 'px',
                marginTop: -ry1 - r * 0.33 + 'px'
            });

            let content = createElement({ class: 'cxtmenu-content' });
            console.log(command.content);
            if (command.content instanceof HTMLElement) content.appendChild(command.content);else if (typeof command.content === 'function') content.innerHTML = command.content();else content.innerHTML = command.content;

            setStyles(content, {
                'width': r * 0.66 + 'px',
                'height': r * 0.66 + 'px',
                'vertical-align': 'middle',
                'display': 'table-cell'
            });

            setStyles(content, command.contentStyle || {});

            if (command.disabled === true || command.enabled === false) content.setAttribute('class', 'cxtmenu-content cxtmenu-disabled');

            parent.appendChild(item);
            item.appendChild(content);
            theta1 += dtheta;
            theta2 += dtheta;
        }
    }

    function createSubMenuItems() {
        let dtheta = 2 * Math.PI / commands.length;
        let theta1 = Math.PI / 2;
        let theta2 = theta1 + dtheta;
        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            if (command.submenu) {
                let ddtheta = dtheta / command.submenu.length;
                theta2 = theta1 + ddtheta;
                for (let j = 0; j < command.submenu.length; j++) {
                    let midtheta = (theta1 + theta2) / 2;
                    let rx1 = 1.4 * r * Math.cos(midtheta);
                    let ry1 = 1.4 * r * Math.sin(midtheta);
                    let item = createElement({ class: 'cxtmenu-item' });
                    setStyles(item, {
                        color: options.itemColor,
                        cursor: 'default',
                        display: 'table',
                        'text-align': 'center',
                        //background: 'red',
                        position: 'absolute',
                        'text-shadow': `-1px -1px 2px ${options.itemTextShadowColor}, 1px -1px 2px ${options.itemTextShadowColor}, -1px 1px 2px ${options.itemTextShadowColor}, 1px 1px 1px ${options.itemTextShadowColor}`,
                        left: '50%',
                        top: '50%',
                        'min-height': r * 0.66 + 'px',
                        width: r * 0.66 + 'px',
                        height: r * 0.66 + 'px',
                        marginLeft: rx1 - r * 0.33 + 'px',
                        marginTop: -ry1 - r * 0.33 + 'px'
                    });
                    let content = createElement({ class: `cxtmenu-content cxtmenu-submenu-content cxtmenu-${i}-submenu-content` });
                    if (command.content instanceof HTMLElement) content.appendChild(command.submenu[j].content);else if (typeof command.content === 'function') content.innerHTML = command.submenu[j].content();else content.innerHTML = command.submenu[j].content;

                    setStyles(content, {
                        'width': r * 0.66 + 'px',
                        'height': r * 0.66 + 'px',
                        'vertical-align': 'middle',
                        'display': 'none'
                    });
                    setStyles(content, command.contentStyle || {});
                    if (command.disabled === true || command.enabled === false) {
                        content.setAttribute('class', 'cxtmenu-content cxtmenu-disabled');
                    }
                    parent.appendChild(item);
                    item.appendChild(content);
                    theta1 += ddtheta;
                    theta2 += ddtheta;
                }
            }
            theta1 += dtheta;
            theta2 += dtheta;
        }
    }

    function queueDrawBg(rspotlight) {
        redrawQueue.drawBg = [rspotlight];
    }

    function drawBg(rspotlight) {
        rspotlight = rspotlight !== undefined ? rspotlight : rs;
        c2d.globalCompositeOperation = 'source-over';
        c2d.clearRect(0, 0, containerSize, containerSize);
        // draw background items
        c2d.fillStyle = options.fillColor;
        let dtheta = 2 * Math.PI / commands.length;
        let theta1 = Math.PI / 2;
        let theta2 = theta1 + dtheta;

        for (let command of commands) {
            if (command.fillColor) c2d.fillStyle = command.fillColor;
            c2d.beginPath();
            c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
            c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, r, 2 * Math.PI - theta1, 2 * Math.PI - theta2, true);
            c2d.closePath();
            c2d.fill();
            theta1 += dtheta;
            theta2 += dtheta;
            c2d.fillStyle = options.fillColor;
        }

        // draw separators between items
        c2d.globalCompositeOperation = 'destination-out';
        c2d.strokeStyle = 'white';
        c2d.lineWidth = options.separatorWidth;
        theta1 = Math.PI / 2;
        theta2 = theta1 + dtheta;

        for (let i = 0; i < commands.length; i++) {
            let rx1 = r * Math.cos(theta1);
            let ry1 = r * Math.sin(theta1);
            c2d.beginPath();
            c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
            c2d.lineTo(2 * r + options.activePadding + rx1, 2 * r + options.activePadding - ry1);
            c2d.closePath();
            c2d.stroke();
            theta1 += dtheta;
            theta2 += dtheta;
        }

        // draw inner circle
        c2d.fillStyle = 'white';
        c2d.globalCompositeOperation = 'destination-out';
        c2d.beginPath();
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, rspotlight + options.spotlightPadding, 0, Math.PI * 2, true);
        c2d.closePath();
        c2d.fill();
        c2d.globalCompositeOperation = 'source-over';
    }

    function queueDrawCommands(rx, ry, theta) {
        redrawQueue.drawCommands = [rx, ry, theta];
    }

    function drawCommands(rx, ry, theta) {
        let dtheta = 2 * Math.PI / commands.length;
        let theta1 = Math.PI / 2;
        let theta2 = theta1 + dtheta;
        theta1 += dtheta * activeCommandI;
        theta2 += dtheta * activeCommandI;

        c2d.fillStyle = options.activeFillColor;
        c2d.strokeStyle = 'black';
        c2d.lineWidth = 1;
        c2d.beginPath();
        c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, r + options.activePadding, 2 * Math.PI - theta1, 2 * Math.PI - theta2, true);
        c2d.closePath();
        c2d.fill();

        c2d.fillStyle = 'white';
        c2d.globalCompositeOperation = 'destination-out';

        let tx = 2 * r + options.activePadding + rx / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        let ty = 2 * r + options.activePadding + ry / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        let rot = Math.PI / 4 - theta;

        c2d.translate(tx, ty);
        c2d.rotate(rot);

        // clear the indicator
        c2d.beginPath();
        c2d.fillRect(-options.indicatorSize / 2, -options.indicatorSize / 2, options.indicatorSize, options.indicatorSize);
        c2d.closePath();
        c2d.fill();
        c2d.rotate(-rot);
        c2d.translate(-tx, -ty);

        // clear the spotlight
        c2d.beginPath();
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, rs + options.spotlightPadding, 0, Math.PI * 2, true);
        c2d.closePath();
        c2d.fill();
    }

    // 绘制子菜单
    function queueDrawSubmenuBg(rx, ry, theta) {
        redrawQueue.drawSubmenuBg = [rx, ry, theta];
    }

    function drawSubmenuBg(rx, ry, theta) {
        let dtheta = 2 * Math.PI / commands.length;
        let ddtheta = dtheta / submenu_commands.length;
        let theta1, theta2;
        c2d.fillStyle = options.activeFillColor;
        theta1 = Math.PI / 2;
        theta2 = theta1 + dtheta;
        theta1 += dtheta * activeCommandI;
        theta2 += dtheta * activeCommandI;
        c2d.beginPath();
        c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, r, 2 * Math.PI - theta1, 2 * Math.PI - theta2, true);
        c2d.closePath();
        c2d.fill();

        c2d.fillStyle = 'white';
        c2d.globalCompositeOperation = 'destination-out';

        let tx = 2 * r + options.activePadding + rx / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        let ty = 2 * r + options.activePadding + ry / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        let rot = Math.PI / 4 - theta;

        c2d.translate(tx, ty);
        c2d.rotate(rot);

        // clear the indicator
        c2d.beginPath();
        c2d.fillRect(-options.indicatorSize / 2, -options.indicatorSize / 2, options.indicatorSize, options.indicatorSize);
        c2d.closePath();
        c2d.fill();

        c2d.rotate(-rot);
        c2d.translate(-tx, -ty);

        // clear the spotlight
        c2d.beginPath();
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, rs + options.spotlightPadding, 0, Math.PI * 2, true);
        c2d.closePath();
        c2d.fill();

        // draw submenu
        c2d.globalCompositeOperation = 'source-over';
        c2d.strokeStyle = options.fillColor;
        theta1 = Math.PI / 2;
        theta2 = theta1 + ddtheta;
        theta1 += dtheta * activeCommandI;
        theta2 += dtheta * activeCommandI;
        for (let submenu_command of submenu_commands) {
            if (submenu_command.fillColor) c2d.strokeStyle = submenu_command.fillColor;
            c2d.lineWidth = r - options.spotlightPadding;
            c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
            c2d.beginPath();
            c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, r * 1.5, 2 * Math.PI - theta1, 2 * Math.PI - theta2, true);
            c2d.stroke();
            theta1 += ddtheta;
            theta2 += ddtheta;
            c2d.fillStyle = options.fillColor;
        }

        // draw separators between items
        c2d.globalCompositeOperation = 'destination-out';
        c2d.strokeStyle = 'white';
        c2d.lineWidth = options.separatorWidth;
        theta1 = Math.PI / 2;
        theta2 = theta1 + ddtheta;
        theta1 += dtheta * activeCommandI;
        theta2 += dtheta * activeCommandI;
        for (let i = 0; i < submenu_commands.length; i++) {
            let rx1 = r * Math.cos(theta1);
            let ry1 = r * Math.sin(theta1);
            c2d.beginPath();
            c2d.moveTo(2 * r + options.activePadding + rx1, 2 * r + options.activePadding - ry1);
            c2d.lineTo(2 * r + options.activePadding + rx1 * 2, 2 * r + options.activePadding - ry1 * 2);
            c2d.closePath();
            c2d.stroke();
            theta1 += ddtheta;
            theta2 += ddtheta;
        }
    }

    //绘制活动子菜单
    function queueDrawSubmenuCommands() {
        redrawQueue.drawSubmenuCommands = [];
    }

    function drawSubmenuCommands() {
        c2d.globalCompositeOperation = 'source-over';
        let dtheta = 2 * Math.PI / commands.length;
        let ddtheta = dtheta / submenu_commands.length;
        let theta1 = Math.PI / 2;
        let theta2 = theta1 + ddtheta;

        theta1 += dtheta * activeCommandI + ddtheta * activeSubCommandI;
        theta2 += dtheta * activeCommandI + ddtheta * activeSubCommandI;

        c2d.strokeStyle = options.activeFillColor;
        c2d.lineWidth = r - options.spotlightPadding;
        c2d.moveTo(2 * r + options.activePadding, 2 * r + options.activePadding);
        c2d.beginPath();
        c2d.arc(2 * r + options.activePadding, 2 * r + options.activePadding, 1.5 * r + options.activePadding, 2 * Math.PI - theta1, 2 * Math.PI - theta2, true);
        c2d.stroke();
    }

    function updatePixelRatio() {
        let pxr = getPixelRatio();
        let w = containerSize;
        let h = containerSize;

        canvas.width = w * pxr;
        canvas.height = h * pxr;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        c2d.setTransform(1, 0, 0, 1, 0, 0);
        c2d.scale(pxr, pxr);
    }

    let redrawing = true;
    let redrawQueue = {};

    let raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || (fn => setTimeout(fn, 16));

    let redraw = () => {
        if (redrawQueue.drawBg) drawBg.apply(null, redrawQueue.drawBg);

        if (redrawQueue.drawCommands) drawCommands.apply(null, redrawQueue.drawCommands);

        if (redrawQueue.drawSubmenuBg) drawSubmenuBg.apply(null, redrawQueue.drawSubmenuBg);

        if (redrawQueue.drawSubmenuCommands) drawSubmenuCommands.apply(null, redrawQueue.drawSubmenuCommands);

        redrawQueue = {};

        if (redrawing) raf(redraw);
    };

    // kick off
    updatePixelRatio();
    redraw();

    let ctrx, ctry, rs;

    let bindings = {
        on: function (events, selector, fn) {
            let _fn = fn;
            if (selector === 'core') {
                _fn = function (e) {
                    if (e.cyTarget === cy || e.target === cy) // only if event target is directly core
                        return fn.apply(this, [e]);
                };
            }

            data.handlers.push({
                events: events,
                selector: selector,
                fn: _fn
            });

            if (selector === 'core') cy.on(events, _fn);else cy.on(events, selector, _fn);
            return this;
        }
    };

    function addEventListeners() {
        let grabbable;
        let inGesture = false;
        let zoomEnabled;
        let panEnabled;
        let boxEnabled;
        let gestureStartEvent;

        let restoreZoom = () => {
            if (zoomEnabled) cy.userZoomingEnabled(true);
        };

        let restoreGrab = () => {
            if (grabbable) target.grabify();
        };

        let restorePan = () => {
            if (panEnabled) cy.userPanningEnabled(true);
        };

        let restoreBoxSeln = () => {
            if (boxEnabled) cy.boxSelectionEnabled(true);
        };

        let restoreGestures = () => {
            restoreGrab();
            restoreZoom();
            restorePan();
            restoreBoxSeln();
        };

        window.addEventListener('resize', updatePixelRatio);

        bindings.on('resize', () => {
            updatePixelRatio();
        }).on(options.openMenuEvents, options.selector, function (e) {
            target = this; // Remember which node the context menu is for
            let ele = this;
            let isCy = this === cy;

            if (inGesture) {
                parent.style.display = 'none';

                inGesture = false;

                restoreGestures();
            }

            if (typeof options.commands === 'function') {
                const res = options.commands(target);
                if (res.then) {
                    res.then(_commands => {
                        commands = _commands;
                        openMenu();
                    });
                } else {
                    commands = res;
                    openMenu();
                }
            } else {
                commands = options.commands;
                openMenu();
            }

            function openMenu() {
                if (!commands || commands.length === 0) return;

                zoomEnabled = cy.userZoomingEnabled();
                cy.userZoomingEnabled(false);

                panEnabled = cy.userPanningEnabled();
                cy.userPanningEnabled(false);

                boxEnabled = cy.boxSelectionEnabled();
                cy.boxSelectionEnabled(false);

                grabbable = target.grabbable && target.grabbable();
                if (grabbable) target.ungrabify();

                let rp, rw, rh;
                if (!isCy && ele.isNode() && !ele.isParent() && !options.atMouse) {
                    rp = ele.renderedPosition();
                    rw = ele.renderedWidth();
                    rh = ele.renderedHeight();
                } else {
                    rp = e.renderedPosition || e.cyRenderedPosition;
                    rw = 1;
                    rh = 1;
                }

                offset = getOffset(container);
                ctrx = rp.x;
                ctry = rp.y;
                createMenuItems();
                createSubMenuItems();
                setStyles(parent, {
                    display: 'block',
                    left: rp.x - r + 'px',
                    top: rp.y - r + 'px'
                });
                rs = Math.max(rw, rh) / 2;
                rs = Math.max(rs, options.minSpotlightRadius);
                rs = Math.min(rs, options.maxSpotlightRadius);
                queueDrawBg();
                activeCommandI = undefined;
                inGesture = true;
                gestureStartEvent = e;
            }
        }).on('cxtdrag tapdrag', options.selector = e => {
            if (!inGesture) return;

            let origE = e.originalEvent;
            let isTouch = origE.touches && origE.touches.length > 0;
            let pageX = isTouch ? origE.touches[0].pageX : origE.pageX;
            let pageY = isTouch ? origE.touches[0].pageY : origE.pageY;

            activeCommandI = undefined;

            let dx = pageX - offset.left - ctrx;
            let dy = pageY - offset.top - ctry;

            if (dx === 0) dx = 0.01;

            let d = Math.sqrt(dx * dx + dy * dy);
            let cosTheta = (dy * dy - d * d - dx * dx) / (-2 * d * dx);
            let theta = Math.acos(cosTheta);

            let rx = dx * r / d;
            let ry = dy * r / d;

            if (dy > 0) theta = Math.PI + Math.abs(theta - Math.PI);

            let dtheta = 2 * Math.PI / commands.length;
            let theta1 = Math.PI / 2;
            let theta2 = theta1 + dtheta;
            for (let i = 0; i < commands.length; i++) {
                let command = commands[i];
                if (command.submenu) submenu_commands = command.submenu;else submenu_commands = [];

                let inThisCommand = theta1 <= theta && theta <= theta2 || theta1 <= theta + 2 * Math.PI && theta + 2 * Math.PI <= theta2;

                if (command.disabled === true || command.enabled === false) inThisCommand = false;

                if (inThisCommand) {
                    activeCommandI = i;
                    break;
                }
                theta1 += dtheta;
                theta2 += dtheta;
            }
            hideSubmenuContent();

            // Do not draw indicator while mouse in inner circle or out of circle # But if a command has submenu, draw indicator util mouse out of submenu (2*r)
            if (d < rs + options.spotlightPadding || d > options.menuRadius && !commands[activeCommandI].submenu) {
                queueDrawBg();
                cancelActiveCommand();
                return;
            }

            if (d > rs + options.spotlightPadding && d < options.menuRadius) {
                queueDrawBg();
                if (!commands[activeCommandI].submenu) {
                    queueDrawCommands(rx, ry, theta);
                } else {
                    showSubmenuContent(activeCommandI);
                    queueDrawSubmenuBg(rx, ry, theta);
                }
                return;
            }

            if (d < options.menuRadius * 2 && d > options.menuRadius && commands[activeCommandI].submenu) {
                showSubmenuContent(activeCommandI);
                submenu_commands = commands[activeCommandI].submenu;
                queueDrawBg();
                // Judge which submenu used
                let ddtheta = dtheta / submenu_commands.length;
                let theta1 = Math.PI / 2;
                let theta2 = theta1 + ddtheta;
                theta1 += dtheta * activeCommandI;
                theta2 += dtheta * activeCommandI;
                for (let i = 0; i < submenu_commands.length; i++) {
                    let submenu_command = commands[activeCommandI].submenu[i];
                    let inThisSubMenuCommand = theta1 <= theta && theta <= theta2 || theta1 <= theta + 2 * Math.PI && theta + 2 * Math.PI <= theta2;
                    if (submenu_command.disabled === true || submenu_command.enabled === false) inThisSubMenuCommand = false;
                    if (inThisSubMenuCommand) {
                        activeSubCommandI = i;
                        break;
                    }
                    theta1 += ddtheta;
                    theta2 += ddtheta;
                }

                queueDrawSubmenuBg(rx, ry, theta);
                queueDrawSubmenuCommands();
                return;
            }
            cancelActiveCommand();
            queueDrawBg();
        }).on('cxttapend tapend', function () {
            parent.style.display = 'none';
            if (activeCommandI !== undefined) {
                let select = commands[activeCommandI].select;
                if (select) {
                    select.apply(target, [target, gestureStartEvent]);
                    activeCommandI = undefined;
                } else if (commands[activeCommandI].submenu && activeSubCommandI !== undefined) {
                    // Execute submenu select function
                    commands[activeCommandI].submenu[activeSubCommandI].select.apply(target, [target, gestureStartEvent]);
                    activeCommandI = undefined;
                    activeSubCommandI = undefined;
                }
            }
            inGesture = false;
            restoreGestures();
        });
    }

    function cancelActiveCommand() {
        activeCommandI = undefined;
        activeSubCommandI = undefined;
    }

    function hideSubmenuContent() {
        let cxtmenu_submenus = document.getElementsByClassName('cxtmenu-submenu-content');
        for (let cxtmenu_submenu of cxtmenu_submenus) setStyles(cxtmenu_submenu, {
            display: 'none'
        });
    }

    function showSubmenuContent(i) {
        let cxtmenu_submenus = document.getElementsByClassName(`cxtmenu-${i}-submenu-content`);
        for (let cxtmenu_submenu of cxtmenu_submenus) setStyles(cxtmenu_submenu, {
            display: 'table-cell'
        });
    }

    function removeEventListeners() {
        for (let h of data.handlers) {
            if (h.selector === 'core') cy.off(h.events, h.fn);else cy.off(h.events, h.selector, h.fn);
        }
        window.removeEventListener('resize', updatePixelRatio);
    }

    function destroyInstance() {
        redrawing = false;
        removeEventListeners();
        wrapper.remove();
    }

    addEventListeners();

    return {
        destroy: () => destroyInstance()
    };
};

module.exports = cxtmenu;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// Simple, internal Object.assign() polyfill for options objects etc.

module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt, ...srcs) {
  srcs.filter(src => src != null).forEach(src => {
    Object.keys(src).forEach(k => tgt[k] = src[k]);
  });

  return tgt;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

let defaults = {
  menuRadius: 100, // the radius of the circular menu in pixels
  selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
  commands: [// an array of commands to list in the menu or a function that returns the array
    /*
    { // example command
      fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
      content: 'a command name' // html/text content to be displayed in the menu
      contentStyle: {}, // css key:value pairs to set the command's css in js if you want
      select: function(ele){ // a function to execute when the command is selected
        console.log( ele.id() ) // `ele` holds the reference to the active element
      },
      enabled: true // whether the command is selectable
    }
    */
  ], // function( ele ){ return [ /*...*/ ] }, // example function for commands
  fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
  activeFillColor: 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
  activePadding: 0, // additional size in pixels for the active command
  indicatorSize: 24, // the size in pixels of the pointer to the active command
  separatorWidth: 3, // the empty spacing in pixels between successive commands
  spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
  minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
  maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
  openMenuEvents: 'cxttap', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
  itemColor: 'white', // the colour of text in the command's content
  itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
  zIndex: 9999, // the z-index of the ui div
  atMouse: false // draw menu at mouse position
};

module.exports = defaults;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

const removeEles = function (query, ancestor = document) {
  let els = ancestor.querySelectorAll(query);

  for (let i = 0; i < els.length; i++) {
    let el = els[i];

    el.parentNode.removeChild(el);
  }
};

const setStyles = function (el, style) {
  let props = Object.keys(style);

  for (let i = 0, l = props.length; i < l; i++) {
    el.style[props[i]] = style[props[i]];
  }
};

const createElement = function (options) {
  options = options || {};

  let el = document.createElement(options.tag || 'div');

  el.className = options.class || '';

  if (options.style) {
    setStyles(el, options.style);
  }

  return el;
};

const getPixelRatio = function () {
  return window.devicePixelRatio || 1;
};

const getOffset = function (el) {
  let offset = el.getBoundingClientRect();

  return {
    left: offset.left + document.body.scrollLeft + parseFloat(getComputedStyle(document.body)['padding-left']) + parseFloat(getComputedStyle(document.body)['border-left-width']),
    top: offset.top + document.body.scrollTop + parseFloat(getComputedStyle(document.body)['padding-top']) + parseFloat(getComputedStyle(document.body)['border-top-width'])
  };
};

module.exports = { removeEles, setStyles, createElement, getPixelRatio, getOffset };

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const cxtmenu = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
let register = function (cytoscape) {
  if (!cytoscape) {
    return;
  } // can't register if cytoscape unspecified

  cytoscape('core', 'cxtmenu', cxtmenu); // register with cytoscape.js
};

if (typeof cytoscape !== 'undefined') {
  // expose to global cytoscape (i.e. window.cytoscape)
  register(cytoscape);
}

module.exports = register;

/***/ })
/******/ ]);
});