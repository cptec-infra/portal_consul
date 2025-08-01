'use client';

import { Box, Typography } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '10:00', usage: 3.2 },
  { name: '10:05', usage: 4.1 },
  { name: '10:10', usage: 5.3 },
  { name: '10:15', usage: 4.8 },
];

export default function RamUsageChart() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Uso de RAM (GB)</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="usage" stroke="#00acc1" fill="#b2ebf2" />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
