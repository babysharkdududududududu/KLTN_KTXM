import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, TextField, Select, MenuItem, InputLabel, FormControl, Typography, Card, CardContent, Grid, Box } from '@mui/material';
import QRCode from 'qrcode';

const PrintButton = ({ equipment }) => {
    const [selectedEquipments, setSelectedEquipments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEquipmentName, setSelectedEquipmentName] = useState('');

    const escapeHtml = (text) => {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
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

    // const handlePrint = async () => {
    //     const printWindow = window.open('', '', 'height=600,width=800');
    //     printWindow.document.write('<html><head><title>Equipment Cards</title>');
    //     printWindow.document.write(`
    //         <style>
    //             body { font-family: Arial, sans-serif; background-color: #f9f9f9; }
    //             .card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin: 16px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background-color: #fff; }
    //             .card-content { display: flex; justify-content: space-between; align-items: center; }
    //             .card-info { flex: 1; }
    //             .qr-code { margin-left: 20px; }
    //             h1 { text-align: center; color: #333; }
    //             .card-container { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; }
    //         </style>
    //     `);
    //     printWindow.document.write('</head><body>');
    //     printWindow.document.write('<h1>Danh sách thiết bị</h1>');
    //     printWindow.document.write('<div class="card-container">');

    //     for (const equip of selectedEquipments) {
    //         const qrData = `
    //             Tên thiết bị: ${equip.name}
    //             Mã số: ${equip.equipNumber}
    //             Số phòng: ${equip.roomNumber}
    //             Ngày bắt đầu: ${new Date(equip.startDate).toLocaleDateString()}
    //         `.trim();
    //         const qrCodeUrl = await generateQRCodeDataUrl(qrData);

    //         printWindow.document.write(`
    //             <div class="card">
    //                 <div class="card-content">
    //                     <div class="card-info">
    //                         <p><strong>Tên thiết bị:</strong> ${escapeHtml(equip.name)}</p>
    //                         <p><strong>Mã số:</strong> ${escapeHtml(equip.equipNumber)}</p>
    //                         <p><strong>Phòng:</strong> ${escapeHtml(equip.roomNumber)}</p>
    //                         <p><strong>Ngày bắt đầu:</strong> ${new Date(equip.startDate).toLocaleDateString()}</p>
    //                     </div>
    //                     <div class="qr-code">
    //                         <img src="${qrCodeUrl}" alt="QR Code" style="width: 100px; height: 100px;" />
    //                     </div>
    //                 </div>
    //             </div>
    //         `);
    //     }

    //     printWindow.document.write('</div>');
    //     printWindow.document.write('</body></html>');
    //     printWindow.document.close();
    //     printWindow.focus();
    //     printWindow.print();
    // };
    const handlePrint = async () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Equipment Cards</title>');

        // Thêm CSS để in ở hướng ngang
        printWindow.document.write(`
            <style>
                @media print {
                    @page {
                        size: landscape;
                    }
                }
                .card-container {
                    display: flex;
                    flex-wrap: wrap;
                }
                .card {
                    width: 300px;
                    margin: 10px;
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                .card-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .card-info {
                    flex: 1;
                }
                .qr-code {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 0 0 100px;
                }
                    .qr-code img {
                    border: 2px solid #ddd; /* Viền xung quanh mã QR */
                    border-radius: 4px;
                }
            </style>
        `);

        printWindow.document.write('</head><body>');
        printWindow.document.write('<div class="card-container">');

        const filteredSelectedEquipments = selectedEquipments.filter(equip =>
            equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            equip.equipNumber.toLowerCase().includes(searchTerm.toLowerCase())
        );

        for (const equip of filteredSelectedEquipments) {
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
                            <p><strong>Ngày kiểm tra:</strong> 
                                <span>Ngày: .......... </span>
                                <span>Tháng: .......... </span>
                                <span>Năm: .......... </span>
                            </p>
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




    const handleSelectEquipment = (equip) => {
        if (selectedEquipments.includes(equip)) {
            setSelectedEquipments(selectedEquipments.filter(item => item !== equip));
        } else {
            setSelectedEquipments([...selectedEquipments, equip]);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedEquipments(equipment);
        } else {
            setSelectedEquipments([]);
        }
    };

    const filteredEquipments = equipment.filter(equip =>
        equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equip.equipNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleSelectChange = (event) => {
        const selectedName = event.target.value;
        setSelectedEquipmentName(selectedName);
        // Only select the equipment if it's found in the filtered results
        const selectedEquips = filteredEquipments.filter(equip => equip.name === selectedName);
        setSelectedEquipments(selectedEquips);
    };

    const uniqueEquipmentNames = [...new Set(equipment.map(equip => equip.name))];

    return (
        <div style={{ width: '350px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <FormControl sx={{ flexGrow: 1, marginRight: '10px', width: '100%' }}>
                    <InputLabel id="select-equipment-label">Chọn nhóm thiết bị để in</InputLabel>
                    <Select labelId="select-equipment-label" value={selectedEquipmentName} onChange={handleSelectChange}>
                        <MenuItem value=""><em>Chọn nhóm thiết bị để in</em></MenuItem>
                        {uniqueEquipmentNames.map((name) => (
                            <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <FormControlLabel
                        control={<Checkbox checked={selectedEquipments.length === equipment.length} onChange={handleSelectAll} />}
                        label="Chọn tất cả"
                    />
                    <Button variant="contained" color="primary" onClick={handlePrint} sx={{ marginTop: '10px', width: '59%' }}>
                        In danh sách thiết bị
                    </Button>
                </Box>
            </Box>

        </div>
    );
};

export default PrintButton;
