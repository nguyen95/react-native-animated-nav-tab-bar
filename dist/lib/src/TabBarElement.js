// TabBarElement.tsx
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useEffect, useState, useRef } from "react";
import { CommonActions, } from "@react-navigation/native";
import { Animated, BackHandler, I18nManager, Platform, StyleSheet, View, } from "react-native";
import { ScreenContainer } from "react-native-screens";
import ResourceSavingScene from "./ResourceSavingScene";
import { TabElementDisplayOptions } from "./types";
import { BottomTabBarWrapper, Dot, Label, TabButton } from "./UIComponents";
// ─── Fallback defaults for tabBarOptions ─────────────────────
var defaultTabBarOptions = {
    activeTintColor: "black",
    inactiveTintColor: "black",
    activeBackgroundColor: "#FFCF64",
    tabStyle: undefined,
    labelStyle: undefined,
};
export default function TabBarElement(_a) {
    var _b, _c, _d;
    var state = _a.state, navigation = _a.navigation, descriptors = _a.descriptors, appearance = _a.appearance, _e = _a.tabBarOptions, tabBarOptions = _e === void 0 ? {} : _e, _f = _a.lazy, lazy = _f === void 0 ? true : _f;
    // ─── Merge & destructure tabBarOptions ───────────────────────
    var _g = __assign(__assign({}, defaultTabBarOptions), tabBarOptions), activeTintColor = _g.activeTintColor, inactiveTintColor = _g.inactiveTintColor, activeBackgroundColor = _g.activeBackgroundColor, tabStyle = _g.tabStyle, labelStyle = _g.labelStyle;
    // ─── Appearance options ──────────────────────────────────────
    var topPadding = appearance.topPadding, bottomPadding = appearance.bottomPadding, horizontalPadding = appearance.horizontalPadding, tabBarBackground = appearance.tabBarBackground, activeTabBackgrounds = appearance.activeTabBackgrounds, activeColors = appearance.activeColors, floating = appearance.floating, dotCornerRadius = appearance.dotCornerRadius, whenActiveShow = appearance.whenActiveShow, whenInactiveShow = appearance.whenInactiveShow, dotSize = appearance.dotSize, shadow = appearance.shadow, tabButtonLayout = appearance.tabButtonLayout;
    // ─── Layout & animation state ────────────────────────────────
    var _h = useState(horizontalPadding), prevPos = _h[0], setPrevPos = _h[1];
    var _j = useState(prevPos), pos = _j[0], setPos = _j[1];
    var _k = useState(0), width = _k[0], setWidth = _k[1];
    var _l = useState(0), height = _l[0], setHeight = _l[1];
    var animatedPos = useRef(new Animated.Value(1)).current;
    var _m = useState([state.index]), loaded = _m[0], setLoaded = _m[1];
    var previousIndex = useRef(state.index);
    useEffect(function () {
        if (!loaded.includes(state.index)) {
            setLoaded(function (prev) { return __spreadArray(__spreadArray([], prev, true), [state.index], false); });
        }
    }, [state.index, loaded]);
    // ─── Animate *only* when index truly changes ─────────────────
    useEffect(function () {
        if (previousIndex.current === state.index)
            return;
        animatedPos.setValue(0);
        Animated.spring(animatedPos, {
            toValue: 1,
            useNativeDriver: false,
        }).start(function () {
            setPrevPos(pos);
            previousIndex.current = state.index;
        });
    }, [state.index, pos, animatedPos]);
    // ─── Suppress Android back‐press animation ───────────────────
    useEffect(function () {
        var sub;
        if (Platform.OS === "android") {
            sub = BackHandler.addEventListener("hardwareBackPress", function () { return false; });
        }
        return function () { return sub === null || sub === void 0 ? void 0 : sub.remove(); };
    }, []);
    // ─── Helpers for per‐tab background & tint ───────────────────
    var activeTabBackground = activeTabBackgrounds
        ? Array.isArray(activeTabBackgrounds)
            ? (_b = activeTabBackgrounds[state.index]) !== null && _b !== void 0 ? _b : activeBackgroundColor
            : activeTabBackgrounds
        : activeBackgroundColor;
    var activeColor = activeColors
        ? Array.isArray(activeColors)
            ? (_c = activeColors[state.index]) !== null && _c !== void 0 ? _c : activeTintColor
            : activeColors
        : activeTintColor;
    // ─── Build each tab button ───────────────────────────────────
    var createTab = function (route, routeIndex) {
        var _a, _b;
        var focused = routeIndex === state.index;
        var options = descriptors[route.key].options;
        var tintColor = focused ? activeColor : inactiveTintColor;
        var label = (_b = (_a = options.tabBarLabel) !== null && _a !== void 0 ? _a : options.title) !== null && _b !== void 0 ? _b : route.name;
        var icon = options.tabBarIcon;
        // capture layout
        var onLayout = function (e) {
            if (focused) {
                setPos(e.nativeEvent.layout.x);
                setWidth(e.nativeEvent.layout.width);
                setHeight(e.nativeEvent.layout.height);
            }
        };
        // press/long‐press
        var onPress = function () {
            var event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
                navigation.dispatch(__assign(__assign({}, CommonActions.navigate(route.name)), { target: state.key }));
            }
        };
        var onLongPress = function () {
            return navigation.emit({
                type: "tabLongPress",
                target: route.key,
            });
        };
        // render icon & label
        var renderIcon = function () {
            return icon ? icon({ focused: focused, color: tintColor, size: 20 }) : null;
        };
        var renderLabel = function () {
            return typeof label === "string" ? (React.createElement(Label, { tabButtonLayout: tabButtonLayout, whenActiveShow: whenActiveShow, whenInactiveShow: whenInactiveShow, style: labelStyle, activeColor: tintColor }, label)) : (label({ focused: focused, color: tintColor }));
        };
        var content = focused ? (whenActiveShow === TabElementDisplayOptions.ICON_ONLY ? (renderIcon()) : whenActiveShow === TabElementDisplayOptions.LABEL_ONLY ? (renderLabel()) : (React.createElement(React.Fragment, null,
            renderIcon(),
            renderLabel()))) : whenInactiveShow === TabElementDisplayOptions.ICON_ONLY ? (renderIcon()) : whenInactiveShow === TabElementDisplayOptions.LABEL_ONLY ? (renderLabel()) : (React.createElement(React.Fragment, null,
            renderIcon(),
            renderLabel()));
        return (React.createElement(TabButton, { key: route.key, focused: focused, labelLength: String(label).length, accessibilityLabel: options.tabBarAccessibilityLabel, onLayout: onLayout, onPress: onPress, onLongPress: onLongPress, dotSize: dotSize, tabButtonLayout: tabButtonLayout }, content));
    };
    // overlay for floating style
    var overlayStyle = StyleSheet.create({
        overlayStyle: {
            top: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
            justifyContent: "flex-end",
        },
    }).overlayStyle;
    // should we show the bar?
    var options = descriptors[state.routes[state.index].key].options;
    var tabBarVisible = (_d = options.tabBarVisible) !== null && _d !== void 0 ? _d : true;
    return (React.createElement(React.Fragment, null,
        React.createElement(View, { style: { flex: 1, overflow: "hidden" } },
            React.createElement(ScreenContainer, { style: { flex: 1 } }, state.routes.map(function (route, index) {
                var descriptor = descriptors[route.key];
                var isFocused = state.index === index;
                if (descriptor.options.unmountOnBlur && !isFocused) {
                    return null;
                }
                if (lazy && !loaded.includes(index) && !isFocused) {
                    return null;
                }
                return (React.createElement(ResourceSavingScene, { key: route.key, isVisible: isFocused, style: StyleSheet.absoluteFill },
                    React.createElement(View, { importantForAccessibility: isFocused ? "auto" : "no-hide-descendants", accessibilityElementsHidden: !isFocused, style: { flex: 1 } }, descriptor.render())));
            }))),
        tabBarVisible && (React.createElement(View, { pointerEvents: "box-none", style: floating && overlayStyle },
            React.createElement(BottomTabBarWrapper, { style: tabStyle, floating: floating, topPadding: topPadding, bottomPadding: bottomPadding, horizontalPadding: horizontalPadding, tabBarBackground: tabBarBackground, shadow: shadow },
                state.routes.map(createTab),
                React.createElement(Dot, { dotCornerRadius: dotCornerRadius, topPadding: topPadding, activeTabBackground: activeTabBackground, style: I18nManager.isRTL
                        ? {
                            right: animatedPos.interpolate({
                                inputRange: [0, 1],
                                outputRange: [prevPos, pos],
                            }),
                        }
                        : {
                            left: animatedPos.interpolate({
                                inputRange: [0, 1],
                                outputRange: [prevPos, pos],
                            }),
                        }, width: width, height: height }))))));
}
