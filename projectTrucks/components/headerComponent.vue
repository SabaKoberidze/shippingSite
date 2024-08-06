<template>
    <header>
        <div id="siteInfo">
            <div id="logo" @click="navigateTo('/')">LOGO</div>
            <div id="searchContainer">
                <div id="searchIcon">
                </div>
                <input placeholder="ძებნა">
            </div>
        </div>
        <div id="personalInfo">
            <div id="siteConfigs" @click="toggleLangCurrencyPicker" :class="{ active: langCurrencyPickerVisible }"
                ref="siteConfigs">
                <div>{{ langCur.activeLanguage }}</div>
                <div>{{ langCur.activeCurrency }}</div>
                <div id="langCurrencyPicker" v-show="langCurrencyPickerVisible">
                    <div class="languages">
                        <p v-for="(lang, index) in langCur.langs" :key="lang"
                            @click.stop="langCur.activeLanguage = lang"
                            :class="{ active: langCur.activeLanguage === lang }">{{ lang }}
                        </p>
                    </div>
                    <div class="currencies">
                        <p v-for="currency in langCur.currency" :key="currency"
                            @click.stop="langCur.activeCurrency = currency"
                            :class="{ active: langCur.activeCurrency === currency }">{{ currency }}</p>
                    </div>
                </div>
            </div>
            <div id="userPorfile" @click="navigateTo('/profile')"></div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
const langCur = useLangCurrencyStore();
const langCurrencyPickerVisible = ref(false);
const siteConfigs = ref<HTMLElement | null>(null);

const toggleLangCurrencyPicker = () => {
    langCurrencyPickerVisible.value = !langCurrencyPickerVisible.value;
};

const handleClickOutside = (event: MouseEvent) => {
    if (siteConfigs.value && !siteConfigs.value?.contains(event.target as Node)) {
        langCurrencyPickerVisible.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
header {
    padding: 0 40px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 60px;
    justify-content: space-between;
    background-color: rgba(136, 145, 146, 0.539);

    #siteInfo {
        display: flex;
        gap: 40px;
        align-items: center;
        height: 100%;

        #logo {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #searchContainer {
            display: flex;
            align-items: center;
            gap: 10px;
            background-color: rgba(255, 255, 255, 0.903);
            padding: 0 10px;
            border-radius: 25px;
            border: 1px solid rgba(0, 0, 0, 0.357);
            width: 300px;
            height: 60%;

            #searchIcon {
                background-image: url("../assets/images/searchIcon.png");
                height: 100%;
                aspect-ratio: 1/1;
                background-position: center;
                background-size: cover;
            }

            input {
                background-color: transparent;
                border: 0;
                width: 100%;
                height: 100%;

                &:focus {
                    border: 0;
                    outline: 0;
                }
            }
        }
    }

    #personalInfo {
        display: flex;
        gap: 40px;
        height: 100%;
        align-items: center;

        #siteConfigs {
            display: flex;
            background-color: rgba(255, 255, 255, 0.903);
            justify-content: space-evenly;
            align-items: center;
            height: 60%;
            min-width: 150px;
            border-right: solid 1px rgba(0, 0, 0, 0.357);
            position: relative;
            border-radius: 25px;
            transition: 200ms;
            user-select: none;

            div {
                height: 100%;
                width: 100%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: solid 1px rgba(0, 0, 0, 0.357);
                padding: 0 10px;

                &:nth-child(2) {
                    border: 0;
                    max-width: 25%;
                }
            }

            #langCurrencyPicker {
                position: absolute;
                min-width: 250px;
                height: max-content;
                top: 100%;
                border: 1px solid rgba(0, 0, 0, 0.357);
                right: -1px;
                padding: 0;
                background-color: rgba(255, 255, 255, 0.903);
                border-radius: 25px 0 25px 25px;
                z-index: 5;
                cursor: unset;

                div {
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    justify-content: start;
                    align-items: start;
                    border: 0;
                    padding: 0;
                    border-right: 1px solid rgba(0, 0, 0, 0.357);
                    border-radius: 20px 0 0 20px;
                    overflow: hidden;
                    transition: 200ms;

                    &:nth-child(2) {
                        border: 0;
                        border-radius: 0 0 20px;
                        overflow: hidden;
                    }

                    p {
                        display: flex;
                        align-items: center;
                        padding-left: 20px;
                        width: 100%;
                        min-height: 45px;
                        height: 45px;
                        transition: 100ms;

                        &:hover {
                            background-color: rgba(0, 0, 255, 0.208);
                        }

                        &.active {
                            background-color: rgba(0, 0, 67, 0.446);
                        }
                    }

                    &:nth-child(2) {
                        p {
                            align-items: center;
                            justify-content: center;
                            padding: 0;
                        }
                    }
                }

            }

            &.active {
                border-radius: 25px 25px 0 0;
            }

        }

        #userPorfile {
            height: 60%;
            aspect-ratio: 1/1;
            background-color: rgba(255, 255, 255, 0.903);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url("../assets/images/driver.png");
            background-position: center;
            background-size: cover;
            cursor: pointer;
        }

    }
}
</style>
