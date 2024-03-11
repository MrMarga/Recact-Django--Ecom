import { createStore, combineReducers, applyMiddleware } from "redux";

import { composeWithDevTools } from "redux-devtools-extension";

import { thunk } from "redux-thunk";

import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
} from "./reducers/productReducers";

import { cartReducer } from "./reducers/cartReducers";

import { userDeleteReducer, userDetailsReducer, userListReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer, userUpdateReducer } from "./reducers/userReducers";

import { orderCreateReducer , orderDeleteReducer, orderDeliverReducer, orderDetailsReducer, orderListMyReducer, orderListReducer, orderPayReducer } from "./reducers/orderReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productCreate : productCreateReducer,
  productDelete : productDeleteReducer,
  productUpdate : productUpdateReducer,
  productReviewCreate : productReviewCreateReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister : userRegisterReducer,
  userDetails : userDetailsReducer,
  userList : userListReducer,
  userDelete : userDeleteReducer,
  userUpdateProfile : userUpdateProfileReducer,
  userUpdate : userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDelete: orderDeleteReducer,
  orderDetails: orderDetailsReducer,
  orderPay : orderPayReducer,
  orderDeliver : orderDeliverReducer,
  orderList : orderListReducer,
  orderListMy : orderListMyReducer,

})

const cartItemsFromStorage = localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems"))
  : []

const userInfoFromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo"))
  : null

const shippingAddressFromStorage = localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem("shippingAddress")):{}

const paymentMethodFromStorage = localStorage.getItem("paymentMethod") ? JSON.parse(localStorage.getItem("paymentMethod")):{}
  

const initialState = {
  cart: { cartItems: cartItemsFromStorage,
          shippingAddress: shippingAddressFromStorage,
          paymentMethod: paymentMethodFromStorage,            
  },
  
  userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store;
