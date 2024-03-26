<template>
  <div id="app">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
      integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm" crossorigin="anonymous" />
    <header>
      <h1>{{ sitename }}</h1>
      <p v-if='cartItemCount == ""' disabled="disabled" id="checkoutBtn" style="opacity: 0.5;">
        {{ cartItemCount }}
        <span class="fas fa-cart-plus"></span>
      </p>
      <p v-else v-on:click="showCheckout" id="checkoutBtn">
        {{ cartItemCount }}
        <span class="fas fa-cart-plus"></span>
      </p>
    </header>
    <main>
      <div v-if="showProduct">
        <div id="mainProductContainer">

          <div id="sideContainer">
            <p>Search:</p>
            <input id="searchbar" type="search" placeholder="Search" v-model="searchInput" @input="searchResults">
            <br>

            <p>Sort By:</p>
            <input type="radio" id="class" value="class" v-model="sortby">
            <label for="class">Class</label>
            <input type="radio" id="location" value="location" v-model="sortby">
            <label for="location">Location</label>
            <input type="radio" id="price" value="price" v-model="sortby">
            <label for="price">Price</label>
            <input type="radio" id="availability" value="availability" v-model="sortby">
            <label for="class">Availability</label>
            <br>

            <p>Order By:</p>
            <input type="radio" id="ascending" value="ascending" v-model="orderby">
            <label for="ascending">Ascending</label>
            <input type="radio" id="descending" value="descending" v-model="orderby">
            <label for="descending">Descending</label>
          </div>

          <div id="productContainer">
            <lesson v-for="product in sortedProducts" :key="product.id" :product="product" 
            @addProduct=addToCart @canAddtoCart=canAddToCart @cartCount="cartCount">
            </lesson>
          </div>
        </div>
      </div>

      <div v-else-if="cartItemCount > 0" id="cartCheckout">
        <checkout :cart="cart" :products="products" @removeFromCart = removeFromCart></checkout>
      </div>

      <div v-else style="text-align: center;">
        <h1 style="font-size: 35px;">Cart</h1>
        <p>No items left in cart!</p>
      </div>

    </main>
  </div>
</template>

<script>

import lesson from './components/Lesson.vue';
import checkout from './components/Checkout.vue';
export default {
  name: 'App',
  components: {
    lesson,
    checkout
  },
  data() {
    return {
      showProduct: true,
      sitename: "After School Classes",
      products: [],
      cart: [],
      searchInput: "",
      sortby: "",
      orderby: "ascending",
      order: {
        name: "",
        phone: ""
      },
    }
  },
  created: function () {
    console.log("Requesting data from server");
    fetch('http://localhost:3000/collection/lessons')
      .then(response => response.json())
      .then(json => {
        this.products = json;
        console.log(json)
      })
  },
  methods: {
    addToCart(product) {
      this.cart.push(product.id);
      product.availableInventory--;
    },
    showCheckout() {
      this.showProduct = this.showProduct ? false : true;
    },
    canAddToCart(product) {
      return product.cartInventory > this.cartCount(product.id);
    },
    cartCount(id) {
      let count = 0;
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i] == id) {
          count++;
        }
      }
      return count;
    },
    removeFromCart(product) {
      let index = this.cart.indexOf(product.id);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
      product.availableInventory++;
    },
    submitForm() {
      this.order = {
        name: this.order.name,
        phone: this.order.phone,
        cart: this.cart
      }
      fetch('http://localhost:3000/collection/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.order),
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to place order');
        }
        return response.json();
      }).then(data => {
        console.log('Order placed successfully:', data[0]._id);
        this.updateLessons();
        alert("Order placed successfully: " + data[0]._id)
        this.cart = [];
        location.reload();
      }).catch(error => {
        console.error('Error placing order: ', error);
      });
    },
    updateLessons() {
      let lessonObjectID;
      for (let lesson of Object.keys(this.cart)) {
        console.log(this.cart[lesson]);
        for (let product of this.products) {
          // console.log(this.products[product].id +""+   this.cart[lesson]);
          if (this.cart[lesson] === product.id) {
            lessonObjectID = product._id;
            console.log(product.id + "" + this.cart[lesson]);
            console.log(lessonObjectID);
          }
        }
        fetch('http://localhost:3000/collection/lessons/' + lessonObjectID, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(response => {
          console.log(response);
          if (!response.ok) {
            throw new Error('Failed to update inventory');
          }
          return response.json();
        }).catch(error => {
          console.error('Error updating inventory', error);
          // Handle error (e.g., show error message to user)
        });
      }
    },
    searchResults() {
      fetch('http://localhost:3000/collection/lessons/search?q=' + this.searchInput, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to search lessons');
        }
        return response.json();
      }).then(data => {
        console.log(data);
        this.products = data;
      }).catch(error => {
        console.error('Error searching lessons:', error);
      });
    }

  },
  computed: {
    cartItemCount: function () {
      return this.cart.length || "";
    },
    sortedProducts: function () {
      let productsArray = this.products.slice(0);

      // productsArray = productsArray.filter((product) =>
      //     product.title.toLowerCase().includes(this.searchInput.toLowerCase().trim())
      //     || product.location.toLowerCase().includes(this.searchInput.toLowerCase().trim())
      // );

      function compare(a, b, sortby, orderby) {
        if (sortby === "price") {
          if (orderby === "ascending") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        } else if (sortby === "class") {
          if (orderby === "ascending") {
            return a.title.localeCompare(b.title);
          } else {
            return b.title.localeCompare(a.title);
          }
        } else if (sortby === "availability") {
          if (orderby === "ascending") {
            return a.availableInventory - b.availableInventory;
          } else {
            return b.availableInventory - a.availableInventory;
          }
        } else if (sortby === "location") {
          if (orderby === "ascending") {
            return a.location.localeCompare(b.location);
          } else {
            return b.location.localeCompare(a.location);
          }
        }
      }

      // Sort productsArray using the compare function and pass sortby and orderby
      return productsArray.sort((a, b) => compare(a, b, this.sortby, this.orderby));

    },
    validateInput() {

      var regName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
      var regNumber = /^[0-9]*$/g;

      //console.log("name:" + regName.test(this.order.name));
      //console.log("number:" + regNumber.test(this.order.phone) + " number:" + this.order.phone)

      if (this.order.name != "" && this.order.phone != "") {
        console.log("check1");
        if (regName.test(this.order.name) && regNumber.test(this.order.phone)) {
          return true;
        }
      }
      return false;
    }
  }
}
</script>