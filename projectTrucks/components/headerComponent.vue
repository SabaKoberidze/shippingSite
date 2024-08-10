<template>
    <header>
        <div id="siteInfo">
            <div id="logo" @click="navigateTo('/')">LOGO</div>
            <div id="searchContainer" v-show="route.name !== 'profile'">
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
            <div id="userPorfile" @click="profileIsShown = !profileIsShown" :class="{ active: profileIsShown }"
                ref="profileButton">
                <div v-show="profileIsShown">
                    <p @click="navigateTo('/profile')">Profile</p>
                    <p @click="logout()" v-if="user">Logout</p>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
const langCur = useLangCurrencyStore();
const langCurrencyPickerVisible = ref(false);
const profileIsShown = ref(false)
const siteConfigs = ref<HTMLElement | null>(null);
const profileButton = ref<HTMLElement | null>(null);
const client = useSupabaseClient()
const user = useSupabaseUser()
const route = useRoute()


const toggleLangCurrencyPicker = () => {
    langCurrencyPickerVisible.value = !langCurrencyPickerVisible.value;
};

const handleClickOutside = (event: MouseEvent) => {
    if (siteConfigs.value && !siteConfigs.value?.contains(event.target as Node)) {
        langCurrencyPickerVisible.value = false;
    }
    if (profileButton.value && !profileButton.value?.contains(event.target as Node)) {
        profileIsShown.value = false;
    }
};
const logout = async () => {
    const { error } = await client.auth.signOut()
    navigateTo('/')
    console.log('error', error)
}

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
    font-weight: bold;

    #siteInfo {
        display: flex;
        gap: 40px;
        align-items: center;
        height: 100%;
        font-weight: bold;

        #logo {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
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
                    max-width: 45px;
                }
            }

            #langCurrencyPicker {
                position: absolute;
                min-width: 250px;
                height: max-content;
                top: 100%;
                right: 0;
                padding: 0;
                background-color: rgba(255, 255, 255, 0.608);
                backdrop-filter: blur(5px);
                border: 0;
                border-radius: 10px 0 10px 10px;
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
                    border-radius: 0;
                    overflow: hidden;
                    transition: 200ms;
                    border-radius: 5px 0 0 5px;


                    p {
                        display: flex;
                        align-items: center;
                        padding-left: 20px;
                        width: 100%;
                        min-height: 45px;
                        height: 45px;
                        transition: 200ms;

                        &:hover {
                            background-color: rgb(184, 124, 113);
                        }

                        &.active {
                            background-color: rgb(123, 53, 41);
                            color: white;
                        }
                    }

                    &:nth-child(2) {
                        border: 0;
                        border-radius: 0 0 5px 0;
                        overflow: hidden;

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
            background-repeat: no-repeat;
            background-size: cover;
            cursor: pointer;
            position: relative;
            outline: 0px solid rgba(0, 0, 0, 0.278);
            transition: 100ms;

            &.active {
                outline: 3px solid rgba(0, 0, 0, 0.274);
            }

            div {
                z-index: 5;
                position: absolute;
                width: 120px;
                background-color: rgba(240, 240, 240, 0.111);
                backdrop-filter: blur(5px);
                border: 1px solid rgb(123, 53, 41);
                top: 120%;
                right: 0;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                p {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 40px;
                    transition: 200ms;
                    user-select: none;
                    color: rgba(255, 255, 255, 0.781);

                    &:hover {
                        background-color: rgb(123, 53, 41);
                    }
                }
            }
        }

    }
}
</style>
