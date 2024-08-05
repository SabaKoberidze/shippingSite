export const useLangCurrencyStore = defineStore('langCurrency', {
    state: () => {
      return {
        activeLanguage: 'ქართული',
        activeCurrency: '₾',
        langs: ['ქართული', 'русский', 'English'],
        currency: ['₾','₽','$']
      }
    },
})