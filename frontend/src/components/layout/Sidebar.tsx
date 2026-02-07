import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    ArrowRightLeft,
    FileText,
    Settings,
    X,
    Church,
    Users
} from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Transactions', href: '/transactions', icon: ArrowRightLeft },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Users', href: '/users', icon: Users },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={cn(
                    'fixed inset-0 z-20 bg-slate-900/50 transition-opacity lg:hidden',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={cn(
                    'fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <Church className="h-6 w-6" />
                        <span>Ekklesia</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                )}
                            >
                                <item.icon className={cn('h-5 w-5', isActive ? 'text-indigo-600' : 'text-slate-400')} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}
