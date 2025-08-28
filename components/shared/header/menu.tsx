import UserButtonClient from './user-button-client'
import CartButton from './cart-button'

const Menu = () => {
  return (
    <div className="flex items-center gap-2 justify-end min-w-0">
      <div className="flex-shrink-0">
        <CartButton />
      </div>
      <div className="flex-shrink-0">
        <UserButtonClient />
      </div>
    </div>
  )
}

export default Menu
