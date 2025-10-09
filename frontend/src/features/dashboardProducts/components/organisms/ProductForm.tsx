'use client';

import React, { useRef, useState, useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createProductSchema, CreateProductInput } from '../../types';
import { Product } from '@/features/Products/types/productTypes';

type ProductFormProps = {
  title?: string;
  submitLabel?: string;
  initialValues?: Partial<CreateProductInput>;
  previewImageUrl?: string;
  onSubmit: (formData: FormData) => Promise<unknown> | unknown;
};

export default function ProductForm({ title = 'Product', submitLabel = 'Save', initialValues, previewImageUrl, onSubmit }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      type: 'general' ,
      category: undefined,
      image: null,
      ...initialValues,
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const watchedImage = watch('image');

  useEffect(() => {
    if (watchedImage instanceof File) {
      const url = URL.createObjectURL(watchedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    if (!watchedImage && previewImageUrl) {
      setPreviewUrl(previewImageUrl);
      return;
    }
    setPreviewUrl(null);
  }, [watchedImage, previewImageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setValue('image', file, { shouldValidate: true });
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFormSubmit: SubmitHandler<CreateProductInput> = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      formData.append('price', String(data.price));
      formData.append('stock', String(data.stock ?? 0));
      formData.append('type', data.type);
      if (data.category) formData.append('category', data.category);
      if (data.image) formData.append('image', data.image);

      await onSubmit(formData);
      toast.success(`${submitLabel} successful`);

      if (!initialValues) {
        reset();
        if (fileInputRef.current) fileInputRef.current.value = '';
        setPreviewUrl(null);
      }
    } catch (err) {
      toast.error(`Failed to ${submitLabel.toLowerCase()}`);
      console.error(err);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="grid grid-cols-1 gap-6">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-sm">Name</Label>
            <Input id="name" placeholder="Product name" {...register('name')} />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea id="description" placeholder="Short description (optional)" {...register('description')} />
            {errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-sm">Price</Label>
              <Input id="price" type="number" step="0.01" min="0" {...register('price', { valueAsNumber: true })} />
              {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock" className="text-sm">Stock</Label>
              <Input id="stock" type="number" min="0" {...register('stock', { valueAsNumber: true })} />
              {errors.stock && <p className="text-destructive text-sm">{errors.stock.message}</p>}
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm">Type</Label>
              <Select onValueChange={(val) => setValue('type', val as CreateProductInput['type'])} defaultValue={initialValues?.type || 'general'}>
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-destructive text-sm">{errors.type.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm">Category</Label>
              <Select onValueChange={(val) => setValue('category', val as any)} defaultValue={initialValues?.category || ''}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="supplements">Supplements</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <Label className="text-sm">Product Image</Label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 rounded-md border bg-muted/5 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-sm text-muted-foreground">No image</div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={triggerFileSelect} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Choose Image
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setValue('image', undefined);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                      setPreviewUrl(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
                {errors.image && <p className="text-destructive text-sm">{(errors.image as any)?.message}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
