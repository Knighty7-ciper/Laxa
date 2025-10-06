"use client"

import { useState } from "react"
import { useBranches } from "@/lib/hooks/use-branches"
import { BranchForm } from "@/components/branches/branch-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, MapPin, Phone, Mail, Edit, Trash2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminBranchesPage() {
  const { branches, loading, createBranch, updateBranch, deleteBranch } = useBranches()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<any>(null)

  const handleCreate = async (data: any) => {
    const result = await createBranch(data)
    if (!result.error) {
      setDialogOpen(false)
    }
    return result
  }

  const handleUpdate = async (data: any) => {
    if (!editingBranch) return { data: null, error: "No branch selected" }
    const result = await updateBranch(editingBranch.id, data)
    if (!result.error) {
      setDialogOpen(false)
      setEditingBranch(null)
    }
    return result
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      await deleteBranch(id)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Branch Management</h1>
          <p className="text-muted-foreground">Manage your salon locations</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingBranch(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBranch ? "Edit Branch" : "Create New Branch"}</DialogTitle>
              <DialogDescription>
                {editingBranch ? "Update branch information" : "Add a new salon location"}
              </DialogDescription>
            </DialogHeader>
            <BranchForm
              branch={editingBranch}
              onSubmit={editingBranch ? handleUpdate : handleCreate}
              onSuccess={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{branch.name}</CardTitle>
                  <CardDescription>
                    {branch.city}, {branch.country}
                  </CardDescription>
                </div>
                <Badge variant={branch.is_active ? "default" : "secondary"}>
                  {branch.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{branch.email}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setEditingBranch(branch)
                    setDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(branch.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
