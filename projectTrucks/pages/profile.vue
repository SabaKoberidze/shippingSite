<template>
    <div class="add-product">
        <button id="addProduct" @click="toggleForm" :class="{ formShown: showForm }">
            Add New Product
        </button>

        <form @submit.prevent="submitForm" :class="{ formShown: showForm }">
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

            <div class="form-group">
                <label for="files">Select files:</label>
                <input type="file" id="files" name="files" multiple @change="handleFileChange">
            </div>

            <button type="submit" class="submit-btn">Add Product</button>
        </form>
    </div>

    <ProductViewer ref="viewer" :viewer-type="Enums.typeOfProduct.user"></ProductViewer>
</template>

<script lang="ts" setup>
import * as Enums from "@/Enums"
definePageMeta({
    middleware: ['auth']
})
const langCur = useLangCurrencyStore();
const viewer: any = ref(null)
interface Product {
    id: number
    name: string
    price: number
    description: string
    image_urls?: string[]
}

const products = ref<Product[]>([])

const formData = ref({
    name: '',
    price: 0,
    description: '',
})

const files = ref<File[]>([])
const showForm = ref(false)

const toggleForm = () => {
    showForm.value = !showForm.value
}

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        files.value = Array.from(target.files)
    }
}

const submitForm = async () => {
    const form = new FormData();
    form.append('name', formData.value.name);
    form.append('price', formData.value.price.toString());
    form.append('description', formData.value.description);

    for (const file of files.value) {
        form.append('files', file);
    }

    try {
        const response = await fetch('/api/addUserProducts', {
            method: 'POST',
            body: form,
        });

        // Check for errors or successful submission
        if (response.ok) {
            viewer.value.fetchProducts();
        } else {
            console.error('Failed to submit the form');
        }
    } catch (err) {
        console.error('Error:', err);
    }

    // Clear the form after submission
    formData.value = { name: '', price: 0, description: '' };
    files.value = [];
};

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
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        align-items: center;

        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
        }

        .modal-navigation {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 10px;

            button {
                background: none;
                border: none;
                color: black;
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
        color: black;
        font-size: 24px;
        cursor: pointer;
    }
}

.add-product {
    max-width: 400px;
    margin: 0 auto;
    margin-top: 15px;
    border: 1px solid #cccccc;
    border-radius: 8px;
    background-color: #ffffff00;
    overflow: hidden;

    #addProduct {
        text-align: center;
        transition: 200ms;
        height: 50px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ffffff00;
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
        position: relative;

        &:hover {
            background-color: rgba(123, 53, 41, 0.39);
        }

        &::before {
            content: '';
            position: absolute;
            width: 0px;
            height: 0px;
            border-style: solid;
            border-width: 0 5px 7px 5px;
            border-color: transparent transparent #ffffff transparent;
            transform: rotate(180deg);
            transition: 200ms;
            right: 5%;
        }

        &.formShown {
            background: linear-gradient(rgba(123, 53, 41, 0.701), rgba(123, 53, 41, 0));

            &::before {
                transform: rotate(0deg);
            }

            &:hover {
                background: linear-gradient(rgba(123, 53, 41, 0.701) 0 20%, rgba(123, 53, 41, 0));
            }
        }
    }

    form {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.5s ease-in-out, padding 0.5s ease-in-out;

        &.formShown {
            max-height: 500px;
        }
    }

    .form-group {
        color: white;
        margin-bottom: 15px;
        padding: 15px;

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
            background-color: rgba(255, 255, 255, 0.039);
            color: white;
            border-radius: 4px;
            box-sizing: border-box;
        }
    }

    .submit-btn {
        display: block;
        width: 100%;
        padding: 10px;
        background: linear-gradient(rgba(123, 53, 41, 0), rgba(123, 53, 41, 0.701));
        color: #fff;
        border: none;
        border-radius: 0 0 4px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;
        transition: 200ms;
        font-weight: bold;

        &:hover {
            background: linear-gradient(rgba(123, 53, 41, 0), rgba(123, 53, 41, 0.701) 80% 100%);
            ;
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
</style>
