import { Menu, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const navigate = useNavigate();
    // Mock user data or get from centralized state/context
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm border-b border-slate-100">
            <button
                onClick={onMenuClick}
                className="text-slate-500 hover:text-slate-700 lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center ml-auto gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </div>
                    <span className="hidden md:inline-block font-medium">{user.name || 'User'}</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
