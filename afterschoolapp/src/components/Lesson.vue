<template>
    <div id="productContainer">
        <div id="productCard" v-for="product in products" :key="product.id">
            <figure>
                <img v-bind:src="product.image" />
            </figure>
            <h2>{{ product.title }}</h2>
            <p>Location: {{ product.location }}</p>
            <p>Price: AED{{ product.price }}</p>
            <p>Availability: {{ product.availableInventory }}</p>
            <button @click="add(product)" v-if="canAddToCart(product)">
                Add to Cart</button>
            <button disabled="disabled" v-else>
                Add to Cart
            </button>
            <br>
            <span v-if="product.cartInventory === cartCount(product.id)"> All Out!</span>
            <span v-else-if="product.availableInventory < 5"> Only {{ product.availableInventory }}
                left!</span>
            <span v-else>Buy Now!</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Lesson-Component",
    props: ['products'],
    methods: {
        add(product) {
            console.log("Added product", product.id);
            this.$emit('addProduct', product);
        },
        canAddToCart(product) {
            return this.$emit('canAddToCart', product);
        },
        cartCount(id) {
            return this.$emit('cartCount', id)
        }
    }
}
</script>