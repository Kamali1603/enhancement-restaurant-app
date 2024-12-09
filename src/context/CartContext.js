import {createContext} from 'react'

const CartContext = createContext({
  cartList: [],
  addCartItem: () => {},
  removeCartItem: () => {},
  removeAllCartItems: () => {},
  incrementCartItemQuantity: () => {},
  decrementCartItemQuantity: () => {},
  restaurantName: '',
  setRestaurantName: () => {},
})

export default CartContext
