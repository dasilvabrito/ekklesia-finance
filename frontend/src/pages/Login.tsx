import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck } from 'lucide-react';

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', data);
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                        Ekklesia Finance
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in to your church account
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Email address"
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            error={errors.password?.message as string}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}
