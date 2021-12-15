export default function initProducts() {
  const $productsList = document.querySelector('.products_list');
  const $listItensOnCart = document.querySelector('.products_list--cart');
  const $cart = document.querySelector('.cart');
  const $closeButton = document.querySelector('.close_cart');
  const $cartIcon = document.querySelector('[data-product="cart"]');
  const $totalPrice = document.querySelector('[data-product="totalPrice"]');
  const $quantityInCart = document.querySelector('[data-product="number"]');
  const $buttonClean = document.querySelector('[data-product="clean"]');
  const url = './products.json';

  let cart = [];
  let buttonDOM = [];

  const DataStorage = () => {
    const saveProducts = (products) => {
      localStorage.setItem('products', JSON.stringify(products));
    };

    const saveCart = (cartItems) => {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    };

    const getProduct = (id) => {
      const products = JSON.parse(localStorage.getItem('products'));
      return products.find((item) => item.id === id);
    };

    const getCart = () => (localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart')) : []);

    return Object.freeze({
      saveProducts,
      getProduct,
      saveCart,
      getCart,
    });
  };

  async function getData() {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  const UiProduct = () => {
    const createProductFromPage = (products) => {
      let resultUi = '';
      products.forEach((item) => {
        resultUi += `<li>
        <img data-product="image" src="img/${item.img}" alt="${item.product}">
        <h2 data-product="name">${item.product}</h2>
        <span data-product="price">US$ ${item.price}</span>
        <h3 data-product="type">${item.type}</h3>
        <button data-product="button" data-id="${item.id}">Add to cart</button>
        </li>`;
      });

      $productsList.innerHTML = resultUi;
    };

    const setPrice = () => {
      const totalPrice = cart.reduce((accum, item) => accum + item.price * item.quantity, 0);
      $totalPrice.innerText = `Your Total: US$ ${totalPrice.toFixed(2)}`;
    };

    const setQuantity = () => {
      const quantity = cart.reduce((accum, item) => accum + item.quantity, 0);
      $quantityInCart.innerText = quantity;
    };

    const showProducts = () => {
      $cartIcon.addEventListener('click', () => {
        $cart.classList.add('show-products');
      });
    };

    const hideProducts = () => {
      $closeButton.addEventListener('click', () => {
        $cart.classList.remove('show-products');
      });
    };

    const createProductFromCart = (product) => {
      const productsInCart = document.createElement('li');

      productsInCart.innerHTML = `
      <img data-product="image" src="img/${product.img}" alt="${product.product}">
      <h2 data-product="name">${product.product}</h2>
      <span data-product="price">US$ ${product.price}</span>
      <span data-product="quantity"><pre data-product="less" data-id="${product.id}">-</pre>${product.quantity}<pre data-product="most" data-id="${product.id}">+</pre></span>
      <h3 data-product="type">${product.type}</h3>
      <span data-product="remove" data-id="${product.id}">Remove</span>`;

      $listItensOnCart.appendChild(productsInCart);
    };

    const addProductOnCart = (event, id) => {
      const thisProduct = event.target;

      thisProduct.innerText = 'Product On Cart';
      thisProduct.disabled = true;

      const productOnCart = DataStorage().getProduct(id);
      productOnCart.quantity = 1;

      cart = [...cart, productOnCart];

      DataStorage().saveCart(cart);

      createProductFromCart(productOnCart);

      setPrice();
      setQuantity();

      showProducts();
      hideProducts();
    };

    const getButton = () => {
      let buttons = document.querySelectorAll('[data-product="button"]');
      buttons = Array.from(buttons);
      buttonDOM = buttons;

      buttons.forEach((item) => {
        const { id } = item.dataset;
        const cartItem = cart.find((itemCart) => itemCart.id === id);

        if (cartItem) {
          item.innerText = 'Product On Cart';
          item.disabled = true;
        } else {
          item.addEventListener('click', (event) => {
            addProductOnCart(event, id);
          });
        }
      });
    };

    const populateCart = (cartItems) => {
      cartItems.forEach((item) => createProductFromCart(item));
    };

    const setValues = () => {
      cart = DataStorage().getCart();
      populateCart(cart);
      setPrice();
      setQuantity();
      showProducts();
      hideProducts();
    };

    const getSingleButton = (id) => buttonDOM.find((item) => item.dataset.id === id);

    const removeProduct = (id) => {
      cart = cart.filter((item) => item.id !== id);
      setPrice();
      setQuantity();
      DataStorage().saveCart(cart);
      const button = getSingleButton(id);
      button.innerText = 'Add to cart';
      button.disabled = false;
    };

    const clearCart = () => {
      const cartProducts = cart.map((item) => item.id);
      cartProducts.forEach((item) => removeProduct(item));
      while ($listItensOnCart.children.length > 0) {
        $listItensOnCart.removeChild($listItensOnCart.children[0]);
      }
    };

    const cartEvents = () => {
      $buttonClean.addEventListener('click', () => {
        clearCart();
      });

      $listItensOnCart.addEventListener('click', (event) => {
        if (event.target.dataset.product === 'remove') {
          const { id } = event.target.dataset;
          removeProduct(id);
          $listItensOnCart.removeChild(event.target.parentNode);
        } else if (event.target.dataset.product === 'most') {
          const { id } = event.target.dataset;
          const cartProduct = cart.find((item) => item.id === id);
          cartProduct.quantity += 1;
          DataStorage().saveCart(cart);
          setPrice();
          setQuantity();
          event.target.previousSibling.textContent = cartProduct.quantity;
        } else if (event.target.dataset.product === 'less') {
          const { id } = event.target.dataset;
          const cartProduct = cart.find((item) => item.id === id);
          cartProduct.quantity -= 1;
          event.target.nextSibling.textContent = cartProduct.quantity;
          if (cartProduct.quantity === 0) {
            removeProduct(id);
            $listItensOnCart.removeChild(event.target.parentNode.parentNode);
          } else {
            DataStorage().saveCart(cart);
            setPrice();
            setQuantity();
          }
        }
      });
    };

    return Object.freeze({
      setValues,
      createProductFromPage,
      getButton,
      cartEvents,
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    UiProduct().setValues();
    getData()
      .then((products) => {
        UiProduct().createProductFromPage(products);
        DataStorage().saveProducts(products);
      })
      .then(() => {
        UiProduct().getButton();
        UiProduct().cartEvents();
      });
  });
}
