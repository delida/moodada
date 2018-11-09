import i18n from 'react-native-i18n';
import en from './en';
import zh from './zh';
import RNLanguages from 'react-native-languages';

device_language = RNLanguages.language;
i18n.locale = device_language == 'en-US'?'en':'zh';
i18n.fallbacks = 'true';

//console.error(RNLanguages.language)
i18n.translations = {
    en,
    zh
}

export default i18n;
