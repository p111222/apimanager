import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useQuery } from 'react-query';
import { makeRequest } from '../Axios';

const ApiDashboardTable = () => {


    const { data: apiData, error: apiDataError, isLoading: apiDataLoading } = useQuery(
        ['apiData'],
        async () => {
            // console.log("prince");

            const response = await makeRequest.get("/getAll");
            console.log(response.data);

            return response.data;
        },
    );

    if (apiDataLoading) return <div>Loading...</div>;
    if (apiDataError) return <div>Error fetching data</div>;

    return (
        <div>
            <TableContainer
                component={Paper}
                sx={{
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}
            >
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#B4B1B8" }}>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }}>Name</TableCell>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">Version</TableCell>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">Context</TableCell>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">Provider/Business Owner</TableCell>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">Type</TableCell>
                            <TableCell sx={{ color: "black", fontWeight: "bold" }} align="right">Rating</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {apiData.list.map((api) => (
                            <TableRow
                                key={api.id}
                                sx={{
                                    '&:hover': { backgroundColor: "#E0DAE8" } // Light color on hover
                                }}
                            >
                                <TableCell component="th" scope="row">
                                    {api.name}
                                </TableCell>
                                <TableCell align="right">{api.version}</TableCell>
                                <TableCell align="right">{api.context}</TableCell>
                                <TableCell align="right">
                                    {api.advertiseInfo.vendor || 'N/A'}
                                </TableCell>
                                <TableCell align="right">{api.type}</TableCell>
                                <TableCell align="right">{api.avgRating}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default ApiDashboardTable;
