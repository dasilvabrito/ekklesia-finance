import { useForm } from 'react-hook-form';
import { api } from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Church } from 'lucide-react';

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        try {
            await api.post('/onboarding', data);
            alert('Church registered successfully! Please login.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border border-slate-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Church className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">
                        Register your Church
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Start managing your finances today
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-4">
                        <Input
                            label="Church Name"
                            {...register('churchName', { required: 'Name is required' })}
                            error={errors.churchName?.message as string}
                        />
                        <Input
                            label="Slug (URL identifier)"
                            {...register('slug', { required: 'Slug is required', minLength: 3 })}
                            error={errors.slug?.message as string}
                        />
                        <Input
                            label="Admin Name"
                            {...register('adminName', { required: 'Admin name is required' })}
                            error={errors.adminName?.message as string}
                        />
                        <Input
                            label="Admin Email"
                            type="email"
                            {...register('adminEmail', { required: 'Email is required' })}
                            error={errors.adminEmail?.message as string}
                        />
                        <Input
                            label="Password"
                            type="password"
                            {...register('adminPassword', { required: 'Password is required', minLength: 6 })}
                            error={errors.adminPassword?.message as string}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Create Account
                    </Button>
                    <div className="text-center">
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 text-sm">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
