import React from "react";
import { Descriptor, TabNavigationState } from "@react-navigation/native";
import { IAppearanceOptions } from "./types";
declare const defaultTabBarOptions: {
    activeTintColor: string;
    inactiveTintColor: string;
    activeBackgroundColor: string;
    tabStyle: any;
    labelStyle: any;
};
type PartialTabBarOptions = Partial<typeof defaultTabBarOptions>;
interface TabBarElementProps {
    state: TabNavigationState<Record<string, object | undefined>>;
    navigation: any;
    descriptors: Record<string, Descriptor<any, any, any>>;
    appearance: IAppearanceOptions;
    tabBarOptions?: PartialTabBarOptions;
    lazy?: boolean;
}
export default function TabBarElement({ state, navigation, descriptors, appearance, tabBarOptions, lazy, }: TabBarElementProps): React.JSX.Element;
export {};
