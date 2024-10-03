<template>
    <div id="filterContainer">
        <div id="filter">
            <div class="filterConfigs">
                <div id="buyRent" :class="{ active: isBuy }">ყიდვა<button @click="toggleBuyRent"></button>ქირაობა</div>
                <div id="clearFilter" @click="clearFilter">
                    გასუფთავება
                </div>
            </div>
            <div class="filterDropdowns">
                <div class="filterComponent" v-for="(option, index) in dropdownOptions" :key="index">
                    <dropDownComponent ref="dropdownRef" :options="option.options" :dropdown-name="option.name" />
                </div>
            </div>
        </div>
        <div class="search">ძებნა</div>
    </div>
</template>
<script lang="ts" setup>

const dropdownOptions = [
    { name: 'კატეგორია', options: ['გამწევი', 'სატვირთო', 'თვითმცვლელი', 'სასოფლო-სამეურნეო', 'ამწე', 'ექსკავატორი', 'სპეც ტექნიკა', 'სატკეპნი'] },
];
const dropdownRef = ref([]);
const isBuy = ref(true);

const toggleBuyRent = () => {
    isBuy.value = !isBuy.value
}
const clearFilter = () => {
    dropdownRef.value.forEach((dropdown: any) => {
        dropdown.clearSelection()
    })
};
</script>
<style lang="scss" scoped>
#filterContainer {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 45px;
    padding: 0 10px;

    #filter {
        border-radius: 20px;
        height: 100%;
        width: 1000px;
        background-color: rgba(65, 62, 62, 0.197);
        border: 1px solid rgb(123, 53, 41);
        position: relative;

        .filterConfigs {
            display: flex;
            justify-content: end;
            align-items: center;
            height: 50px;
            border-bottom: 1px solid rgb(123, 53, 41);
            color: rgba(255, 255, 255, 0.566);
            padding: 0 4%;
            position: relative;

            #buyRent {
                position: absolute;
                left: 3%;
                display: flex;
                height: 100%;
                gap: 10px;
                align-items: center;

                button {
                    width: 40px;
                    height: 20px;
                    border-radius: 10px;
                    border: 0;
                    outline: 0;
                    cursor: pointer;
                    position: relative;
                    background-color: transparent;
                    outline: 2px solid rgba(255, 255, 255, 0.435);

                    &::before {
                        content: '';
                        position: absolute;
                        background-color: rgb(164, 68, 51);
                        top: 0;
                        left: 0;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        border: 5px rgb(69, 38, 16) solid;
                        transition: 200ms;
                    }
                }

                &.active {
                    button {
                        &::before {
                            left: calc(100% - 20px);
                        }
                    }
                }
            }

            #clearFilter {
                cursor: pointer;
                transition: 200ms;

                &:hover {
                    color: white;
                }
            }
        }

        .filterDropdowns {
            width: 100%;
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
            gap: 5px;

            .filterComponent {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                border-radius: 8px;
                height: 70px;
            }
        }



    }

    .search {
        position: absolute;
        top: 100%;
        color: white;
        background-color: rgba(255, 77, 0, 0.342);
        width: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 0 0 15px 15px;
        cursor: pointer;
        height: 35px;
        transition: 200ms;

        &:hover {
            height: 50px;
            background-color: rgba(255, 106, 0, 0.824);
        }
    }


}
</style>