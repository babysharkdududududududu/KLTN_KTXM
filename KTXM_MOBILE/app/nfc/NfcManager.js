// app/nfc/NfcManager.js
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

class NFCService {
    static async init() {
        await NfcManager.start();
    }

    static async scanTag() {
        try {
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();
            return tag;
        } catch (error) {
            console.error("Lỗi khi quét thẻ NFC:", error);
        } finally {
            NfcManager.cancelTechnologyRequest();
        }
    }
}

export default NFCService;
