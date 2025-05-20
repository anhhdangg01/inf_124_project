import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserStats {
    watching: number;
    completed: number;
    onHold: number;
    dropped: number;
    planToWatch: number;
    entries: number;
    rewatched: number;
    totalEpisodes: number;
}

function PieChart() {
    const data = {
    labels: ['Green', 'Blue', 'Yellow', 'Red', 'Grey'],
    datasets: [
        {
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
        },
    ],
    };

  return <Pie data={data} />;
}

export default PieChart;
