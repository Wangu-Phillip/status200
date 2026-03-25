import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const UserForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    userType: 'client',
    adminLevel: null,
    department: null,
    organization: '',
    phone: '',
    address: '',
    tier: 'Tier 1 Citizen',
    trustScore: 82,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? null : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!user && !formData.password) newErrors.password = 'Password is required';
    if (!formData.name) newErrors.name = 'Name is required';

    if (formData.userType === 'admin' && !formData.adminLevel) {
      newErrors.adminLevel = 'Admin level is required for admins';
    }

    if (formData.adminLevel === 'admin' && !formData.department) {
      newErrors.department = 'Department is required for department admins';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>{user ? 'Edit User' : 'Create New User'}</CardTitle>
        <CardDescription>
          {user ? 'Update user information' : 'Add a new user to the system'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@bocra.org.bw"
              disabled={loading}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          {(!user || user.isChangingPassword) && (
            <div className="space-y-2">
              <Label htmlFor="password">Password {!user ? '*' : ''}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={loading}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.name}
              </p>
            )}
          </div>

          {/* User Type */}
          <div className="space-y-2">
            <Label htmlFor="userType">User Type *</Label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]"
            >
              <option value="client">Citizen</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Admin Level */}
          {formData.userType === 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="adminLevel">Admin Level *</Label>
              <select
                id="adminLevel"
                name="adminLevel"
                value={formData.adminLevel || ''}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  errors.adminLevel ? 'border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="">Select admin level</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Department Admin</option>
              </select>
              {errors.adminLevel && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.adminLevel}
                </p>
              )}
            </div>
          )}

          {/* Department */}
          {formData.adminLevel === 'admin' && (
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <select
                id="department"
                name="department"
                value={formData.department || ''}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366] ${
                  errors.department ? 'border-red-500' : 'border-slate-200'
                }`}
              >
                <option value="">Select department</option>
                <option value="licensing">🛡️ Licensing & Type Approval</option>
                <option value="complaints">⚖️ Complaints & Consumer Protection</option>
                <option value="qos">📊 QoS Monitoring</option>
                <option value="tenders">💼 Tender Management</option>
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" /> {errors.department}
                </p>
              )}
            </div>
          )}

          {/* Organization */}
          <div className="space-y-2">
            <Label htmlFor="organization">Organization</Label>
            <Input
              id="organization"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Organization name"
              disabled={loading}
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+267-XX-XXXXXX"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <select
                id="tier"
                name="tier"
                value={formData.tier}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#003366]"
              >
                <option value="Tier 1 Citizen">Tier 1 Citizen</option>
                <option value="Tier 2 Citizen">Tier 2 Citizen</option>
                <option value="Tier 3 Citizen">Tier 3 Citizen</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address"
              disabled={loading}
            />
          </div>

          {/* Trust Score */}
          {formData.userType === 'client' && (
            <div className="space-y-2">
              <Label htmlFor="trustScore">Trust Score (0-100)</Label>
              <Input
                id="trustScore"
                name="trustScore"
                type="number"
                min="0"
                max="100"
                value={formData.trustScore}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#003366] hover:bg-[#0A4D8C]"
            >
              {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
