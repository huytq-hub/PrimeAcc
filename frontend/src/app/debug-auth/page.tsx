'use client';

import { useEffect, useState } from 'react';

export default function DebugAuthPage() {
  const [authData, setAuthData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    setAuthData({
      hasToken: !!token,
      token: token ? token.substring(0, 20) + '...' : null,
      hasUser: !!user,
      user: user ? JSON.parse(user) : null,
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Authentication</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Token Status</h2>
            <p className={authData?.hasToken ? 'text-green-600' : 'text-red-600'}>
              {authData?.hasToken ? '✅ Token exists' : '❌ No token'}
            </p>
            {authData?.token && (
              <p className="text-sm text-slate-600 mt-1 font-mono">{authData.token}</p>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">User Data</h2>
            <p className={authData?.hasUser ? 'text-green-600' : 'text-red-600'}>
              {authData?.hasUser ? '✅ User data exists' : '❌ No user data'}
            </p>
            {authData?.user && (
              <pre className="mt-2 p-4 bg-slate-100 rounded text-sm overflow-auto">
                {JSON.stringify(authData.user, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Admin Access</h2>
            <p className={authData?.user?.role === 'ADMIN' ? 'text-green-600' : 'text-red-600'}>
              {authData?.user?.role === 'ADMIN' 
                ? '✅ User is ADMIN - Can access /admin' 
                : `❌ User role: ${authData?.user?.role || 'unknown'} - Cannot access /admin`}
            </p>
          </div>

          <div className="pt-4 border-t space-y-2">
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Clear Storage & Logout
            </button>
            
            {authData?.user?.role === 'ADMIN' && (
              <a
                href="/admin"
                className="ml-2 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Go to Admin Panel
              </a>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to set user as ADMIN:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Open terminal in backend folder</li>
            <li>Run: <code className="bg-blue-100 px-2 py-1 rounded">node scripts/set-admin.js your_username</code></li>
            <li>Logout and login again</li>
            <li>Check this page again</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
