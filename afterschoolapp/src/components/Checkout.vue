<template>
  <div>
    <h1>Cart</h1>
    <div id="cartContainer">
      <div id="cartCardContainer"><!-- v-for="id in cart" :key="id" -->
        <div id="productCard" v-for="product in filteredProducts" :key="product.id">
          <figure>
            <img :src="product.image" alt="Product Image">
          </figure>
          <h2>{{ product.title }}</h2>
          <p>Location: {{ product.location }}</p>
          <p>Price: AED{{ product.price }}</p>
          <button @click="removeItemFromCart(product)">
            Remove Item
          </button>
          <br>
        </div>
      </div>
    </div>

    <div id="checkoutContainer">
      <h1>Checkout</h1>

      <p>
        <strong>Name:</strong>
        <input v-model.trim="order.name" />
      </p>
      <p>
        <strong>Phone:</strong>
        <input type="number" v-model="order.phone" />
      </p>
      <br><br><br>

      <h1>Order Information</h1>
      <p>Name: {{ order.name }}</p>
      <p>Phone: {{ order.phone }}</p>

      <button v-if="validateInput" @click="submitForm()">
        Place Order</button>
      <button v-else disabled='disabled'>
        Place Order</button>
    </div>
  </div>
</template>


<script>
export default {
  name: "Checkout-Component",
  props: ['cart', 'products'],
  data() {
    return {
      order: {
        name: "",
        phone: "",
        cart: this.cart
      }
    };
  },
  methods: {
    removeItemFromCart(product) {
      this.$emit('removeFromCart', product);
    },
    submitForm() {
      console.log("clicked");
      console.log(this.order);
      this.$emit('submitForm',this.order);
    }
  },
  computed: {
    filteredProducts() {
      let filteredProducts = [];
      for (let item in this.cart) {
        for (let product in this.products) {
          if (this.products[product].id == this.cart[item]) {
            filteredProducts.push(this.products[product]);
          }
        }
      }
      return filteredProducts;
    },
    validateInput() {

      var regName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;
      var regNumber = /^[0-9]*$/g;

      //console.log("name:" + regName.test(this.order.name));
      //console.log("number:" + regNumber.test(this.order.phone) + " number:" + this.order.phone)

      if (this.order.name != "" && this.order.phone != "") {
        if (regName.test(this.order.name) && regNumber.test(this.order.phone)) {
          return true;
        }
      }
      return false;
    }
  }
}
</script>