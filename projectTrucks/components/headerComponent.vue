<template>
    <header>
        <div id="siteInfo">
            <div id="logo">LOGO</div>
            <div id="searchContainer">
                <div id="searchIcon">
                </div>
                <input placeholder="ძებნა">
            </div>
        </div>
        <div id="personalInfo">
            <div id="siteConfigs">
                <div>ქართული</div>
                <div>₾</div>
            </div>
            <div id="userPorfile"></div>
        </div>
    </header>
</template>
<script setup>

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
        gap: 20px;
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
        gap: 20px;
        height: 100%;
        align-items: center;

        #siteConfigs {
            display: flex;
            background-color: rgba(255, 255, 255, 0.903);
            justify-content: space-evenly;
            align-items: center;
            height: 60%;
            border-radius: 25px;
            border-right: solid 1px rgba(0, 0, 0, 0.357);

            div {
                height: 100%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                border-right: solid 1px rgba(0, 0, 0, 0.357);
                padding: 0 10px;

                &:last-child {
                    border: 0;
                    max-width: 20%;
                }
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