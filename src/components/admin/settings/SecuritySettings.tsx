'use client';

import { createClient } from '@/lib/supabase/client';
import { Loader2, ShieldCheck, KeyRound, LogOut, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SecuritySettings() {
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [isSignOutPending, startSignOutTransition] = useTransition();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const handleUpdatePassword = () => {
    setMessage(null);
    if (!password) {
      setMessage({ type: 'error', text: 'Password is required' });
      return;
    }
    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        
        setMessage({ type: 'success', text: 'Password updated successfully' });
        setIsChangingPassword(false);
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setMessage(null), 5000);
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to update password' });
      }
    });
  };

  const handleGlobalSignOut = () => {
    startSignOutTransition(async () => {
      try {
        // scope: 'global' signs out from all devices
        const { error } = await supabase.auth.signOut({ scope: 'global' });
        if (error) throw error;
        
        // Redirect to login page
        window.location.href = '/login';
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'Failed to sign out globally' });
      }
    });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm mb-8">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">Security</h2>
        <p className="text-sm text-gray-500">
          Manage your account security and sessions.
        </p>
      </div>
      
      {message && (
        <div className={`px-6 py-3 border-b ${message.type === 'error' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-green-50 border-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6 p-6">
        {/* Password Update */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Account Password</h3>
          </div>
          
          {isChangingPassword ? (
            <div className="space-y-3 pl-7 max-w-sm">
              <Input 
                type="password" 
                placeholder="New Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
              <Input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
              <div className="flex gap-2 pt-1">
                <Button onClick={handleUpdatePassword} disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Password
                </Button>
                <Button variant="outline" onClick={() => {
                  setIsChangingPassword(false);
                  setPassword('');
                  setConfirmPassword('');
                  setMessage(null);
                }} disabled={isPending}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="pl-7">
              <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                Update Password
              </Button>
            </div>
          )}
        </div>



        {/* Sessions */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <LogOut className="w-5 h-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Active Sessions</h3>
          </div>
          <div className="pl-7">
            {showSignOutConfirm ? (
              <div className="p-4 rounded-md bg-red-50 border border-red-100 space-y-3 max-w-md">
                <div className="flex gap-2 text-red-700">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">Are you sure you want to sign out everywhere?</p>
                </div>
                <p className="text-xs text-red-600">
                  This will immediately end your session on this device and all other devices. You will need to log in again.
                </p>
                <div className="flex gap-2 pt-1">
                  <Button variant="destructive" onClick={handleGlobalSignOut} disabled={isSignOutPending}>
                    {isSignOutPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Yes, Sign Out Everywhere
                  </Button>
                  <Button variant="outline" onClick={() => setShowSignOutConfirm(false)} disabled={isSignOutPending}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setShowSignOutConfirm(true)}
              >
                Terminate All Active Sessions
              </Button>
            )}
            <p className="mt-2 text-xs text-gray-500 max-w-sm">
              Sign out from all devices and browsers where you are currently logged in.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
