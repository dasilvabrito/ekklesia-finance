import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Plus, Filter, FileText } from 'lucide-react';
import { api } from '@/lib/axios';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog"
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    category: {
        id: string;
        name: string;
        type: 'INCOME' | 'EXPENSE';
    };
}

interface Category {
    id: string;
    name: string;
    type: 'INCOME' | 'EXPENSE';
}

interface CreateTransactionForm {
    description: string;
    amount: number;
    date: string;
    categoryId: string;
}

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTransactionForm>();

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await api.get('/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    }

    const onSubmit = async (data: CreateTransactionForm) => {
        try {
            await api.post('/transactions', {
                ...data,
                amount: Number(data.amount),
                date: new Date(data.date).toISOString()
            });
            setIsDialogOpen(false);
            reset();
            fetchTransactions();
        } catch (error) {
            console.error('Failed to create transaction', error);
            alert('Failed to create transaction');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Transactions</h1>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus className="mr-2 h-4 w-4" /> Add Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Transaction</DialogTitle>
                                <DialogDescription>
                                    Record a new income or expense entry.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description</label>
                                    <Input
                                        {...register('description', { required: 'Description is required' })}
                                        error={errors.description?.message}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount</label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            {...register('amount', { required: 'Amount is required', min: 0.01 })}
                                            error={errors.amount?.message}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Date</label>
                                        <Input
                                            type="date"
                                            {...register('date', { required: 'Date is required' })}
                                            error={errors.date?.message}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Category</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        {...register('categoryId', { required: 'Category is required' })}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name} ({cat.type})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <span className="text-sm text-red-500">{errors.categoryId.message}</span>}
                                </div>

                                <DialogFooter>
                                    <Button type="submit">Save Transaction</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base font-semibold text-slate-900">Recent Entries</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <Filter className="mr-2 h-4 w-4" /> Filter
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border border-slate-200">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Category</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                        <th className="px-4 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                                Loading transactions...
                                            </td>
                                        </tr>
                                    ) : transactions.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                                No transactions found.
                                            </td>
                                        </tr>
                                    ) : (
                                        transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-3 text-slate-600">
                                                    {new Date(tx.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-900">
                                                    {tx.description}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.category?.type === 'INCOME'
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-rose-100 text-rose-800'
                                                        }`}>
                                                        {tx.category?.name || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-semibold ${tx.category?.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                    {tx.category?.type === 'INCOME' ? '+' : '-'}
                                                    R$ {Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                                        <FileText className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
