// export const host = "http://localhost:8081/api/v1";
export const host = process.env.REACT_APP_API_HOST;

console.log('API Host:', host);

// Auth
export const loginRoute = `${host}/auth/login`;
export const registerRoute = `${host}/auth/register`;

//Notification
export const getNotificationRoute = `${host}/notification/get-all`;
export const createNotificationRoute = `${host}/notification/create`;
export const deleteNotificationRoute = `${host}/notification/delete`;

//Room
export const getRoomRoute = `${host}/rooms`;
export const createRoomRoute = `${host}/rooms/`;
export const getRoomByIdRoute = `${host}/rooms/`;
export const updateRoomRoute = `${host}/rooms/`;

//user
export const getAllUserRoute = `${host}/users`;
export const getUserByIdRoute = `${host}/users/id/`;

//register room
export const registerRoomRoute = `${host}/contracts`;

//contract
export const getContractRoute = `${host}/contracts`;
export const deleteContractRoute = `${host}/contracts/`;
// export const getUserAndRoomContractRoute = `${host}/contracts/:userId/room`;
export const getUserAndRoomContractRoute = `${host}/contracts/`;

//maintenance
export const getMaintenanceRoute = `${host}/maintenance`;
export const createMaintenanceRoute = `${host}/maintenance`;
export const updateMaintenanceStatusRoute = `${host}/maintenance`;

//import 
export const importUserRoute = `${host}/users/import`;
export const checkUserRoute = `${host}/users/check-users`;
export const importRoomRoute = `${host}/rooms/import`;
export const importEquipmentRoute = `${host}/equipment/import`;

//equipment
export const getEquipmentRoute = `${host}/equipment`;
export const getAllEquipmentRoute = `${host}/equipment/`;
export const updateLocationEquipmentRoute = `${host}/equipment`;


//seting
export const getSettingRoute = `${host}/setting`;
export const updateSettingRoute = `${host}/setting`;


//submit form dorm
export const submitDormRoute = `${host}/dorm-submission`;
export const getDormSubmissionRoute = `${host}/dorm-submission`;
export const checkSubmit = `${host}/dorm-submission/exists`;
export const getBySettingId = `${host}/dorm-submission/setting`;

// status of submit
// Router cho trạng thái đã chấp nhận
export const updateStatusPending = `${host}/dorm-submission/accept`;

// Router cho trạng thái đã từ chối
export const updateStatusRejected = `${host}/dorm-submission/reject`;

// Router cho trạng thái đang chờ thanh toán
export const updateStatusAwaitingPayment = `${host}/dorm-submission/awaiting-payment`;

// Router cho trạng thái đã thanh toán
export const updateStatusPaid = `${host}/dorm-submission/paid`;

// Router cho trạng thái đã xếp phòng
export const updateStatusRoomAssigned = `${host}/dorm-submission/room-assigned`;
