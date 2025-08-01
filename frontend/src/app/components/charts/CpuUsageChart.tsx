'use client';

import { Box, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '10:00', usage: 45 },
  { name: '10:05', usage: 60 },
  { name: '10:10', usage: 75 },
  { name: '10:15', usage: 50 },
];

export default function CpuUsageChart() {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>Uso de CPU (%)</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="usage" stroke="#3f51b5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
