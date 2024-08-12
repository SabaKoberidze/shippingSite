<template>
    <div class="add-product">
        <button id="addProduct" @click="toggleForm">
            Add New Product
        </button>

        <form v-if="showForm" @submit.prevent="submitForm">
            <div class="form-group">
                <label for="name">Product Name:</label>
                <input type="text" id="name" v-model="formData.name" required />
            </div>

            <div class="form-group">
                <label for="price">Price:</label>
                <input type="number" id="price" v-model="formData.price" required />
            </div>

            <div class="form-group">
                <label for="description">Description:</label>
                <textarea id="description" v-model="formData.description" required></textarea>
            </div>

            <button type="submit" class="submit-btn">Add Product</button>
        </form>
    </div>

    <div id="myProducts">
        <ul>
            <li v-for="(product, index) in products" :key="index">
                {{ product.name }} - {{ product.price }}/{{ product.id }}
                <button @click="deleteProduct(product.id)">Delete</button>
            </li>
        </ul>
    </div>
</template>


<script lang="ts" setup>
definePageMeta({
    middleware: ['auth']
})

interface Product {
    id: number
    name: string
    price: number
    description: string
}

const products = ref<Product[]>([])

const formData = ref({
    name: '',
    price: 0,
    description: '',
})
const showForm = ref(false)

const toggleForm = () => {
    showForm.value = !showForm.value
}

const submitForm = async () => {
    const product: Omit<Product, 'id'> = {
        name: formData.value.name,
        price: formData.value.price,
        description: formData.value.description,
    }
    try {
        await $fetch('/api/addUserProducts', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        fetchProducts()
    } catch (err) {
        console.log(err)
    }
    formData.value = { name: '', price: 0, description: '' }
}

// Fetch products to display
onMounted(async () => {
    fetchProducts()
})

const fetchProducts = async () => {
    try {
        const updatedProducts: any = await $fetch('/api/fetchUserProducts')
        if (updatedProducts) {
            products.value = updatedProducts.data
            console.log(products.value)
        }
    } catch (err) {
        console.log(err)
    }
}

// Delete a product
const deleteProduct = async (productId: number) => {
    try {
        await $fetch(`/api/deleteUserProduct/${productId}`, {
            method: 'DELETE',
        })
        fetchProducts() // Refresh the product list after deletion
    } catch (err) {
        console.log(err)
    }
}
</script>
<style lang="scss" scoped>
.add-product {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;

    #addProduct {
        text-align: center;
        margin-bottom: 20px;
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            background-color: #0056b3;
        }
    }

    .form-group {
        margin-bottom: 15px;

        label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
        }

        input,
        textarea {
            width: 100%;
            max-width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
    }

    .submit-btn {
        display: block;
        width: 100%;
        padding: 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;

        &:hover {
            background-color: #0056b3;
        }
    }
}

#myProducts {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;

    ul {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: 20px;
        width: 500px;

        li {
            padding: 20px;
            background-color: white;
        }
    }
}
</style>