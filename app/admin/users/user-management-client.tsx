'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { formatId } from '@/lib/utils'
import { 
  Eye, 
  Edit, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  Trash2, 
  Shield, 
  ShieldX,
  Crown,
  User
} from 'lucide-react'
import Link from 'next/link'
import { updateUserRole, deleteUser } from '@/lib/user-store'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
  lastSignIn?: string
  signInCount: number
}

interface UserManagementClientProps {
  users: User[]
  currentAdminId?: string
}

export default function UserManagementClient({ users, currentAdminId }: UserManagementClientProps) {
  const [usersList, setUsersList] = useState<User[]>(users)
  const [loading, setLoading] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  })
  
  const { toast } = useToast()
  const router = useRouter()

  // Debug logging
  console.log('UserManagementClient received users:', users.length)
  console.log('UserManagementClient users preview:', users.map(u => ({ id: u.id, email: u.email, name: u.name })))

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin' | 'moderator') => {
    if (userId === currentAdminId && newRole === 'user') {
      toast({
        variant: 'destructive',
        description: 'You cannot demote yourself from admin role',
      })
      return
    }

    setLoading(userId)
    try {
      const result = await updateUserRole(userId, newRole)
      
      if (result) {
        setUsersList(prev => 
          prev.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
          )
        )
        toast({
          description: `User role updated to ${newRole} successfully`,
        })
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to update user role',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to update user role',
      })
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentAdminId) {
      toast({
        variant: 'destructive',
        description: 'You cannot delete your own account',
      })
      return
    }

    setLoading(userId)
    try {
      const result = await deleteUser(userId)
      
      if (result) {
        setUsersList(prev => prev.filter(user => user.id !== userId))
        toast({
          description: 'User deleted successfully',
        })
        setDeleteDialog({ open: false, user: null })
      } else {
        toast({
          variant: 'destructive',
          description: 'Failed to delete user',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to delete user',
      })
    } finally {
      setLoading(null)
    }
  }

  const getRoleBadgeVariant = (role: 'user' | 'admin' | 'moderator') => {
    switch (role) {
      case 'admin':
        return 'default'
      case 'moderator':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleIcon = (role: 'user' | 'admin' | 'moderator') => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />
      case 'moderator':
        return <Shield className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const getQuickActions = (user: User) => {
    const isCurrentUser = user.id === currentAdminId
    const actions = []

    if (user.role === 'user') {
      actions.push({
        label: 'Make Admin',
        icon: <Crown className="h-3 w-3" />,
        onClick: () => handleRoleChange(user.id, 'admin'),
        variant: 'default' as const,
      })
      actions.push({
        label: 'Make Moderator',
        icon: <Shield className="h-3 w-3" />,
        onClick: () => handleRoleChange(user.id, 'moderator'),
        variant: 'secondary' as const,
      })
    }

    if (user.role === 'admin' && !isCurrentUser) {
      actions.push({
        label: 'Remove Admin',
        icon: <ShieldX className="h-3 w-3" />,
        onClick: () => handleRoleChange(user.id, 'user'),
        variant: 'outline' as const,
      })
    }

    if (user.role === 'moderator') {
      actions.push({
        label: 'Make Admin',
        icon: <Crown className="h-3 w-3" />,
        onClick: () => handleRoleChange(user.id, 'admin'),
        variant: 'default' as const,
      })
      actions.push({
        label: 'Remove Moderator',
        icon: <UserX className="h-3 w-3" />,
        onClick: () => handleRoleChange(user.id, 'user'),
        variant: 'outline' as const,
      })
    }

    return actions
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-600">
              Manage user roles, permissions, and account settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Total Users: {usersList.length}
            </div>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              Refresh
            </Button>
            <Button asChild className="bg-gray-900 hover:bg-gray-800 text-white font-medium">
              <Link href="/admin/users/create">
                <Crown className="h-4 w-4 mr-2" />
                Create Admin
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">
                    {usersList.filter(u => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Moderators</p>
                  <p className="text-2xl font-bold">
                    {usersList.filter(u => u.role === 'moderator').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Users</p>
                  <p className="text-2xl font-bold">
                    {usersList.filter(u => u.role === 'user').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users ({usersList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Sign In</TableHead>
                  <TableHead>Sign In Count</TableHead>
                  <TableHead>Quick Actions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Users will appear here once they sign up</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  usersList.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              ID: {formatId(user.id)}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div>
                          {user.email}
                          {user.id === currentAdminId && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant={getRoleBadgeVariant(user.role)}
                          className="flex items-center w-fit gap-1"
                        >
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {user.lastSignIn ? new Date(user.lastSignIn).toLocaleDateString() : 'Never'}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm font-medium">
                          {user.signInCount || 0}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          {getQuickActions(user).slice(0, 2).map((action, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant={action.variant}
                              onClick={action.onClick}
                              disabled={loading === user.id}
                              className="h-7 text-xs"
                            >
                              {action.icon}
                              <span className="ml-1 hidden sm:inline">
                                {action.label}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/${user.id}`}>
                                  <Edit className="h-3 w-3 mr-2" />
                                  Edit User
                                </Link>
                              </DropdownMenuItem>
                              
                              {getQuickActions(user).map((action, index) => (
                                <DropdownMenuItem
                                  key={index}
                                  onClick={action.onClick}
                                  disabled={loading === user.id}
                                >
                                  {action.icon}
                                  <span className="ml-2">{action.label}</span>
                                </DropdownMenuItem>
                              ))}
                              
                              {user.id !== currentAdminId && (
                                <DropdownMenuItem
                                  onClick={() => setDeleteDialog({ open: true, user })}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-3 w-3 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog 
          open={deleteDialog.open} 
          onOpenChange={(open) => setDeleteDialog({ open, user: null })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deleteDialog.user?.name}</strong>'s account?
                This action cannot be undone and will permanently remove all user data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteDialog.user && handleDeleteUser(deleteDialog.user.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
