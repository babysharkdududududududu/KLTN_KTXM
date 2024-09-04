export const host = "http://localhost:8081/api/v1";
// export const host = process.env.REACT_APP_API_HOST;


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


//seting
export const getSettingRoute = `${host}/setting`;
export const updateSettingRoute = `${host}/setting`;


