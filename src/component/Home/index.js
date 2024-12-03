import {Component} from 'react'

import Header from '../Header'
import DishItem from '../DishItem'

import './index.css'

class Home extends Component {
  state = {
    isLoading: true,
    response: [],
    activeCategoryId: '',
    cartItems: [],
  }

  componentDidMount() {
    this.fetchRestaurantApi()
  }

  fetchRestaurantApi = async () => {
    const api =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const apiResponse = await fetch(api)
    const data = await apiResponse.json()

    const [firstItem] = data

    if (firstItem && firstItem.table_menu_list) {
      const updatedData = this.getUpdatedData(firstItem.table_menu_list)
      this.setState({
        response: updatedData,
        activeCategoryId:
          updatedData.length > 0 ? updatedData[0].menuCategoryId : '',
        isLoading: false,
      })
    } else {
      this.setState({isLoading: false, response: []})
    }
  }

  getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  addItemToCart = dish => {
    this.setState(prevState => {
      const isAlreadyExists = prevState.cartItems.find(
        item => item.dishId === dish.dishId,
      )
      if (!isAlreadyExists) {
        const newDish = {...dish, quantity: 1}
        return {cartItems: [...prevState.cartItems, newDish]}
      }
      return {
        cartItems: prevState.cartItems.map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity + 1}
            : item,
        ),
      }
    })
  }

  removeItemFromCart = dish => {
    this.setState(prevState => {
      const isAlreadyExists = prevState.cartItems.find(
        item => item.dishId === dish.dishId,
      )
      if (isAlreadyExists) {
        return {
          cartItems: prevState.cartItems
            .map(item =>
              item.dishId === dish.dishId
                ? {...item, quantity: item.quantity - 1}
                : item,
            )
            .filter(item => item.quantity > 0),
        }
      }
      return null
    })
  }

  onUpdateActiveCategory = menuCategoryId => {
    this.setState({activeCategoryId: menuCategoryId})
  }

  renderTabMenuList = () => {
    const {response, activeCategoryId} = this.state

    return response.map(eachCategory => {
      const isActive = eachCategory.menuCategoryId === activeCategoryId
      return (
        <li
          className={`each-tab-item ${isActive ? 'active-tab-item' : ''}`}
          key={eachCategory.menuCategoryId}
          onClick={() =>
            this.onUpdateActiveCategory(eachCategory.menuCategoryId)
          }
        >
          <button type="button" className="tab-category-button">
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })
  }

  renderDishes = () => {
    const {response, activeCategoryId} = this.state
    const activeCategory = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )

    if (!activeCategory) return null
    const {cartItems} = this.state

    return (
      <ul className="dishes-list-container">
        {activeCategory.categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={this.addItemToCart}
            removeItemFromCart={this.removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  renderSpinner = () => (
    <div className="spinner-container">
      <div className="spinner-border" role="status" />
    </div>
  )

  render() {
    const {isLoading, cartItems} = this.state

    return isLoading ? (
      this.renderSpinner()
    ) : (
      <div className="home-container">
        <Header cartItems={cartItems} />
        <ul className="tab-container">{this.renderTabMenuList()}</ul>
        {this.renderDishes()}
      </div>
    )
  }
}

export default Home
