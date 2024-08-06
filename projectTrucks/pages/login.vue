<template>
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
            <button type="submit" value="Submit">
                <span v-if="isSignUp"> Sign up </span>
                <span v-else> Log in </span>
            </button>
        </form>
        <button @click="isSignUp = !isSignUp">
            <span v-if="isSignUp"> Have an account? Log in instead</span>
            <span v-else> Create a new account </span>
        </button>
    </div>
</template>

<script lang="ts" setup>
const email = ref('')
const password = ref('')
const isSignUp = ref(true)
const client = useSupabaseClient()

const signUp = async () => {
    const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value
    })
    console.log('user', data)
    console.log('error', error)
}
const login = async () => {
    const { data, error } = await client.auth.signUp({
        email: email.value,
        password: password.value
    })
    console.log('user', data)
    console.log('error', error)
}
const user = useSupabaseUser()
</script>

<style scoped lang="scss">
#loginPage {
    width: 250px;
    height: 250px;
    background-color: rgba(255, 255, 255, 0.42);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;

    form {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
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
    }
}
</style>