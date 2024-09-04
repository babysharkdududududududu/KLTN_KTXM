import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { DateField } from '@mui/x-date-pickers/DateField';

import TextField from '@mui/material/TextField';

import { getSettingRoute } from '../../API/APIRouter';

import dayjs from 'dayjs';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    //   border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
};

export default function BasicModal({ handleOpen, handleClose, open }) {
    const [setting, setSetting] = React.useState({});
    const [totalAvailable, setTotalAvailable] = React.useState(0);
    const settingId = "66d567a0ebb9cd93566389a9";

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
                console.log("adfasdf", data.data.totalAvailableSpots);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };

        fetchData();
    }, [settingId])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div style={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between"}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            CÀI ĐẶT ĐĂNG KÝ
                        </Typography>
                        <div>
                            Tổng số chỗ trống: {totalAvailable}
                        </div>
                    </div>
                    <SwitchesGroup setting={setting} />
                    <div style={{ marginTop: "10px" }}>
                        <div>Ngày mở đăng ký</div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px" }}>
                            <TimePickerViewRenderersStr settingTimeStr={setting.registrationStartDate} />
                            <DateFieldValueStr settingDateStr={setting.registrationStartDate} />
                        </div>
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <div>Ngày đóng đăng ký</div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "5px" }}>
                            <TimePickerViewRenderersEnd settingTimeEnd={setting.registrationEndDate} />
                            <DateFieldValueEnd settingDateEnd={setting.registrationEndDate} />
                        </div>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-end", marginTop: '10px' }}>
                        <Button variant="contained">Lưu cài đặt</Button>
                    </div>

                </Box>

            </Modal>
        </div>
    );
}

export function SwitchesGroup({ setting }) {
    const [state, setState] = React.useState({
        gilad: setting.firstYearSpots > 0,
        jason: setting.upperYearSpots > 0,
        antoine: setting.prioritySpots > 0,
    });

    const [firstYearValue, setFirstYearValue] = React.useState(setting.firstYearSpots);
    const [upperYearValue, setUpperYearValue] = React.useState(setting.upperYearSpots);
    const [priorityValue, setPriorityValue] = React.useState(setting.prioritySpots);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const handleFirstYearChange = (event) => {
        setFirstYearValue(event.target.value);
    };

    const handleUpperYearChange = (event) => {
        setUpperYearValue(event.target.value);
    };

    const handlePriorityChange = (event) => {
        setPriorityValue(event.target.value);
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
                            value={firstYearValue}
                            onChange={handleFirstYearChange}
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
                            value={upperYearValue}
                            onChange={handleUpperYearChange}
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
                            value={priorityValue}
                            onChange={handlePriorityChange}
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

export function TimePickerViewRenderersStr({ settingTimeStr }) {
    const timeValue = dayjs(settingTimeStr);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
                <TimePicker
                    label="Chọn giờ"
                    value={timeValue}
                    onChange={(newValue) => console.log(newValue)}
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


export function DateFieldValueStr({ settingDateStr }) {
    const dateValue = dayjs(settingDateStr);
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField']}>
                <DateField
                    label="Chọn ngày"
                    value={dateValue}
                    onChange={(newValue) => console.log(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}



export function TimePickerViewRenderersEnd({ settingTimeEnd }) {
    const timeValue = dayjs(settingTimeEnd);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
                <TimePicker
                    label="Chọn giờ"
                    value={timeValue}
                    onChange={(newValue) => console.log(newValue)}
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

export function DateFieldValueEnd({ settingDateEnd }) {
    const dateValue = dayjs(settingDateEnd);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateField']}>
                <DateField
                    label="Chọn ngày"
                    value={dateValue}
                    onChange={(newValue) => console.log(newValue)}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}