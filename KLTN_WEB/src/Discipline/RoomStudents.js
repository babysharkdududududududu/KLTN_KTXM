import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Pagination } from '@mui/material';

const RoomStudents = ({ listStudents, columns, setSelectedUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5); // Set default page size for students in each room

    // Effect to filter students when search term changes
    useEffect(() => {
        const filtered = Object.keys(listStudents).reduce((acc, room) => {
            const studentsInRoom = listStudents[room].filter(
                (student) =>
                    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    student.userId.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (studentsInRoom.length > 0 || searchTerm === '') {
                acc[room] = studentsInRoom;
            }

            return acc;
        }, {});

        setFilteredStudents(filtered);
        setCurrentPage(1); // Reset to page 1 when search term changes
    }, [searchTerm, listStudents]);

    // Handle search input change
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    // Get total number of rooms to display and paginate them
    const roomNumbers = Object.keys(filteredStudents);
    const totalPages = Math.ceil(roomNumbers.length / pageSize);

    // Paginate rooms
    const paginatedRooms = roomNumbers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ flex: 3, width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                label="Tìm kiếm sinh viên theo mã hoặc tên"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearch}
                fullWidth
                sx={{ mb: 2 }}
            />

            {paginatedRooms.length > 0 ? (
                paginatedRooms.map((roomNumber) => (
                    <Box
                        key={roomNumber}
                        sx={{
                            mt: 2,
                            width: '100%',
                            height: '400px', // Fixed height for each room
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Phòng {roomNumber}
                        </Typography>
                        <DataGrid
                            rows={filteredStudents[roomNumber] || []}
                            columns={columns}
                            pageSize={5} // Number of students per page within each room
                            autoHeight={false}
                            hideFooter={true}
                            getRowId={(row) => row.userId}
                            onRowClick={(params) => setSelectedUser(params.row)}
                            sx={{
                                flexGrow: 1,
                                borderRadius: '8px',
                                backgroundColor: '#fcfcfc',
                                '& .MuiDataGrid-root': {
                                    height: 'calc(100% - 48px)', // Subtract header height
                                },
                            }}
                        />
                    </Box>
                ))
            ) : (
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Không có sinh viên nào phù hợp.
                </Typography>
            )}

            {/* Pagination for rooms */}
            {roomNumbers.length > pageSize && (
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    sx={{ mt: 2 }}
                />
            )}
        </Box>
    );
};

export default RoomStudents;
