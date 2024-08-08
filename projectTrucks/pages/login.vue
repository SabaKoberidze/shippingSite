<template>
    <div id="loginPageContainer">

        <div id="loginPage">
            <form @submit.prevent="() => (isSignUp ? signUp() : login())">
                <div>
                    <label for="Email">Email</label>
                    <input id="Email" type="text" v-model="email">
                </div>
                <div>
                    <label for="password">Password</label>
                    <input id="password" type="password" v-model="password">
                </div>
                <div v-if="isSignUp">
                    <label for="newPassword">New password</label>
                    <input id="newPassword" type="password" v-model="newPassword">
                </div>
                <button type="submit" value="Submit">
                    <span v-if="isSignUp"> Sign up </span>
                    <span v-else> Log in </span>
                </button>
            </form>
            <div id="loginButtonContainer">
                <button @click="isSignUp = !isSignUp">
                    <span v-if="isSignUp"> Have an account? Log in instead</span>
                    <span v-else> Create a new account </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth']
})
const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const newPassword = ref('')
const isSignUp = ref(false)

const signUp = async () => {
    if (newPassword.value === password.value) {
        const { data, error } = await client.auth.signUp({
            email: email.value,
            password: password.value
        })
        if (data.user) {
            navigateTo('/profile')
        }
        console.log('user', data)
        console.log('error', error)
    }
}
const login = async () => {
    const { data, error } = await client.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })
    if (data.user) {
        navigateTo('/profile')
    }
    console.log('user', data)
    console.log('error', error)
}

//const user = useSupabaseUser()
</script>

<style scoped lang="scss">
#loginPageContainer {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    #loginPage {
        width: 300px;
        height: 300px;
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 0px 20px rgba(84, 211, 211, 0.801);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px;
        border-radius: 15px;

        form {
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            gap: 10px;
            height: 100%;

            div {
                display: flex;
                flex-direction: column;
                gap: 5px;

                input {
                    width: 100%;
                }
            }

            button {
                min-width: 60px;
                width: min-content;
                height: 30px;
                border: 0;
                cursor: pointer
            }
        }
    }

    #loginButtonContainer {
        width: 100%;
        height: 25px;
        display: flex;
        justify-content: center;

        button {
            border-radius: 30px;
            border: 0;
            height: 25px;
            width: 85%;
            background-color: rgba(143, 209, 230, 0.541);
            cursor: pointer;

            span {
                width: 100%;
            }

            &:active {
                outline: 0;
            }
        }
    }
}
</style>