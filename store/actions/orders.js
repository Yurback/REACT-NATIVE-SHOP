import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async dispatch => {
        try {
            const response = await fetch(
                'https://react-native-shop-23d2b-default-rtdb.europe-west1.firebasedatabase.app/orders/u1.json'
            );

            if (!response.ok) {
                // use generic error, it's possible to take clouser to obh error
                throw new Error('Something went wrong!')
            }

            const resData = await response.json();

            const LoadedOrders = [];

            for (const key in resData) {
                LoadedOrders.push(new Order(
                    key,
                    resData[key].cartItems,
                    resData[key].totalAmount,
                    new Date(resData[key].date)

                ));
            }

            dispatch({
                type: SET_ORDERS,
                orders: LoadedOrders
            })
        } catch (err) {
            throw err;
        }
    }
}

export const addOrder = (catrItems, totalAmount) => {
    return async dispatch => {
        const date = new Date();
        const response = await fetch('https://react-native-shop-23d2b-default-rtdb.europe-west1.firebasedatabase.app/orders/u1.json',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems,
                    totalAmount,
                    date: date.toISOString()
                })
            });

        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER,
            orderData: { id: resData.name, items: catrItems, amount: totalAmount, date: date }
        });
    }


};