'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  updateUserRole, 
  deleteUser, 
  getAllUsers 
} from '@/lib/actions/user.actions'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Trash2, Shield, User, Crown, AlertTriangle } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
  lastSignIn?: string
  signInCount: number
}

interface UsersResponse {
  data: User[]
  totalPages: number
  currentPage: number
  totalUsers: number
}

export default function UserManagementClient({ 
  currentAdminId, 
  initialUsers 
}: { 
  currentAdminId: string
  initialUsers: UsersResponse 
}) {
  const [users, setUsers] = useState<UsersResponse>(initialUsers)
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = async (page: number = 1) => {
    setLoading(true)
    try {
      const result = await getAllUsers({ page, limit: 50 })
      if (result) {
        setUsers({
          data: result.data,
          totalPages: result.totalPages,
          currentPage: page,
          totalUsers: result.data.length
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to fetch users'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch users'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'moderator') => {
    if (userId === currentAdminId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You cannot change your own role'
      })
      return
    }

    setProcessing(userId)
    try {
      const result = await updateUserRole(userId, newRole)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'User role updated successfully'
        })
        // Refresh users list
        fetchUsers(users.currentPage)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to update user role'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update user role'
      })
    } finally {
      setProcessing(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentAdminId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You cannot delete your own account'
      })
      return
    }

    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    setProcessing(userId)
    try {
      const result = await deleteUser(userId)
      if (result.success) {
        toast({
          title: 'Success',
          description: 'User deleted successfully'
        })
        // Refresh users list
        fetchUsers(users.currentPage)
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to delete user'
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete user'
      })
    } finally {
      setProcessing(null)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />
      case 'moderator':
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'moderator':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Sign In Count</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.signInCount}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.role}
                          onValueChange={(value: 'user' | 'admin' | 'moderator') => 
                            handleRoleChange(user.id, value)
                          }
                          disabled={processing === user.id || user.id === currentAdminId}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={processing === user.id || user.id === currentAdminId}
                        >
                          {processing === user.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {users.data.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Users Found</h3>
              <p className="text-muted-foreground">No users have been created yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
