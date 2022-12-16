import { createContext, ReactNode, useEffect, useState } from "react";
import { Coffee } from "../pages/Home/components/CoffeeCard";
import { produce } from 'immer'

export interface CartItem extends Coffee {
  quantity: number
}

interface CartContextType {
  cartItens: CartItem[]
  cartQuantity: number
  cartItensTotal: number
  addCoffeeToCart: (coffee: CartItem) => void
  changeCartItemQuantity: (
    cartItemId: number, 
    type: 'increase' | 'decrease'
    ) => void
  removeCartItem: (cartItemId: number) => void
  cleanCart: () => void
}

interface CartContextProviderProps {
  children: ReactNode
}

const COFFEE_ITENS_STORAGE_KEY = 'coffeeDelivery:cartItens'

export const CartContext = createContext({} as CartContextType)

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartItens, setCartItens] = useState<CartItem[]>(() => {
    const storedCartItens = localStorage.getItem(COFFEE_ITENS_STORAGE_KEY)
    if (storedCartItens) {
      return JSON.parse(storedCartItens)
    }
    return []
  })

  const cartQuantity = cartItens.length

  const cartItensTotal = cartItens.reduce((total, cartItem) => {
    return total + cartItem.price * cartItem.quantity
  }, 0)

  function addCoffeeToCart(coffee: CartItem) {
    const coffeeAlreadyExistInCart = cartItens.findIndex(
      (cartItem) => cartItem.id === coffee.id
    )

    const newCart = produce(cartItens, (draft) => {
      if (coffeeAlreadyExistInCart < 0) {
        draft.push(coffee)
      } else {
        draft[coffeeAlreadyExistInCart].quantity += coffee.quantity
      }
    })

    setCartItens(newCart)
  }

  function changeCartItemQuantity(
    cartItemId: number, 
    type: 'increase' | 'decrease'
    ) {
    const newCart = produce(cartItens, (draft) => {
      const coffeeExistsInCart = cartItens.findIndex(
        (cartItem) => cartItem.id === cartItemId
      )

      if (coffeeExistsInCart >= 0) {
        const item = draft[coffeeExistsInCart]
        draft[coffeeExistsInCart].quantity =
        type === 'increase' ? item.quantity +1 : item.quantity -1
      }
    })

    setCartItens(newCart)
  }

  function removeCartItem(cartItemId: number) {
    const newCart = produce(cartItens, (draft) => {
      const coffeeExistsInCart = cartItens.findIndex(
        (cartItem) => cartItem.id === cartItemId
      )

      if (coffeeExistsInCart >= 0) {
        draft.splice(coffeeExistsInCart, 1)
      }
    })

    setCartItens(newCart)
  }

  function cleanCart() {
    setCartItens([])
  }

  useEffect(() => {
    localStorage.setItem(COFFEE_ITENS_STORAGE_KEY, JSON.stringify(cartItens))
  }, [cartItens])

  return (
    <CartContext.Provider value={{ 
      cartItens, 
      cartQuantity,
      cartItensTotal,
      changeCartItemQuantity,
      addCoffeeToCart,
      removeCartItem,
      cleanCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}