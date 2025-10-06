import React from 'react';
import { Role } from '../types';
import { useAuth } from '../features/auth/hooks/useAuth';

export const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    if (user?.role === Role.Admin) return children;
    return <AccessDenied message="You must be an administrator to view this page." />;
};

export const ClientRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    if (user) return children;
    return <AccessDenied message="You must be logged in to view this page." />;
};

export const AccessDenied: React.FC<{message: string}> = ({ message }) => (
     <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p>{message}</p>
    </div>
);
