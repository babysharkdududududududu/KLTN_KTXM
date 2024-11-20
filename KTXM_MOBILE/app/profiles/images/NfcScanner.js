import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import NFCService from '../../nfc/NfcManager';

const NfcScanner = () => {
    const [tag, setTag] = useState(null);

    const handleScanNFC = async () => {
        const scannedTag = await NFCService.scanTag();
        if (scannedTag) {
            setTag(scannedTag);
            Alert.alert("Đã phát hiện thẻ NFC", JSON.stringify(scannedTag));
        } else {
            Alert.alert("Không phát hiện thẻ NFC");
        }
    };

    useEffect(() => {
        NFCService.init();
        return () => {
            // Hủy bỏ công nghệ NFC khi component bị hủy
            NFCManager.stop();
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>NFC Scanner</Text>
            <Button title="Quét thẻ NFC" onPress={handleScanNFC} />
            {tag && <Text>Thẻ NFC: {JSON.stringify(tag)}</Text>}
        </View>
    );
};

export default NfcScanner;
