import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DateField } from '@mui/x-date-pickers/DateField';
import TextField from '@mui/material/TextField';
import { getSettingRoute, updateSettingRoute, getEmptyRoomRoute, createSettingRoute } from '../API/APIRouter';
import dayjs from 'dayjs';
import { set } from 'date-fns';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function BasicModal({ handleClose, open, handleOpenSucessfull, setingID }) {
    const [setting, setSetting] = React.useState({});
    const [totalAvailable, setTotalAvailable] = React.useState(0);
    const settingId = setingID;
    const [firstYearValue, setFirstYearValue] = React.useState(0);
    //selectRoom is true false
    const [selectRoom, setSelectRoom] = React.useState(false);
    const [upperYearValue, setUpperYearValue] = React.useState(0);
    const [priorityValue, setPriorityValue] = React.useState(0);
    const [registrationStart, setRegistrationStart] = React.useState({ date: null, time: null });
    const [registrationEnd, setRegistrationEnd] = React.useState({ date: null, time: null });
    const [name, setName] = React.useState('');
    const [messageError, setMessageError] = React.useState('Đây là lỗi');
    const [isError, setIsError] = React.useState(false);
    const [allAvailable, setAllAvailable] = React.useState(0);

    // Fetch API data getEmptyRoomRoute
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${getEmptyRoomRoute}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setTotalAvailable(data.data);
                setAllAvailable(Number(data.data));
                setFirstYearValue(0);
                setUpperYearValue(0);
                setPriorityValue(0);
                console.log('Tổng số chỗ trống:', data.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${getSettingRoute}/${settingId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSetting(data.data);
                setTotalAvailable(data.data.totalAvailableSpots);
                setFirstYearValue(data.data.firstYearSpots);
                setUpperYearValue(data.data.upperYearSpots);
                setName(data.data.name);
                setPriorityValue(data.data.prioritySpots);
                setSelectRoom(data.data?.selectRoom ?? false);

                setAllAvailable(
                    Number(data.data.totalAvailableSpots) -
                    (Number(data.data.firstYearSpots) +
                        Number(data.data.upperYearSpots) +
                        Number(data.data.prioritySpots))
                );
                setRegistrationStart({
                    date: data.data.registrationStartDate.split('T')[0],
                    time: data.data.registrationStartDate.split('T')[1].split(':')[0] + ':' + data.data.registrationStartDate.split('T')[1].split(':')[1],
                });
                setRegistrationEnd({
                    date: data.data.registrationEndDate.split('T')[0],
                    time: data.data.registrationEndDate.split('T')[1].split(':')[0] + ':' + data.data.registrationEndDate.split('T')[1].split(':')[1],
                });
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        if (settingId) {
            fetchData();
        }
    }, [settingId]);


    React.useEffect(() => {
        const firstYear = Math.floor(firstYearValue);
        const upperYear = Math.floor(upperYearValue);
        const priority = Math.floor(priorityValue);
        const totalUsed = firstYear + upperYear + priority;
        setAllAvailable(totalAvailable - totalUsed);
        if (totalUsed > totalAvailable) {
            setMessageError('Tổng số chỗ trống không đủ');
            setIsError(true);
        } else {
            setMessageError('');
            setIsError(false);
        }
    }, [firstYearValue, upperYearValue, priorityValue, totalAvailable]);


    const handleStartDateChange = (newDate) => {
        setRegistrationStart((prev) => ({
            ...prev,
            date: newDate.format('YYYY-MM-DD'),
        }));
    };


    const handleEndDateChange = (newDate) => {
        setRegistrationEnd((prev) => ({
            ...prev,
            date: newDate.format('YYYY-MM-DD'),
        }));
    };

    const handleStartTimeChange = (newTime) => {
        if (newTime && newTime.isValid()) {
            setRegistrationStart((prev) => ({
                ...prev,
                time: newTime.format('HH:mm'),
            }));
        } else {
            console.error('Giá trị thời gian không hợp lệ:', newTime);
        }
    };

    const handleEndTimeChange = (newTime) => {
        if (newTime && newTime.isValid()) {
            setRegistrationEnd((prev) => ({
                ...prev,
                time: newTime.format('HH:mm'),
            }));
        } else {
            console.error('Giá trị thời gian không hợp lệ:', newTime);
        }
    };

    const handleUpdateSettings = async () => {
        if (!registrationStart.date || !registrationStart.time || !registrationEnd.date || !registrationEnd.time) {
            console.error('Ngày hoặc giờ không hợp lệ.');
            return;
        }

        const registrationStartDate = `${registrationStart.date}T${registrationStart.time}:00Z`;
        const registrationEndDate = `${registrationEnd.date}T${registrationEnd.time}:00Z`;

        const updatedSettings = {
            firstYearSpots: parseInt(firstYearValue, 10),
            upperYearSpots: parseInt(upperYearValue, 10),
            prioritySpots: parseInt(priorityValue, 10),
            registrationStartDate,
            registrationEndDate,
            name,
            selectRoom
        };

        console.log('Updated settings:', updatedSettings);

        try {
            const response = await fetch(`${updateSettingRoute}/${settingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            handleClose();
            handleOpenSucessfull();
            const data = await response.json();
            console.log('Cập nhật thành công:', data);
        } catch (error) {
            console.error('Cập nhật thất bại:', error);
        }
    };
    //createSettingRoute
    const hadleCreate = async () => {
        if (!registrationStart.date || !registrationStart.time || !registrationEnd.date || !registrationEnd.time) {
            console.error('Ngày hoặc giờ không hợp lệ.');
            return;
        }

        const registrationStartDate = `${registrationStart.date}T${registrationStart.time}:00Z`;
        const registrationEndDate = `${registrationEnd.date}T${registrationEnd.time}:00Z`;

        const updatedSettings = {
            firstYearSpots: parseInt(firstYearValue, 10),
            upperYearSpots: parseInt(upperYearValue, 10),
            prioritySpots: parseInt(priorityValue, 10),
            registrationStartDate,
            registrationEndDate,
            name,
            selectRoom
        };

        console.log('Created settings:', updatedSettings);

        try {
            const response = await fetch(`${createSettingRoute}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedSettings),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            handleClose();
            handleOpenSucessfull();
            const data = await response.json();
            console.log('Tạo thành công:', data);
        } catch (error) {
            console.error('Tạo thất bại:', error);
        }
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            CÀI ĐẶT ĐĂNG KÝ
                        </Typography>
                        <div>
                            Tổng số chỗ trống: {allAvailable}
                        </div>
                    </div>
                    <TextField
                        id="outlined-basic"
                        label="Học kỳ"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ width: '100%', marginTop: '10px' }}
                    />
                    <SwitchesGroup
                        setting={setting}
                        firstYearSpots={firstYearValue}
                        upperYearSpots={upperYearValue}
                        prioritySpots={priorityValue}
                        setFirstYearValue={setFirstYearValue}
                        setUpperYearValue={setUpperYearValue}
                        setPriorityValue={setPriorityValue}
                    />
                    <div style={{ marginTop: "10px" }}>
                        <div>Ngày mở đăng ký</div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px" }}>
                            <TimePickerViewRenderersStr
                                settingTimeStr={registrationStart.time}
                                onChange={handleStartTimeChange}
                            />
                            <DateFieldValueStr
                                settingDateStr={registrationStart.date}
                                onChange={handleStartDateChange}
                            />
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <div>Ngày đóng đăng ký</div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px" }}>
                            <TimePickerViewRenderersEnd
                                settingTimeEnd={registrationEnd.time}
                                onChange={handleEndTimeChange}
                            />
                            <DateFieldValueEnd
                                settingDateEnd={registrationEnd.date}
                                onChange={handleEndDateChange}
                            />
                        </div>
                    </div>
                    <RowRadioButtonsGroup selectRoom={selectRoom} setSelectRoom={setSelectRoom} />
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: '10px', alignItems: "center" }}>
                        <div style={{ color: "red", marginRight: '20px' }}>{messageError}</div>
                        <Button variant="outlined" color="error" onClick={handleClose} sx={{ marginRight: '10px' }}>Đóng</Button>
                        <Button
                            variant="contained"
                            onClick={settingId ? handleUpdateSettings : hadleCreate}
                            disabled={isError}
                            style={{ backgroundColor: isError ? '#EBEBEB' : undefined }}
                        >
                            Lưu cài đặt
                        </Button>
                    </div>

                </Box>
            </Modal>
        </div>
    );
}

export function SwitchesGroup({ setting, firstYearSpots, upperYearSpots, prioritySpots, setFirstYearValue, setUpperYearValue, setPriorityValue }) {
    const [state, setState] = React.useState({
        gilad: setting.firstYearSpots > 0,
        jason: setting.upperYearSpots > 0,
        antoine: setting.prioritySpots > 0,
    });

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <FormControl component="fieldset" variant="standard" style={{ width: "100%" }}>
            <FormGroup>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%", marginTop: "20px" }}>
                    <FormControlLabel
                        control={
                            <Switch checked={state.gilad} onChange={handleChange} name="gilad" />
                        }
                        label="Sinh viên năm nhất"
                    />
                    {state.gilad && (
                        <TextField
                            id="outlined-number-gilad"
                            label="Sinh viên"
                            type="number"
                            size="small"
                            value={firstYearSpots}
                            onChange={(e) => setFirstYearValue(e.target.value)}
                            sx={{
                                width: 90,
                                height: 40,
                                '.MuiInputBase-input': {
                                    height: '20px',
                                    padding: '10px 14px'
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%", marginTop: "20px" }}>
                    <FormControlLabel
                        control={
                            <Switch checked={state.jason} onChange={handleChange} name="jason" />
                        }
                        label="Sinh viên năm 2,3,4"
                    />
                    {state.jason && (
                        <TextField
                            id="outlined-number-jason"
                            label="Sinh viên"
                            type="number"
                            size="small"
                            value={upperYearSpots}
                            onChange={(e) => setUpperYearValue(e.target.value)}
                            sx={{
                                width: 90,
                                height: 40,
                                '.MuiInputBase-input': {
                                    height: '20px',
                                    padding: '10px 14px'
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%", marginTop: "20px" }}>
                    <FormControlLabel
                        control={
                            <Switch checked={state.antoine} onChange={handleChange} name="antoine" />
                        }
                        label="Ưu tiên"
                    />
                    {state.antoine && (
                        <TextField
                            id="outlined-number-antoine"
                            label="Sinh viên"
                            type="number"
                            size="small"
                            value={prioritySpots}
                            onChange={(e) => setPriorityValue(e.target.value)}
                            sx={{
                                width: 90,
                                height: 40,
                                '.MuiInputBase-input': {
                                    height: '20px',
                                    padding: '10px 14px'
                                }
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </div>
            </FormGroup>
        </FormControl>
    );
}

export function TimePickerViewRenderersStr({ settingTimeStr, onChange }) {
    const timeValue = dayjs(settingTimeStr, 'HH:mm');

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
                <TimePicker
                    label="Chọn giờ"
                    value={timeValue.isValid() ? timeValue : null}
                    onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                            onChange(newValue);
                        } else {
                            console.error('Giá trị thời gian không hợp lệ:', newValue);
                            onChange(null); // Đặt lại giá trị nếu không hợp lệ
                        }
                    }}
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}

export function TimePickerViewRenderersEnd({ settingTimeEnd, onChange }) {
    const timeValue = dayjs(settingTimeEnd, 'HH:mm');

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
                <TimePicker
                    label="Chọn giờ"
                    value={timeValue.isValid() ? timeValue : null}
                    onChange={(newValue) => {
                        if (newValue && newValue.isValid()) {
                            onChange(newValue);
                        } else {
                            console.error('Giá trị thời gian không hợp lệ:', newValue);
                            onChange(null);
                        }
                    }}
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock,
                        seconds: renderTimeViewClock,
                    }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}


export function DateFieldValueStr({ settingDateStr, onChange }) {
    const dateValue = dayjs(settingDateStr);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField']}>
                <DateField
                    label="Chọn ngày"
                    value={dateValue.isValid() ? dateValue : null}
                    onChange={(newValue) => onChange(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}


export function DateFieldValueEnd({ settingDateEnd, onChange }) {
    const dateValue = dayjs(settingDateEnd);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField']}>
                <DateField
                    label="Chọn ngày"
                    value={dateValue.isValid() ? dateValue : null}
                    onChange={(newValue) => onChange(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
export function RowRadioButtonsGroup({ selectRoom, setSelectRoom }) {
    return (
        <FormControl style={{ marginTop: "20px" }}>
            <FormLabel id="demo-row-radio-buttons-group-label">Sinh viên được chọn phòng</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={selectRoom ? "true" : "false"}
                onChange={(e) => setSelectRoom(e.target.value === "true")}
            >
                <FormControlLabel value="true" control={<Radio />} label="Được" />
                <FormControlLabel value="false" control={<Radio />} label="Không" />
            </RadioGroup>
        </FormControl>
    );
}
