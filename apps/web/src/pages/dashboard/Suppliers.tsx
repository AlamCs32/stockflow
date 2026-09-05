import { useState, useEffect } from 'react';
import { Pencil, Trash2, Users, Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  PageHeader,
  PageTransition,
  LoadingPage,
  EmptyState,
  ErrorState,
  ConfirmDialog,
} from '@/components/shared';
import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from '@/store/supplier';
import type { Supplier, SupplierCategory, AvailabilityStatus } from '@/store/supplier';
import { toastHelper } from '@/lib/toast';
import {
  supplierFormSchema,
  supplierDefaultValues,
  type SupplierFormValues,
} from './_schemas/supplierFormSchema';

const categoryOptions: { value: SupplierCategory; label: string }[] = [
  { value: 'GENERAL', label: 'General' },
  { value: 'GARMENT', label: 'Garment' },
  { value: 'BAGS', label: 'Bags' },
  { value: 'ELECTRONICS', label: 'Electronics' },
  { value: 'FOOTWEAR', label: 'Footwear' },
];

const availabilityOptions: { value: AvailabilityStatus; label: string }[] = [
  { value: 'ALWAYS_AVAILABLE', label: 'Always Available' },
  { value: 'SEASONAL', label: 'Seasonal' },
  { value: 'CHECK_STOCK', label: 'Check Stock' },
  { value: 'OUT_OF_STOCK', label: 'Out of Stock' },
];

export function Suppliers() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data, isLoading, error } = useGetSuppliersQuery();
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();

  const suppliers = data?.suppliers ?? [];

  function openCreate() {
    setSelectedSupplier(null);
    setCreateOpen(true);
  }

  function openEdit(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setEditOpen(true);
  }

  function openDelete(supplier: Supplier) {
    setSelectedSupplier(supplier);
    setDeleteOpen(true);
  }

  function handleDialogClose() {
    setCreateOpen(false);
    setEditOpen(false);
    setSelectedSupplier(null);
  }

  async function handleDelete() {
    if (!selectedSupplier) return;
    try {
      await deleteSupplier(selectedSupplier.id).unwrap();
      toastHelper.success('Deleted', 'Supplier removed successfully');
      setDeleteOpen(false);
      setSelectedSupplier(null);
    } catch (err) {
      toastHelper.error(err, 'Failed to delete supplier');
    }
  }

  if (isLoading) return <LoadingPage />;
  if (error) return <ErrorState message="Failed to load suppliers" />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Suppliers"
          description="Manage your supplier directory"
          actionLabel="Add Supplier"
          onAction={openCreate}
        />

        {suppliers.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No suppliers yet"
            description="Add your first supplier to get started."
            action={
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            }
          />
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Code</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Trust</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Quality</th>
                    <th className="px-4 py-3 text-left font-medium text-text-muted">Availability</th>
                    <th className="px-4 py-3 text-right font-medium text-text-muted">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map((supplier) => (
                    <tr
                      key={supplier.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-text-primary">
                        {supplier.code}
                      </td>
                      <td className="px-4 py-3 font-medium text-text-primary">{supplier.name}</td>
                      <td className="px-4 py-3 text-text-secondary">{supplier.contactEmail}</td>
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {categoryOptions.find((c) => c.value === supplier.category)?.label ?? supplier.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{supplier.trustScore}</td>
                      <td className="px-4 py-3 text-text-secondary">{supplier.qualityScore}</td>
                      <td className="px-4 py-3">
                        <Badge variant={supplier.availabilityStatus === 'OUT_OF_STOCK' ? 'destructive' : 'secondary'}>
                          {availabilityOptions.find((a) => a.value === supplier.availabilityStatus)?.label ?? supplier.availabilityStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(supplier)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => openDelete(supplier)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <SupplierFormDialog
          open={createOpen || editOpen}
          mode={editOpen ? 'edit' : 'create'}
          supplier={selectedSupplier}
          onClose={handleDialogClose}
          onSubmit={async (values) => {
            if (editOpen && selectedSupplier) {
              await updateSupplier({ id: selectedSupplier.id, body: values }).unwrap();
              toastHelper.success('Updated', 'Supplier updated successfully');
            } else {
              await createSupplier(values).unwrap();
              toastHelper.success('Created', 'Supplier added successfully');
            }
          }}
          isLoading={isCreating || isUpdating}
        />

        <ConfirmDialog
          open={deleteOpen}
          onOpenChange={(open) => { if (!open) { setDeleteOpen(false); setSelectedSupplier(null); } }}
          title="Delete supplier?"
          description={`This will permanently remove "${selectedSupplier?.name}". This action cannot be undone.`}
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={handleDelete}
          loading={isDeleting}
        />
      </div>
    </PageTransition>
  );
}

function SupplierFormDialog({
  open,
  mode,
  supplier,
  onClose,
  onSubmit,
  isLoading,
}: {
  open: boolean;
  mode: 'create' | 'edit';
  supplier: Supplier | null;
  onClose: () => void;
  onSubmit: (values: SupplierFormValues) => Promise<void>;
  isLoading: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: supplierDefaultValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && supplier) {
        reset({
          name: supplier.name,
          contactEmail: supplier.contactEmail,
          mobileNo: supplier.mobileNo,
          category: supplier.category,
          trustScore: supplier.trustScore,
          qualityScore: supplier.qualityScore,
          availabilityStatus: supplier.availabilityStatus,
          leadTimeDays: supplier.leadTimeDays,
          address: supplier.address,
          city: supplier.city,
          state: supplier.state,
          gstNumber: supplier.gstNumber,
          panNumber: supplier.panNumber,
        });
      } else {
        reset(supplierDefaultValues);
      }
    }
  }, [open, mode, supplier, reset]);

  function handleClose() {
    onClose();
  }

  function handleValidSubmit(data: Record<string, unknown>) {
    onSubmit(data as SupplierFormValues);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Supplier' : 'Add Supplier'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit' ? 'Update supplier details.' : 'Add a new supplier to your directory.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register('name')} aria-invalid={!!errors.name} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input id="contactEmail" type="email" {...register('contactEmail')} aria-invalid={!!errors.contactEmail} />
              {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNo">Mobile *</Label>
              <Input id="mobileNo" {...register('mobileNo')} aria-invalid={!!errors.mobileNo} />
              {errors.mobileNo && <p className="text-xs text-destructive">{errors.mobileNo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trustScore">Trust Score (0-100)</Label>
              <Input id="trustScore" type="number" min={0} max={100} {...register('trustScore')} aria-invalid={!!errors.trustScore} />
              {errors.trustScore && <p className="text-xs text-destructive">{errors.trustScore.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualityScore">Quality Score (0-100)</Label>
              <Input id="qualityScore" type="number" min={0} max={100} {...register('qualityScore')} aria-invalid={!!errors.qualityScore} />
              {errors.qualityScore && <p className="text-xs text-destructive">{errors.qualityScore.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Controller
                control={control}
                name="availabilityStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
              <Input id="leadTimeDays" type="number" min={0} placeholder="e.g. 7" {...register('leadTimeDays')} aria-invalid={!!errors.leadTimeDays} />
              {errors.leadTimeDays && <p className="text-xs text-destructive">{errors.leadTimeDays.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Full address" {...register('address')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register('state')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstNumber">GST Number</Label>
              <Input id="gstNumber" {...register('gstNumber')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input id="panNumber" {...register('panNumber')} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add Supplier'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
