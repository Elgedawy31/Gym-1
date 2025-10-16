'use client';

import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { WorkoutPlanRequest } from '../../types';
import { useCreateWorkoutPlan } from '../../hooks/useWorkoutPlan';

export default function CreateWorkoutPlanPage() {
  const { register, handleSubmit, control, reset } = useForm<WorkoutPlanRequest>({
    defaultValues: {
      title: '',
      description: '',
      duration: 4,
      level: 'beginner',
      exercises: [{ name: '', sets: 3, reps: 10, rest: '60s' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  const createWorkoutPlan = useCreateWorkoutPlan();

  const onSubmit = (data: WorkoutPlanRequest) => {
    createWorkoutPlan.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Create Workout Plan</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label>Title</Label>
              <Input {...register('title', { required: true })} placeholder="e.g. Full Body Strength" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea {...register('description')} placeholder="Write a short description..." />
            </div>

            {/* Level */}
            <div className="space-y-2">
              <Label>Level</Label>
              <select
                {...register('level')}
                className="w-full border rounded-md p-2 bg-background"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration (weeks)</Label>
              <Input type="number" {...register('duration', { valueAsNumber: true })} />
            </div>

            {/* Exercises */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Exercises</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ name: '', sets: 3, reps: 10, rest: '60s' })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Exercise
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-2">Exercise Name</Label>
                      <Input
                        {...register(`exercises.${index}.name` as const, { required: true })}
                        placeholder="e.g. Bench Press"
                      />
                    </div>
                    <div>
                      <Label className="mb-2">Sets</Label>
                      <Input
                        type="number"
                        {...register(`exercises.${index}.sets` as const, { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label className="mb-2">Reps</Label>
                      <Input
                        type="number"
                        {...register(`exercises.${index}.reps` as const, { valueAsNumber: true })}
                      />
                    </div>
                    <div>
                      <Label className="mb-2">Rest</Label>
                      <Input
                        {...register(`exercises.${index}.rest` as const)}
                        placeholder="e.g. 60s"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={createWorkoutPlan.isPending}
            >
              {createWorkoutPlan.isPending ? 'Creating...' : 'Create Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
