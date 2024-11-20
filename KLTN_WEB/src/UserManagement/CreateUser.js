import React, { useEffect, useState } from 'react';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Container, Typography, Paper, Grid, Pagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { createUserRoute, getAllUserRoute } from '../API/APIRouter';
import * as go from 'gojs';
import * as  d3 from 'd3';
import './UserManagement.css';

const UserManagementTemplate = () => {
    const [userId, setUserId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [image, setImage] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;



    useEffect(() => {
        handleGetAllUser();
    }, []);

    const handleGetAllUser = async () => {
        try {
            const response = await axios.get(getAllUserRoute);
            const fetchedUsers = response.data.data
                .filter(user => user.role !== "USERS")
                .map(user => ({
                    ...user,
                    id: user.userId,
                }));

            setUsers(fetchedUsers);
            console.log('Fetched users:', fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        if (users.length > 0) {
            drawDiagram(users);
        }
    }, [users]);

    const drawDiagram = (users) => {
        const width = 1200;
        const height = 200;

        // Clear previous SVG if it exists
        d3.select("#myDiagramDiv").select("svg").remove();

        const svg = d3.select("#myDiagramDiv")
            .append("svg")
            .attr("width", width)
            .attr("height", height + 200);

        const tree = d3.tree().size([width - 100, height + 50]);
        const root = d3.hierarchy(generateTreeData(users));

        tree(root);

        svg.selectAll(".link")
            .data(root.links())
            .enter().append("path")
            .attr("class", "link")
            .attr("d", d => `
                M${d.source.x},${d.source.y}
                V${(d.source.y + d.target.y) / 2}
                H${d.target.x}
                V${d.target.y}
            `)
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-width", 2);

        // Draw nodes with images and circles
        const node = svg.selectAll(".node")
            .data(root.descendants())
            .enter().append("g")
            .attr("class", d => `node ${d.children ? "node--internal" : "node--leaf"}`)
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // Add circles for each node with hover effects
        node.append("circle")
            .attr("r", 25)
            .style("fill", d => d.children ? "#4CAF50" : "#FFC107")
            .style("stroke", "black")
            .style("stroke-width", 1)
            .on("mouseover", function () {
                d3.select(this).transition().duration(200).attr("r", 30);
            })
            .on("mouseout", function () {
                d3.select(this).transition().duration(200).attr("r", 25);
            });

        // Add avatar images
        node.append("image")
            .attr("xlink:href", d => d.data.image)
            .attr("x", -20)
            .attr("y", -20)
            .attr("width", 40)
            .attr("height", 40)
            .attr("clip-path", "circle(20px at 20px 20px)");

        // Add labels with roles
        node.append("text")
            .attr("dy", 40)
            .attr("x", 0)
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(d => `${d.data.name} (${d.data.role})`);
    };

    const generateTreeData = (users) => {
        const tree = {
            name: 'Organization Chart',
            children: []
        };
        const managers = [];
        const subordinates = [];
        users.forEach(user => {
            if (user.role === 'MANAGER') {
                managers.push({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                    children: []
                });
            } else if (['CASHIER', 'TECHNICIAN'].includes(user.role)) {
                subordinates.push({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    image: user.image,
                });
            }
        });

        managers.forEach(manager => {
            manager.children = [...subordinates];
        });

        tree.children = managers;

        return tree;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(createUserRoute, { userId, name, email, password, role });
            console.log('Response data:', response.data);
            const newUser = { ...response.data, id: response.data.userId || userId };
            setUsers((prevUsers) => [...prevUsers, newUser]);
            alert("User created successfully!");
        } catch (error) {
            console.error("Error creating user:", error.response?.data || error.message);
        }
    };


    const paginatedUsers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(users.length / pageSize);

    const columns = [
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'phone', headerName: 'Phone', width: 130 },
    ];

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4, display: 'flex', flexDirection: { xs: 'column', md: 'column' }, gap: 2, paddingBottom: 10 }}>
            <div id="myDiagramDiv"></div>
            <div style={{ marginTop: -100, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, flex: 1, maxWidth: '500px' }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                        Quản lý Người dùng
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Mã nhân viên" variant="outlined" fullWidth value={userId} onChange={(e) => setUserId(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Họ tên" variant="outlined" fullWidth value={name} onChange={(e) => setName(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Email" variant="outlined" fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Mật khẩu" variant="outlined" fullWidth type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Số điện thoại" variant="outlined" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Địa chỉ" variant="outlined" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Năm sinh" type="date" variant="outlined" fullWidth value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Giới tính</InputLabel>
                                    <Select value={gender} onChange={(e) => setGender(e.target.value)} label="Gender">
                                        <MenuItem value="Nam">Nam</MenuItem>
                                        <MenuItem value="Nữ">Nữ</MenuItem>
                                        <MenuItem value="Khác">Khác</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField label="Link ảnh" variant="outlined" fullWidth value={image} onChange={(e) => setImage(e.target.value)} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Vai trò</InputLabel>
                                    <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role">
                                        <MenuItem value="MANAGER">Quản lý</MenuItem>
                                        <MenuItem value="CASHIER">Thu ngân</MenuItem>
                                        <MenuItem value="TECHNICIAN">Thợ bảo trì</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, backgroundColor: 'primary.main', color: 'white' }}>
                            Tạo Người dùng
                        </Button>
                    </form>
                </Paper>

                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
                        Danh sách Người dùng
                    </Typography>
                    <div style={{ flex: 1 }}>
                        <DataGrid
                            rows={paginatedUsers}
                            columns={columns}
                            pageSize={pageSize}
                            rowsPerPageOptions={[pageSize]}
                            disableSelectionOnClick
                            getRowId={(row) => row.id}
                            hideFooter
                            style={{ height: '100%' }}
                        />
                    </div>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(event, page) => setCurrentPage(page)}
                        color="primary"
                        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
                    />
                </Paper>
            </div>
        </Container>
    );
};

export default UserManagementTemplate;
