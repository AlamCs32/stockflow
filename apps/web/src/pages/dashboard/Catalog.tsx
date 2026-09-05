import { useState } from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader, PageTransition, LoadingPage, ErrorState } from '@/components/shared';
import {
  useGetCategoriesQuery,
  useGetCategoryFieldsQuery,
  useGetSuppliersQuery,
  useCreateCatalogEntryMutation,
} from '@/store';
import type { CategoryFieldDef } from '@/store';
import { toastHelper } from '@/lib/toast';

const designMetaSchema = z.object({
  designCode: z.string().trim().min(1, 'Design code is required'),
  patternCode: z.string().trim().min(1, 'Pattern code is required'),
  name: z.string().trim().min(1, 'Design name is required'),
  supplierId: z.string().min(1, 'Supplier is required'),
});

type DesignMetaValues = z.infer<typeof designMetaSchema>;

type Step = 'select-category' | 'fill-fields';

export function Catalog() {
  const [step, setStep] = useState<Step>('select-category');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryAttributes, setCategoryAttributes] = useState<Record<string, unknown>>({});

  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } =
    useGetCategoriesQuery();
  const { data: fieldsData, isLoading: fieldsLoading } = useGetCategoryFieldsQuery(
    selectedCategoryId!,
    { skip: !selectedCategoryId }
  );
  const { data: suppliersData } = useGetSuppliersQuery();
  const [createEntry, { isLoading: isCreating }] = useCreateCatalogEntryMutation();

  const categories = categoriesData?.categories ?? [];
  const suppliers = suppliersData?.suppliers ?? [];
  const fields = fieldsData?.fields ?? [];
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DesignMetaValues>({
    resolver: zodResolver(designMetaSchema),
    defaultValues: {
      designCode: '',
      patternCode: '',
      name: '',
      supplierId: '',
    },
  });

  function handleCategorySelect(categoryId: number) {
    setSelectedCategoryId(categoryId);
    setCategoryAttributes({});
    reset();
    setStep('fill-fields');
  }

  function handleBack() {
    setStep('select-category');
    setSelectedCategoryId(null);
    setCategoryAttributes({});
    reset();
  }

  function handleAttributeChange(fieldName: string, value: unknown) {
    setCategoryAttributes((prev) => ({ ...prev, [fieldName]: value }));
  }

  async function onSubmit(data: DesignMetaValues) {
    if (!selectedCategoryId) return;

    try {
      await createEntry({
        designCode: data.designCode,
        patternCode: data.patternCode,
        name: data.name,
        supplierId: data.supplierId,
        categoryId: selectedCategoryId,
        categoryAttributes,
      }).unwrap();

      toastHelper.success('Created', `Catalog entry for "${data.name}" created successfully`);
      handleBack();
    } catch (err) {
      toastHelper.error(err, 'Failed to create catalog entry');
    }
  }

  if (categoriesLoading) return <LoadingPage />;
  if (categoriesError) return <ErrorState message="Failed to load categories" />;

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Catalog"
          description="Create product designs with category-specific attributes"
        />

        {step === 'select-category' && (
          <div className="space-y-6">
            <p className="text-text-secondary">
              Select a category to see its specific fields. Each category defines what attributes
              your product design needs.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="cursor-pointer transition-colors hover:border-brand hover:bg-brand/5"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Package className="h-5 w-5 text-brand" />
                      {category.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-text-muted">
                      {category.attributesSchema.length} fields
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {category.attributesSchema.slice(0, 3).map((f) => (
                        <span
                          key={f.name}
                          className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-text-muted"
                        >
                          {f.label}
                        </span>
                      ))}
                      {category.attributesSchema.length > 3 && (
                        <span className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-text-muted">
                          +{category.attributesSchema.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'fill-fields' && selectedCategory && (
          <div className="space-y-6">
            <Button variant="ghost" size="sm" onClick={handleBack} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to categories
            </Button>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Design Details — {selectedCategory.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="designCode">Design Code *</Label>
                    <Input
                      id="designCode"
                      placeholder="e.g. D001"
                      {...register('designCode')}
                      aria-invalid={!!errors.designCode}
                    />
                    {errors.designCode && (
                      <p className="text-xs text-destructive">{errors.designCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patternCode">Pattern Code *</Label>
                    <Input
                      id="patternCode"
                      placeholder="e.g. PAT-BLK-FLR"
                      {...register('patternCode')}
                      aria-invalid={!!errors.patternCode}
                    />
                    {errors.patternCode && (
                      <p className="text-xs text-destructive">{errors.patternCode.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Design Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Floral Print Anarkali Kurti"
                      {...register('name')}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="supplier">Supplier *</Label>
                    <Controller
                      control={control}
                      name="supplierId"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="w-full" aria-invalid={!!errors.supplierId}>
                            <SelectValue placeholder="Select a supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {suppliers.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.code} — {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.supplierId && (
                      <p className="text-xs text-destructive">{errors.supplierId.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {selectedCategory.name} Attributes
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {fieldsLoading ? (
                    <p className="text-text-muted">Loading fields...</p>
                  ) : (
                    fields.map((field) => (
                      <DynamicField
                        key={field.name}
                        field={field}
                        value={categoryAttributes[field.name]}
                        onChange={(val) => handleAttributeChange(field.name, val)}
                      />
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Catalog Entry'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: CategoryFieldDef;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const strValue = value !== undefined ? String(value) : '';

  if (field.type === 'select' && field.options) {
    const options: string[] = field.options;
    return (
      <div className="space-y-2">
        <Label>
          {field.label}
          {field.required && <span className="ml-1 text-status-error">*</span>}
        </Label>
        <Select value={strValue} onValueChange={onChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt: string) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-2 sm:col-span-2">
        <Label>
          {field.label}
          {field.required && <span className="ml-1 text-status-error">*</span>}
        </Label>
        <Textarea
          placeholder={field.placeholder}
          value={strValue}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div className="space-y-2">
        <Label>
          {field.label}
          {field.required && <span className="ml-1 text-status-error">*</span>}
        </Label>
        <Input
          type="number"
          placeholder={field.placeholder}
          value={strValue}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          required={field.required}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>
        {field.label}
        {field.required && <span className="ml-1 text-status-error">*</span>}
      </Label>
      <Input
        type="text"
        placeholder={field.placeholder}
        value={strValue}
        onChange={(e) => onChange(e.target.value)}
        required={field.required}
      />
    </div>
  );
}
