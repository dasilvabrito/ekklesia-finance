import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Download, Calendar } from 'lucide-react';
import { api } from '@/lib/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ReportData {
    period: { start: string, end: string };
    totals: {
        income: number;
        expense: number;
        net: number;
    };
    categoryBreakdown: { name: string, value: number }[];
    transactions: any[]; // For export
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Reports() {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            // Default to last 30 days logic is in backend if params omitted
            const response = await api.get('/reports/summary');
            setReportData(response.data);
        } catch (error) {
            console.error('Failed to fetch report', error);
        } finally {
            setIsLoading(false);
        }
    };

    const downloadCSV = () => {
        if (!reportData?.transactions) return;

        const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
        const rows = reportData.transactions.map(tx => [
            new Date(tx.date).toLocaleDateString(),
            `"${tx.description}"`, // Escape quotes
            tx.category.name,
            tx.category.type,
            tx.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <Layout><div className="flex justify-center p-12">Loading report data...</div></Layout>;
    }

    return (
        <Layout>
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Reports</h1>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Calendar className="mr-2 h-4 w-4" /> This Month
                        </Button>
                        <Button onClick={downloadCSV}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                </div>

                {reportData && (
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Income vs Expense</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={[
                                        { name: 'Income', amount: reportData.totals.income },
                                        { name: 'Expense', amount: reportData.totals.expense }
                                    ]}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                                        <Tooltip />
                                        <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Expenses by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={reportData.categoryBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {reportData.categoryBreakdown.map((_entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, 'Amount']} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </Layout>
    );
}
