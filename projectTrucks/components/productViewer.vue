<template>
    <div class="product-list">
        <div id="myProducts">
            <ul>
                <li v-for="(product, index) in products" :key="product.id">
                    {{ product.name }} - {{ product.price }}
                </li>
            </ul>

            <button @click="loadMoreProducts" v-if="hasMore && !isLoading" class="load-more-btn">
                Load More
            </button>

            <p v-if="isLoading" class="loading">Loading...</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useFetch } from '#app'

interface Product {
    id: number
    name: string
    price: number
    description: string
}

const products = ref<Product[]>([])
const page = ref(1)
const limit = 20
const isLoading = ref(false)
const hasMore = ref(true)

const fetchProducts = async () => {
    isLoading.value = true
    try {
        const response: any = await $fetch(`/api/fetchUserProducts?page=${page.value}&limit=${limit}`)
        if (response.data) {
            products.value = [...products.value, ...response.data]
            hasMore.value = response.data.length === limit
        }
    } catch (err) {
        console.error('Failed to fetch products:', err)
    } finally {
        isLoading.value = false
    }
}

const loadMoreProducts = () => {
    if (!isLoading.value && hasMore.value) {
        page.value += 1
        fetchProducts()
    }
}

// Fetch initial products
onMounted(() => {
    fetchProducts()
})
</script>

<style lang="scss" scoped>
.product-list {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;

    #myProducts {
        ul {
            list-style-type: none;
            padding: 0;

            li {
                padding: 15px;
                background-color: #f9f9f9;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
            }
        }

        .load-more-btn {
            display: block;
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;

            &:hover {
                background-color: #0056b3;
            }
        }

        .loading {
            text-align: center;
            font-size: 16px;
            color: #888;
            margin-top: 20px;
        }
    }
}
</style>