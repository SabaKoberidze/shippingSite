<template>
    <div id="myProducts">
        <ul>
            <li v-for="(product, index) in paginatedProducts" :key="index">
                <div class="productImages">
                    <img v-if="product.image_urls" v-for="(image, i) in product.image_urls" :src="image"
                        @click="openModal(product.image_urls, i)">
                </div>
                <div class="productInfo">
                    <p class="name"> {{ product.name }}</p>
                    <p class="price">Price: {{ product.price }} {{ langCur.activeCurrency }} - {{ product.forSale ?
                        'იყიდება' : 'ქირავდება' }}
                    </p>
                    <p class="description">{{ product.description }}</p>
                </div>
                <button v-if="props.viewerType === Enums.typeOfProduct.user"
                    @click="deleteProduct(product.id)">X</button>
            </li>
        </ul>

        <!-- Pagination Controls -->
        <div class="pagination-controls" v-if="products.length > productsPerPage">
            <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>

    <!-- Modal for images -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <button class="close-modal" @click="closeModal">X</button>
            <img :src="selectedImage" class="modal-image">
            <div class="modal-navigation">
                <button @click="previousImage">&lt;</button>
                <button @click="nextImage">&gt;</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useFetch } from '#app'
import * as Enums from '@/Enums'
const langCur = useLangCurrencyStore();

interface Product {
    id: number
    name: string
    price: number
    description: string
    forSale: string
    image_urls: string[]
}

const products = ref<Product[]>([])
const page = ref(1)
const limit = 20
const productsPerPage = 5
const currentPage = ref(1)
const isLoading = ref(false)
const hasMore = ref(true)

// Pagination logic
const totalPages = computed(() => Math.ceil(products.value.length / productsPerPage))
const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * productsPerPage
    const end = start + productsPerPage
    return products.value.slice(start, end)
})

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const fetchProducts = async () => {
    isLoading.value = true
    try {
        let url
        if (props.viewerType === Enums.typeOfProduct.global) {
            url = `/api/fetchProducts?page=${page.value}&limit=${limit}`
        }
        else {
            url = '/api/fetchUserProducts'
        }
        const response: any = await $fetch(url)
        if (response.data && response.data.length > 0) {
            products.value = []
            hasMore.value = false
            products.value = [...products.value, ...response.data]
            hasMore.value = response.data.length === limit
        } else {
            products.value = []
        }
    } catch (err) {
        console.error('Failed to fetch products:', err)
    } finally {
        isLoading.value = false
    }
}

const modalVisible = ref(false)
const selectedImage = ref('')
const currentImageIndex = ref(0)
let imageArray: string[] = []
const props = defineProps(['viewerType'])

const openModal = (images: string[], index: number) => {
    imageArray = images
    currentImageIndex.value = index
    selectedImage.value = imageArray[currentImageIndex.value]
    modalVisible.value = true
}

const closeModal = () => {
    modalVisible.value = false
}

const nextImage = () => {
    if (currentImageIndex.value < imageArray.length - 1) {
        currentImageIndex.value++
    } else {
        currentImageIndex.value = 0
    }
    selectedImage.value = imageArray[currentImageIndex.value]
}

const previousImage = () => {
    if (currentImageIndex.value > 0) {
        currentImageIndex.value--
    } else {
        currentImageIndex.value = imageArray.length - 1
    }
    selectedImage.value = imageArray[currentImageIndex.value]
}
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
onMounted(() => {
    fetchProducts()
})
defineExpose({ fetchProducts })
</script>

<style lang="scss" scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .modal-content {
        position: relative;
        width: 80%;
        max-width: 800px;
        height: calc(800px / 16 * 9);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.243);
        border: 3px solid rgb(123, 53, 41);
        backdrop-filter: blur(5px);

        .modal-image {
            max-width: 100%;
            max-height: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 5px;
        }

        .modal-navigation {
            display: flex;
            justify-content: space-between;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            padding: 0 10px;
            width: 100%;

            button {
                background: none;
                border: none;
                color: rgb(221, 129, 113);
                font-size: 24px;
                cursor: pointer;
            }
        }
    }

    .close-modal {
        position: absolute;
        top: 10px;
        right: 10px;
        background: none;
        border: none;
        color: rgb(221, 129, 113);
        font-size: 24px;
        cursor: pointer;
    }
}

#myProducts {
    margin-top: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    ul {
        display: flex;
        flex-direction: column;
        gap: 10px;

        li {
            gap: 20px;
            width: 800px;
            height: 120px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 15px;
            overflow: hidden;
            color: white;
            display: flex;
            justify-content: space-between;
            position: relative;

            @media (max-width: 1000px) {
                width: 95vw;
            }

            button {
                background-color: transparent;
                color: rgba(255, 255, 255, 0.623);
                cursor: pointer;
                width: 50px;
                height: 30px;
                right: -2px;
                top: -2px;
                position: absolute;
                border-bottom: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 0 0 0 10px;
                transition: 200ms;
                font-weight: bold;

                &:hover {
                    color: rgb(255, 255, 255);
                }
            }

            .productImages {
                display: flex;
                height: 100%;
                gap: 10px;
                width: 50%;
                max-width: 50%;
                overflow: hidden;
                position: relative;
                padding: 10px;

                &::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0px;
                    height: 120px;
                    width: 20%;
                    background: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
                    pointer-events: none;
                    z-index: 11;
                }

                img {
                    object-fit: cover;
                    aspect-ratio: 1/1;
                    height: 100%;
                    border-radius: 10px;
                    transition: 200ms;
                    cursor: pointer;

                    &:hover {
                        z-index: 10;
                        box-shadow: 1px 1px 15px black;
                        transform: scale(1.2);
                        border-radius: 12px;
                    }
                }
            }

            .productInfo {
                width: 50%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;

                .name {
                    font-weight: bold;
                    font-size: 22px;
                }

                .price {
                    font-size: 16px;
                }

                .description {
                    color: rgba(255, 255, 255, 0.677);
                    font-size: 12px;
                }
            }
        }
    }
}

.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;

    button {
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        padding: 8px 16px;
        margin: 0 10px;
        cursor: pointer;
        color: white;
        font-size: 16px;
        border-radius: 5px;

        &:disabled {
            background-color: rgba(255, 255, 255, 0.1);
            cursor: not-allowed;
        }

        &:hover:enabled {
            background-color: rgba(255, 255, 255, 0.4);
        }
    }

    span {
        color: white;
        font-size: 16px;
    }
}
</style>
