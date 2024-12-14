import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  FormControl,
  Select,
  Typography,
  Alert,
  CircularProgress,
  Chip,
  styled
} from "@mui/material";
import { FaFileInvoiceDollar } from "react-icons/fa";
import {allBill} from '../API/APIRouter';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: "bold",
  "&:hover": {
    cursor: "pointer",
    backgroundColor: theme.palette.primary.dark,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const TableOfBill = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    roomNumber: "", // Mặc định để trống
    status: "", // Mặc định để trống (lấy tất cả)
    billType: "", // Mặc định để trống (lấy tất cả)
    monthAndYear: "", // Mặc định để trống (lấy tất cả)
    season: "", // Mặc định để trống (lấy tất cả)
  });

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      const { roomNumber, status, billType, monthAndYear, season } = filters;
      const url = `${allBill}?roomNumber=${roomNumber}&status=${status}&billType=${billType}&monthAndYear=${monthAndYear}&season=${season}`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (response.ok) {
          setBills(result.data); // Cập nhật với dữ liệu từ API
        } else {
          setError(result.message || "Failed to fetch bills.");
        }
      } catch (err) {
        setError("Failed to fetch bills. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [filters]); // Gọi lại API khi filters thay đổi

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width: "98%", p: 1 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <FaFileInvoiceDollar /> Hóa đơn
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Số phòng"
          name="roomNumber"
          value={filters.roomNumber}
          onChange={handleFilterChange}
          size="small"
        />
        <FormControl size="small">
          <Select
            value={filters.status}
            name="status"
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            <MenuItem value="Unpaid">Chưa thanh toán</MenuItem>
            <MenuItem value="Paid">Đã thanh toán</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={filters.billType}
            name="billType"
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Tất cả loại hóa đơn</MenuItem>
            <MenuItem value="WATER">Nước</MenuItem>
            <MenuItem value="ELECTRIC">Điện</MenuItem>
            {/* Thêm các loại hóa đơn khác nếu cần */}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={filters.monthAndYear}
            name="monthAndYear"
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Tất cả tháng</MenuItem>
            <MenuItem value="11/2024">Tháng 11/2024</MenuItem>
            {/* Thêm các tháng khác nếu cần */}
          </Select>
        </FormControl>
        <FormControl size="small">
          <Select
            value={filters.season}
            name="season"
            onChange={handleFilterChange}
            displayEmpty
          >
            <MenuItem value="">Tất cả mùa</MenuItem>
            <MenuItem value="W2024">Mùa Đông 2024</MenuItem>
            <MenuItem value="S2024">Mùa Hè 2024</MenuItem>
            {/* Thêm các mùa khác nếu cần */}
          </Select>
        </FormControl>
      </Box>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="bill management table">
            <TableHead>
              <TableRow>
                <StyledTableCell>MÃ HĐ</StyledTableCell>
                <StyledTableCell>TỔNG TIỀN</StyledTableCell>
                <StyledTableCell>NGÀY TẠO HĐ</StyledTableCell>
                <StyledTableCell>PHÒNG</StyledTableCell>
                <StyledTableCell>TRẠNG THÁI</StyledTableCell>
                <StyledTableCell>LOẠI HĐ</StyledTableCell>
                <StyledTableCell>THÁNG</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((bill) => (
                  <StyledTableRow key={bill._id} tabIndex={-1}>
                    <TableCell>{bill.code}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(bill.amount)}
                    </TableCell>

                    <TableCell>{new Date(bill.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{bill.roomNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={bill.status}
                        color={bill.status === "Paid" ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{bill.billType}</TableCell>
                    <TableCell>{bill.monthAndYear}</TableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bills.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default TableOfBill;
