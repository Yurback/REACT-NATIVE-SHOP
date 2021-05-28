import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    console.log('hello');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const products = useSelector(state => state.products.availableProducts);

    const dispatch = useDispatch();

    const loadProducts = useCallback(() => {
        if (error) setError(null);
        setIsRefreshing(true);
        dispatch(productActions.fetchProducts())
            .then(() => {
                setIsLoading(false);
                setIsRefreshing(false);
            })
            .catch(err => setError(err.message));
    }, [dispatch, setIsLoading, setError]);

    useEffect(()=>{
        setIsLoading(true);
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);

        return ()=>{
            willFocusSub.remove();
        }
    }, [loadProducts])

    // useEffect(()=>{
    //     loadProducts()
    // }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        props.navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }
    // An error occured!
    if (error) {
        return <View style={styles.centered}> 
            <Text>{error}</Text>
            <Button 
                title='Try again' 
                onPress={loadProducts} 
                color={Colors.primary}
            />
            
            
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products found. Maybe start adding sone!</Text>
        </View>
    }

    return <FlatList data={products}
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        // keyExtractor = {item=>item.availableProducts} -- в новых версиях RN делать не нужно
        renderItem={itemData => <ProductItem
            image={itemData.item.imageUrl}
            title={itemData.item.title}
            price={itemData.item.price}
            onSelect={() => {
                selectItemHandler(itemData.item.id, itemData.item.title)
            }}
        >
            <Button color={Colors.primary} title='View Details' onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title)
            }} />
            <Button color={Colors.primary} title='To Cart' onPress={() => {
                dispatch(cartActions.addToCart(itemData.item))
            }} />

        </ProductItem>

        }
    />;
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
        headerTitle: 'All Products',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Menu'
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }} />
        </HeaderButtons>,
        headerRight: () => {
            return <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='Cart'
                    iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    onPress={() => {
                        navData.navigation.navigate('Cart');
                    }} />
            </HeaderButtons>
        }
    }

};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen;