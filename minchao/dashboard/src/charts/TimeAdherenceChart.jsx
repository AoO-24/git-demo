import React, { useRef, useEffect, useState } from 'react';
import { useThemeProvider } from '../utils/ThemeContext';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-moment';

import { chartColors } from './ChartjsConfig';
import { tailwindConfig } from '../utils/Utils';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TimeAdherenceChart({ data, width, height }) {
    const [chart, setChart] = useState(null);
    const canvas = useRef(null);
    const { currentTheme } = useThemeProvider();
    const darkMode = currentTheme === 'dark';

    useEffect(() => {
        const ctx = canvas.current;
        const newChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Time Difference (minutes)',
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                        },
                        grid: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.slate[200],
                            borderDash: [3, 3],
                        },
                        ticks: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            callback: function (value) {
                                return value >= 0 ? `+${value}` : value;
                            },
                        },
                    }
                },
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                const value = context.parsed.y || 0;
                                const sign = value >= 0 ? '+' : '';
                                return `${label}: ${sign}${value} min`;
                            },
                        },
                        backgroundColor: darkMode ? tailwindConfig().theme.colors.slate[700] : tailwindConfig().theme.colors.white,
                        titleColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        bodyColor: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[700],
                        borderColor: darkMode ? tailwindConfig().theme.colors.slate[600] : tailwindConfig().theme.colors.slate[300],
                        borderWidth: 1,
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: darkMode ? tailwindConfig().theme.colors.slate[300] : tailwindConfig().theme.colors.slate[600],
                            usePointStyle: true,
                            padding: 20,
                        },
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 500,
                    easing: 'easeInOutQuart',
                },
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    },
                },
            }
        });

        setChart(newChart);

        return () => newChart.destroy();
    }, [currentTheme, darkMode, data]);

    return (
        <div className="grow">
            <canvas ref={canvas} width={width} height={height}></canvas>
        </div>
    );
}

export default TimeAdherenceChart;