import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Trash2, Edit2, Eye, Search } from 'lucide-react';

const UserList = ({
  users,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onView,
  loading,
}) => {
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdminLevelBadge = (userType, adminLevel) => {
    if (userType === 'client') {
      return <Badge variant="outline">Citizen</Badge>;
    }

    if (adminLevel === 'superadmin') {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          👑 Super Admin
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        🛡️ Admin
      </Badge>
    );
  };

  const getDepartmentBadge = (department) => {
    if (!department) return null;

    const depts = {
      licensing: { label: '🛡️ Licensing', color: 'bg-slate-100 text-slate-800' },
      complaints: { label: '⚖️ Complaints', color: 'bg-orange-100 text-orange-800' },
      qos: { label: '📊 QoS', color: 'bg-[#E0F4FB] text-[#001F40]' },
      tenders: { label: '💼 Tenders', color: 'bg-purple-100 text-purple-800' },
    };

    const dept = depts[department];
    if (!dept) return null;

    return (
      <Badge variant="outline" className={dept.color}>
        {dept.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage all users: citizens and admins ({filteredUsers.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Type
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Department
                </th>
                <th className="text-left px-4 py-3 font-semibold text-slate-700">
                  Created
                </th>
                <th className="text-right px-4 py-3 font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{user.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-600">{user.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      {getAdminLevelBadge(user.userType, user.adminLevel)}
                    </td>
                    <td className="px-4 py-3">
                      {getDepartmentBadge(user.department) || (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(user)}
                          disabled={loading}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(user)}
                          disabled={loading}
                          title="Edit user"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(user)}
                          disabled={loading}
                          title="Delete user"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
