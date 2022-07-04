// Use type safe message keys with `next-intl`
type Messages = typeof import('./i18n/fr.json');
declare interface IntlMessages extends Messages {}