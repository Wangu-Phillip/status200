import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { X } from 'lucide-react';

const UserModal = ({ user, onClose }) => {
  if (!user) return null;

  const getDeptLabel = (dept) => {
    const depts = {
      licensing: '🛡️ Licensing & Type Approval',
      complaints: '⚖️ Complaints & Consumer Protection',
      qos: '📊 QoS Monitoring',
      tenders: '💼 Tender Management',
    };
    return depts[dept] || '—';
  };

  const getUserTypeLabel = () => {
    if (user.userType === 'client') {
      return { label: 'Citizen', color: 'bg-slate-100 text-slate-800' };
    }
    if (user.adminLevel === 'superadmin') {
      return { label: '👑 Super Admin', color: 'bg-purple-100 text-purple-800' };
    }
    return { label: '🛡️ Department Admin', color: 'bg-blue-100 text-blue-800' };
  };

  const userType = getUserTypeLabel();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b">
          <div>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Status Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">User Type</p>
              <Badge className={`mt-2 ${userType.color}`}>{userType.label}</Badge>
            </div>
            {user.userType === 'admin' && user.adminLevel && (
              <div>
                <p className="text-sm font-medium text-slate-500">Admin Level</p>
                <p className="mt-2 font-medium text-slate-900 capitalize">
                  {user.adminLevel}
                </p>
              </div>
            )}
          </div>

          {/* Department Info */}
          {user.department && (
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-slate-500 mb-2">Department</p>
              <p className="font-medium text-slate-900">
                {getDeptLabel(user.department)}
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4 space-y-0">
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">{user.phone || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Organization</p>
                <p className="font-medium text-slate-900">{user.organization || '—'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-slate-500">Address</p>
                <p className="font-medium text-slate-900">{user.address || '—'}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-2 gap-4 space-y-0">
              <div>
                <p className="text-sm text-slate-500">Tier</p>
                <p className="font-medium text-slate-900">{user.tier}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Trust Score</p>
                <p className="font-medium text-slate-900">
                  {user.trustScore !== undefined ? `${user.trustScore}/100` : '—'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Created</p>
                <p className="font-medium text-slate-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="font-medium text-slate-900">
                  {new Date(user.updatedAt || user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserModal;
