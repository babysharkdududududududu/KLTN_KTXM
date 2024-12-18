// export const host = "http://14.225.211.35:8081/api/v1";
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
export const statistics = `${host}/rooms/statistics`;

//user
export const getAllUserRoute = `${host}/users`;
export const getUserByIdRoute = `${host}/users/id/`;
export const updateUserRoute = `${host}/users/`;
export const createUserRoute = `${host}/users/`;

//register room
export const registerRoomRoute = `${host}/contracts`;
//phòng trống
export const getEmptyRoomRoute = `${host}/rooms/getAvailableRooms`;

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
export const exportEquipmentRoute = `${host}/equipment/export`;
export const getEquipmentByRoomRoute = `${host}/equipment/room/`;


//seting
export const getSettingRoute = `${host}/setting`;
export const updateSettingRoute = `${host}/setting`;
export const createSettingRoute = `${host}/setting`;
export const pauseSettingRoute = `${host}/setting/pauseRegistration/`;
export const openSettingRoute = `${host}/setting/openRegistration/`;
export const getSettingIdRoute = `${host}/setting/is-open/`;
// pause payment 
export const pausePaymentRoute = `${host}/setting/pausePayment/`;
//get payment status
export const getPaymentStatusRoute = `${host}/setting/payment-status/`;

//Room
export const getAllRoomRoute = `${host}/rooms/?all=true`;
export const exportRoomRoute = `${host}/rooms/export`;


//submit form dorm
export const submitDormRoute = `${host}/dorm-submission`;

export const getDormSubmissionRoute = `${host}/dorm-submission`;
export const checkSubmit = `${host}/dorm-submission/exists`;
export const getBySettingId = `${host}/dorm-submission/setting`;
export const getDormSubmissionByUserId = `${host}/dorm-submission/user/`;
export const getDormSubmissionStatistical = `${host}/dorm-submission/`;

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

export const autoAsignRoom = `${host}/dorm-submission/auto-assign-rooms`;
// Router disciplines
export const createDisciplineRoute = `${host}/student-discipline`;

// set accepted to waiting payment
export const setAcceptedToWaitingPayment = `${host}/dorm-submission/awaiting-payment-all`;
export const getDisciplineRoute = `${host}/student-discipline`;

// Router for payment
export const getDormPaymentWithUserId = `${host}/dorm-payment`;

//router change room
export const changeRoomRoute = `${host}/dorm-submission/change-room`;
export const returnSuccessPayment = `${host}/dorm-payment/payment/callback`;
export const exportDormSubmission = `${host}/dorm-submission/export`;


//bill
export const getBillRoute = `${host}/dorm-bill/room`;
export const allBill = `${host}/dorm-bill/search`;
//create bill
export const createBillRoute = `${host}/dorm-bill/monthly`;
// statistical
export const getStatisticalDormRoute = `${host}/statistic/dorm-submission`;
export const getStatisticalRoomRoute = `${host}/statistic/available-room`;
export const getStatisticalEquipmentRoute = `${host}/statistic/maintenance`;
export const getStatisticalEquipment = `${host}/statistic/statistic`;
export const getPaymentNumber = `${host}/statistic/payment`;
// get name and id of submission
export const getSubmissionNameAndId = `${host}/dorm-submission`;
export const getSubmissionWithSettingIdAndUserId = `${host}/dorm-submission/search/`;



