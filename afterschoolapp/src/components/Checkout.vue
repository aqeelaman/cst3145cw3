<template>
  <div>
    <h1>Cart</h1>
    <div id="cartContainer">
      <div id="cartCardContainer" v-for="id in cart" :key="id">
        <div id="productCard" v-for="product in filteredProducts" :key="String(product.id)">
          <figure>
            <img :src="product.image" alt="Product Image">
          </figure>
          <h2>{{ product.title }}</h2>
          <p>Location: {{ product.location }}</p>
          <p>Price: AED{{ product.price }}</p>
          <button @click="removeFromCart(product)">
            Remove Item
          </button>
          <br>
        </div>
      </div>
    </div>

    <!-- <div id="checkoutContainer">
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

          <button v-if="validateInput" v-on:click="submitForm">
            Place Order</button>
          <button v-else disabled='disabled'>
            Place Order</button>
        </div> -->


    <!-- <h2>Checkout</h2>
        <h3>Added Products</h3>
        <div v-for="(product,index) in cart" :key="product.id">
            {{ product.id }}
            <button @click="removeItem(index)">remove</button>
        </div>
        <div>
            <strong>Name</strong>
            <input v-model="name"/>
            <strong>Address</strong>
            <input v-model="address"/>
            <button @click="submitForm">Submit</button>
        </div> -->
  </div>
</template>
<script>
export default {
  name: "Checkout-Component",
  props: ['cart', 'products'],
  data() {
    return {
      name: "",
      address: ""
    };
  },
  methods: {
    removeFromCart(product) {
      this.$emit('removeFromCart', product);
    },
    submitForm() {
      console.log("Form submitted with ", this.name, this.address);
      this.name = "";
      this.address = "";
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        return this.cart.includes(product.id);
      });
    }
  }
}
</script>