import i18n from 'react-native-i18n';
import en from './en';
import zh from './zh';

i18n.locale = 'en';
i18n.fallbacks = 'true';

i18n.translations = {
    en,
    zh
}

export default i18n;
