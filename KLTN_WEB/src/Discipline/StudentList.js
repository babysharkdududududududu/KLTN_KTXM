import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Pagination } from '@mui/material';

const StudentList = ({ paginatedUsers, columns, currentPage, totalPages, setCurrentPage, searchTerm, setSearchTerm, setSelectedUser }) => {
    return (
        <Box sx={{ flex: 3, width: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TextField
                label="Tìm kiếm sinh viên theo tên hoặc mã"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{ mb: 1, '.MuiInputLabel-root': { fontWeight: 'bold' } }}
            />
            <DataGrid
                rows={paginatedUsers}
                columns={columns}
                pageSize={paginatedUsers.length}
                autoHeight
                hideFooter
                getRowId={(row) => row.userId}
                onRowClick={(params) => setSelectedUser(params.row)}
                sx={{ width: '100%', padding: '1px', borderRadius: '8px', backgroundColor: '#fcfcfc' }}
            />
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
                variant="outlined"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                sx={{ mt: 2 }}
            />
        </Box>
    );
};

export default StudentList;
