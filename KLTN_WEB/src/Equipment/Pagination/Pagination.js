import { Pagination as MuiPagination, Box } from '@mui/material';

const Pagination = ({ count, page, onPageChange }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 10, left: "45%" }}>
        <MuiPagination
            count={count}
            page={page}
            onChange={onPageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            siblingCount={1}
            boundaryCount={1}
        />
    </Box>
);

export default Pagination;
