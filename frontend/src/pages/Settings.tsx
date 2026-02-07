import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { User, Shield, Building } from 'lucide-react';
import { api } from '@/lib/axios';

interface UserData {
    id: string;
    email: string;
    role: string;
}

export default function Settings() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="h-5 w-5 text-slate-500" />
                                General Information
                            </CardTitle>
                            <CardDescription>Manage your church details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-1">
                                <label className="text-sm font-medium text-slate-500">Church Name</label>
                                <p className="font-medium">Igreja Batista Nova Canaã</p>
                            </div>
                            <div className="grid gap-1">
                                <label className="text-sm font-medium text-slate-500">Current Plan</label>
                                <span className="inline-flex items-center w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-800">
                                    Pro Plan
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-slate-500" />
                                Security & Access
                            </CardTitle>
                            <CardDescription>Manage users and roles</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoading ? (
                                    <p className="text-sm text-slate-500">Loading users...</p>
                                ) : (
                                    <div className="rounded-md border border-slate-200">
                                        <div className="bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">
                                            Active Users
                                        </div>
                                        <ul className="divide-y divide-slate-100">
                                            {users.map(user => (
                                                <li key={user.id} className="flex items-center justify-between px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                                                            <User className="h-4 w-4 text-slate-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{user.email}</p>
                                                            <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <Button variant="outline" className="w-full" disabled>
                                    Invite New User (Coming Soon)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
