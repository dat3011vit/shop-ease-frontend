export enum path {
  HOME = "/*",
  AUTH = "/authentication",
  SYSTEM = "/he-thong/*",
  DETAIL_ALL = "chi-tiet/*",
  CATEGORY="/product?category=",
  SEASON="/product?season=",
  // TODO
  //MAIN
  INDEX = "/",
  SEARCH = "/search",
  CART = "/cart",
  CHECKOUT = "/checkout",
  NOT_FOUND = "/not-found",
  PRODUCT_DETAIL = "/product-detail/*",
  COMPONENT = "/component",

  //Authentication
  LOGIN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-pass",

  //Authorziations
  ACCOUNT = "/account",
  WISHLIST = "/account/wishlist",
  ACCOUNT_ORDER = "/account/order",
  ACCOUNT_INFO = "ho-so",
  ACCOUNT_ADDRESS = "dia-chi",
  CHANGE_PASS = "doi-mat-khau",
  CHANGE_MAIL = "doi-email",

  ACCOUNT_CHANGE_PASS = "/account/password",
  ACCOUNT_BILLING = "/account/billing",

  //OTHERS
  COLLECTION_SEARCH = "/collection/search",
  COLLECTION_ALL = "collection/all",
  COLLECTION_MEN = "/collection/men",
  COLLECTION_WOMAN = "/collection/woman",
  COLLECTION_BEAUTY = "/collection/beauty",
  ABOUT = "/about",
  CONTACT = "/contact",

   //ADMIN
  USER_LIST = "/user-list",
  USER_LIST_BAN = "/user-list-ban",
  ADMIN_PRODUCT_LIST = "/product-list",
  ADD_PRODUCT = "/add-product",
  PRODUCT_ATTRIBUTES = "/product-attributes",
  EDIT_PRODUCT = "/edit-product/:id",
  ORDER_MANAGEMENT = "/order-management",
  STATISTICS = "/statistics",
  INVOCE_MANAGEMENT="/invoice-management",
  INVOCE_USER="/invoice-user",
  PRODUCT = "/product",

  //BLOG
  BLOG = "/blog",
  BLOG_DETAIL = "blog/detail",

  // PRODUCTS
  PRODUCT_COLLECTION = "/collection",

  // ORDER
  ORDERS = "/orders/",
  REVIEW = "/review/*",

  // PAYMENTS
  PAYMENT_ONLINE = "/payment_online",
}

export enum API_URL {
  //Authentication
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  REFRESH_TOKEN = "/auth/accessToken-generate",
  GET_USER = "/users/",

  // Product

  PRODUCTS = "/products",

  // Cart
  CART = "/carts",

  // Wishlist

  WISHLIST = "/productLiked",

  // Categories

  CATEGORY = "/categorys",
}
