<template>
    <div class="dropdown">
        <span v-if="selectedOption" class="clear-button" @click.stop="clearSelection">✖</span>
        <span v-else class="arrow" :class="{ 'arrow-open': isOpen, 'arrow-close': !isOpen }"></span>
        <button v-if="!isOpen" class="dropdown-button" @click="toggleDropdown" :class="{ selected: selectedOption }">
            <p class="dropdown-name" v-if="selectedOption">{{ dropdownName }}</p>
            <p>{{ selectedOption || dropdownName }}</p>
        </button>
        <div v-else class="dropdown-input-wrapper">
            <input type="text" v-model="searchQuery" :placeholder="selectedOption || dropdownName"
                @input="filterOptions" @blur="closeDropdown" class="dropdown-input" ref="searchInput" />
        </div>

        <ul
            :class="{ 'dropdown-list': true, 'dropdown-list-open': isOpen, 'dropdown-list-close': !isOpen && hasBeenOpen }">
            <li v-for="option in filteredOptions" :key="option" @mousedown.stop="selectOption(option)">
                {{ option }}
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, nextTick, defineProps } from 'vue';
const props = defineProps({
    options: {
        type: Array as () => string[],
        required: true,
    },
    dropdownName: {
        type: String,
        default: 'Select an option'
    }
});

const isOpen = ref(false);
const hasBeenOpen = ref(false);
const selectedOption = ref('');
const searchQuery = ref('');
const searchInput = ref<HTMLInputElement | null>(null);

const toggleDropdown = async () => {
    if (selectedOption.value) {
        return;
    }
    if (!isOpen.value) {
        searchQuery.value = '';
    }
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
        await nextTick();
        searchInput.value?.focus();
    }
    if (!hasBeenOpen.value) hasBeenOpen.value = true;
};

const clearOption = () => {
    selectedOption.value = ''
}

const closeDropdown = () => {
    isOpen.value = false;
    searchQuery.value = '';
};

const selectOption = (option: string) => {
    selectedOption.value = option;
    isOpen.value = false;
    searchQuery.value = '';
};


const filteredOptions = computed(() => {
    if (!searchQuery.value) return props.options;
    return props.options.filter(option =>
        option.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const filterOptions = () => {
    if (!isOpen.value) isOpen.value = true;
}

const clearSelection = () => {
    selectedOption.value = '';
    isOpen.value = false;
};
defineExpose({ clearSelection })
</script>

<style lang="scss" scoped>
.dropdown {
    position: relative;
    display: inline-block;
    width: 200px;
    border: 0;
    transition: 200ms;
}

.dropdown-button {
    border-radius: 8px;
    background-color: #f9f9f903;
    color: white;
    padding: 10px;
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
    flex-direction: column;
    height: 40px;
    border: 1px solid rgb(153, 93, 82);
    transition: 200ms;
    z-index: 100;

    &.selected {
        background-color: rgb(40, 39, 39);
    }

    .dropdown-name {
        font-size: 11px;
        opacity: 0.6;
    }
}

.arrow {
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    margin-left: 10px;
    cursor: pointer;
    transform: rotate(45deg);
    transition: transform 0.3s ease;
    position: absolute;
    right: 10px;
    top: 40%;
    z-index: 3;

    &-close {
        pointer-events: none;
    }

    &-open {
        transform: rotate(-135deg);
    }
}

.clear-button {
    margin-left: 10px;
    cursor: pointer;
    color: #ccc;
    font-weight: bold;
    position: absolute;
    right: 7px;
    top: 25%;
    transition: 200ms;

    &:hover {
        color: #ffffff;
    }
}

.dropdown-input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
}

.dropdown-input {
    width: 100%;
    height: 40px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;

    &:focus {
        outline: 0;
        border: 0;
    }
}



.dropdown-list {
    position: absolute;
    background-color: #fff;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 100;
    border-radius: 0 0 5px 5px;

    &-open {
        opacity: 1;
        transform: scaleY(1);
    }

    &-close {
        opacity: 0;
        transform: scaleY(0);
    }

    li {
        padding: 10px;
        cursor: pointer;
        transition: 200ms;

        &:hover {
            background-color: #f1f1f1;
        }
    }
}
</style>
