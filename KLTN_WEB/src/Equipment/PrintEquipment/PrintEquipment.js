// PrintButton.js
import React from 'react';
import { Button } from '@mui/material';
import QRCode from 'qrcode';

const PrintButton = ({ equipment }) => {
    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    };

    const generateQRCodeDataUrl = async (text) => {
        try {
            const url = await QRCode.toDataURL(text, { width: 100, margin: 1 });
            return url;
        } catch (err) {
            console.error(err);
            return '';
        }
    };

    const handlePrint = async () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Equipment Cards</title>');
        printWindow.document.write(`
            <style>
                body { font-family: Arial, sans-serif; }
                .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                .card-content { display: flex; justify-content: space-between; align-items: center; }
                .card-info { flex: 1; }
                .qr-code { margin-left: 20px; }
                h1 { text-align: center; }
                .card-container { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>Danh sách thiết bị</h1>');
        printWindow.document.write('<div class="card-container">');

        for (const equip of equipment) {
            const qrData = `
                Tên thiết bị: ${equip.name}
                Mã số: ${equip.equipNumber}
                Số phòng: ${equip.roomNumber}
                Ngày bắt đầu: ${new Date(equip.startDate).toLocaleDateString()}
            `.trim();
            const qrCodeUrl = await generateQRCodeDataUrl(qrData);

            printWindow.document.write(`
                <div class="card">
                    <div class="card-content">
                        <div class="card-info">
                            <p><strong>Tên thiết bị:</strong> ${escapeHtml(equip.name)}</p>
                            <p><strong>Mã số:</strong> ${escapeHtml(equip.equipNumber)}</p>
                            <p><strong>Phòng:</strong> ${escapeHtml(equip.roomNumber)}</p>
                            <p><strong>Ngày bắt đầu:</strong> ${new Date(equip.startDate).toLocaleDateString()}</p>
                        </div>
                        <div class="qr-code">
                            <img src="${qrCodeUrl}" alt="QR Code" style="width: 100px; height: 100px;" />
                        </div>
                    </div>
                </div>
            `);
        }

        printWindow.document.write('</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <Button variant="contained" color="primary" onClick={handlePrint} sx={{ marginBottom: '10px' }}>
            In danh sách thiết bị
        </Button>
    );
};

export default PrintButton;
