import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { secondsFormatter, toSeconds } from '../utils/formatters';
import { Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
    const { token } = useAuth();
    const [weekly, setWeekly] = useState('');
    const [monthly, setMonthly] = useState('');
    const [breakdown, setBreakdown] = useState([]);
    const [mostStudied, setMostStudied] = useState('');
    const [streak, setStreak] = useState({});

    useEffect(() => {
        async function setStats() {
            let weekSec = await fetchStats("/weekly");
            if (weekSec.message) {
                setWeekly('0');
            } else {
                setWeekly(secondsFormatter(weekSec.sum));
            }

            let monthSec = await fetchStats("/monthly");
            if (monthSec.message) {
                setMonthly('0');
            } else {
                setMonthly(secondsFormatter(monthSec.sum));
            }

            let subjects = await fetchStats("/subjects");
            if (subjects.message) {
                setBreakdown(["No sessions"]);
            } else {
                setBreakdown(subjects.map((s, index) => ({ 
                    name: s.name, 
                    value: parseInt(s.sum),
                    fill: COLORS[index % COLORS.length
                    ]
                })));
            }

            let bestSubject = await fetchStats("/most-studied");
            if (bestSubject.message) {
                setMostStudied("No sessions");
            } else {
                setMostStudied(bestSubject.name);
            }

            let curStreak = await fetchStats("/streak");
            if (curStreak.message) {
                setStreak(0);
            } else {
                setStreak(curStreak);
            }
        }

        async function fetchStats(subPath) {
            try {
                const result = await fetch(import.meta.env.VITE_API_URL + "/stats" + subPath, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await result.json();
                return data;
            } catch (err) {
                console.log(err);
            }
        }

        setStats();
    }, []);

    return (
        <div className='h-screen bg-gray-900 p-6 flex flex-col'>
            {/* Header */}
            <div className='mb-6'>
                <h1 className='text-4xl font-bold text-white'>Dashboard</h1>
                <p className='text-gray-400 mt-1'>Welcome back!</p>
            </div>

            {/* Top Stats Row */}
            <div className='flex gap-4 mb-6'>
                <div className='bg-gray-800 rounded-xl p-5 flex-1 flex flex-col gap-2'>
                    <p className='text-gray-400 text-sm uppercase tracking-wide'>Weekly Study Time</p>
                    <p className='text-white text-xl font-semibold'>{(toSeconds(weekly) > 0) ? weekly : '0 hours, 0 minutes'}</p>
                </div>
                <div className='bg-gray-800 rounded-xl p-5 flex-1 flex flex-col gap-2'>
                    <p className='text-gray-400 text-sm uppercase tracking-wide'>Monthly Study Time</p>
                    <p className='text-white text-xl font-semibold'>{(toSeconds(monthly) > 0) ? monthly : '0 hours, 0 minutes'}</p>
                </div>
                <div className='bg-gray-800 rounded-xl p-5 flex-1 flex flex-col gap-2'>
                    <p className='text-gray-400 text-sm uppercase tracking-wide'>Study Streak</p>
                    <p className='text-white text-xl font-semibold'>{streak.streak || 0} days</p>
                    <p className={`text-sm ${streak.studied_today ? 'text-green-400' : 'text-red-400'}`}>
                        {streak.studied_today ? '✓ Studied today' : '✗ Not studied today'}
                    </p>
                </div>
            </div>

            {/* Bottom Row */}
            <div className='flex gap-4 flex-1'>
                <div className='bg-gray-800 rounded-xl p-5 flex-1 flex flex-col items-center'>
                    <p className='text-gray-400 text-sm uppercase tracking-wide mb-4'>Subject Breakdown</p>
                    {breakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={breakdown}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="55%"
                                    outerRadius="75%"
                                    dataKey="value"
                                    nameKey="name"
                                />
                                <Tooltip formatter={(value) => secondsFormatter(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className='text-gray-500'>No sessions logged yet</p>
                    )}
                </div>
                <div className='bg-gray-800 rounded-xl p-5 w-64 flex flex-col gap-2'>
                    <p className='text-gray-400 text-sm uppercase tracking-wide'>Most Studied Subject</p>
                    <p className='text-white text-xl font-semibold'>{mostStudied || 'No sessions yet'}</p>
                </div>
            </div>
        </div>
    );
}