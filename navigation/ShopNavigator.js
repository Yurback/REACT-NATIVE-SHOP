import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ProductOverViewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrderScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";

import Colors from "../constants/Colors";

const defaultNavOptiions = {
    headerStyle: {
        backgroundColor: Platform.OS === "android" ? Colors.primary : "",
    },
    headerTitleStyle: {
        fontFamily: "open-sans-bold",
    },
    headerBackTitleStyle: {
        fontFamily: "open-sans",
    },
    headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = createStackNavigator(
    {
        ProductOverview: ProductOverViewScreen,
        ProductDetail: ProductDetailScreen,
        Cart: CartScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptiions,
    }
);

const OrdersNavigator = createStackNavigator(
    {
        Orders: OrdersScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={Platform.OS === "android" ? "md-list" : "ios-list"}
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptiions,
    }
);

const AdminNavigator = createStackNavigator(
    {
        UserProducts: UserProductsScreen,
        EditProduct: EditProductScreen,
    },
    {
        navigationOptions: {
            drawerIcon: (drawerConfig) => (
                <Ionicons
                    name={
                        Platform.OS === "android" ? "md-create" : "ios-create"
                    }
                    size={23}
                    color={drawerConfig.tintColor}
                />
            ),
        },
        defaultNavigationOptions: defaultNavOptiions,
    }
);

const ShopNavigator = createDrawerNavigator(
    {
        Products: ProductsNavigator,
        Orders: OrdersNavigator,
        Admin: AdminNavigator,
    },
    {
        contentOptions: {
            activeTintColor: Colors.primary,
        },
    }
);

const AuthNavigator = createStackNavigator(
    {
        Auth: AuthScreen,
    },
    {
        defaultNavigationOptions: defaultNavOptiions
    }
);

const MainNavigator = createSwitchNavigator({
    Auth: AuthNavigator,
    Shop: ShopNavigator,
});

export default createAppContainer(MainNavigator);
