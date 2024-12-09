import {Component} from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Home from './component/Home'
import Login from './component/Login'
import Cart from './component/Cart'
import NotFound from './component/NotFound'
import ProtectedRoute from './component/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
    restaurantName: '',
  }

  addCartItem = dish => {
    this.setState(prevState => {
      const {cartList} = prevState
      const isAlreadyExists = cartList.find(item => item.dishId === dish.dishId)

      if (!isAlreadyExists) {
        return {cartList: [...cartList, dish]}
      }
      return {
        cartList: cartList.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + dish.quantity}
            : item,
        ),
      }
    })
  }

  removeCartItem = dishId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.filter(item => item.dishId !== dishId),
    }))
  }

  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  incrementCartItemQuantity = dishId => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(item =>
        item.dishId === dishId ? {...item, quantity: item.quantity + 1} : item,
      ),
    }))
  }

  decrementCartItemQuantity = dishId => {
    this.setState(prevState => ({
      cartList: prevState.cartList
        .map(item =>
          item.dishId === dishId
            ? {...item, quantity: item.quantity - 1}
            : item,
        )
        .filter(item => item.quantity > 0),
    }))
  }

  setRestaurantName = name => {
    this.setState({restaurantName: name})
  }

  render() {
    const {cartList, restaurantName} = this.state
    const {
      addCartItem,
      removeCartItem,
      removeAllCartItems,
      incrementCartItemQuantity,
      decrementCartItemQuantity,
      setRestaurantName,
    } = this

    return (
      <CartContext.Provider
        value={{
          cartList,
          addCartItem,
          removeCartItem,
          removeAllCartItems,
          incrementCartItemQuantity,
          decrementCartItemQuantity,
          restaurantName,
          setRestaurantName,
        }}
      >
        <Router>
          <Switch>
            <Route exact path="/login" component={Login} />
            <ProtectedRoute exact path="/" component={Home} />
            <ProtectedRoute exact path="/cart" component={Cart} />
            <Route exact path="/not-found" component={NotFound} />
            <Redirect to="/not-found" />
          </Switch>
        </Router>
      </CartContext.Provider>
    )
  }
}

export default App
