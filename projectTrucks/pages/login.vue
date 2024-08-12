<template>
    <div id="loginPageContainer">

        <div id="loginPage">
            <form @submit.prevent="() => (isSignUp ? signUp() : login())">
                <div id="inputsContaiener">
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
const googeSignin = async () => {
    const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
    })
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

</script>

<style scoped lang="scss">
#loginPageContainer {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;

    #loginPage {
        width: 400px;
        height: 400px;
        background-color: rgba(60, 190, 255, 0.067);
        border: 1px solid rgba(158, 197, 197, 0.645);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        padding: 20px;
        border-radius: 15px;

        form {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 50px;
            width: 100%;
            height: 300px;

            #inputsContaiener {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 30px;
                height: 60%;
                width: 100%;

                div {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                    gap: 7px;
                    width: 80%;

                    input {
                        width: 100%;
                        outline: 0;
                        border: 0;
                        height: 30px;
                        padding: 5px;
                        border-radius: 5px;
                        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.363);
                    }

                    label {
                        font-weight: bold;
                        color: rgb(159, 194, 218);
                    }
                }
            }


            button {
                width: 120px;
                height: 35px;
                border: 0;
                cursor: pointer;
                border-radius: 25px;
                background-color: rgb(161, 70, 54);
                font-weight: bold;
                box-shadow: 0px 5px 1px rgb(123, 53, 41);
                transition: 200ms;
                color: white;
                text-shadow: 0px 1px 2px rgba(67, 51, 51, 0.353);

                &:active {
                    transform: translateY(5px);
                    box-shadow: 0 0 0 rgb(123, 53, 41);
                }
            }
        }
    }

    #loginButtonContainer {
        width: 80%;
        height: 30px;
        display: flex;
        justify-content: center;

        button {

            border-radius: 30px;
            border: 0;
            height: 30px;
            width: 85%;
            background-color: rgba(115, 166, 182, 0.541);
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.422);
            cursor: pointer;

            span {
                color: white;
                width: 100%;
            }

            &:active {
                outline: 0;
            }
        }
    }
}
</style>