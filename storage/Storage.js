import AsyncStorage from '@react-native-async-storage/async-storage';

const Storage = {
    getItem: (key) => {
        try {
            return AsyncStorage.getItem(key);
        } catch (e) {
            return null;
        }
    },
    setItem: (key, data) => {
        try {
            AsyncStorage.setItem(key, data);
        } catch (e) {

        }
    },
    removeItem: (key) => {
        try {
            return AsyncStorage.removeItem(key);
        } catch (e) {
            return null;
        }
    },
    clearAllData() {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => console.log('success'));
    }
}

export default Storage;