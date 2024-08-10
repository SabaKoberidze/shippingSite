<template>
    <div id="filterContainer">
        <div id="filter">
            <div class="filterConfigs">
                <div id="clearFilter" @click="clearFilter">
                    ფილტრის გასუფთავება
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
import { ref } from 'vue';

const dropdownOptions = [
    { name: 'პირველი', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მეორე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მესამე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მეოთხე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მეხუთე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მეექვსე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მეშვიდე', options: ['ერთი', 'ორი', 'სამი'] },
    { name: 'მერვე', options: ['ერთი', 'ორი', 'სამი'] },
];
const dropdownRef = ref([]);

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
    margin-top: 2%;

    #filter {
        border-radius: 20px;
        height: 100%;
        width: 1000px;
        background-color: rgba(255, 255, 255, 0.159);
        position: relative;

        .filterConfigs {
            display: flex;
            justify-content: end;
            align-items: center;
            height: 50px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.446);
            color: rgba(255, 255, 255, 0.566);
            padding: 0 30px;

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