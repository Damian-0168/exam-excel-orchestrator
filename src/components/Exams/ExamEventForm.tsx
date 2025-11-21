import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ExamEvent } from '@/hooks/useExamEvents';

const examEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  term: z.enum(['first', 'second']),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional()
});

type ExamEventFormData = z.infer<typeof examEventSchema>;

interface ExamEventFormProps {
  event?: ExamEvent;
  onSubmit: (data: ExamEventFormData) => void;
  onCancel: () => void;
}

export const ExamEventForm = ({ event, onSubmit, onCancel }: ExamEventFormProps) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ExamEventFormData>({
    resolver: zodResolver(examEventSchema),
    defaultValues: event ? {
      name: event.name,
      description: event.description,
      academic_year: event.academic_year,
      term: event.term,
      start_date: event.start_date,
      end_date: event.end_date,
      status: event.status
    } : {
      status: 'upcoming'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Event Name *</Label>
        <Input 
          id="name" 
          {...register('name')} 
          placeholder="e.g., Mid Term Examination, End of Term Examination" 
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          placeholder="Optional description of the exam event"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="academic_year">Academic Year *</Label>
          <Input id="academic_year" {...register('academic_year')} placeholder="e.g., 2024-2025" />
          {errors.academic_year && <p className="text-sm text-destructive mt-1">{errors.academic_year.message}</p>}
        </div>

        <div>
          <Label htmlFor="term">Term *</Label>
          <Select onValueChange={(value) => setValue('term', value as any)} defaultValue={event?.term}>
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">1st Term</SelectItem>
              <SelectItem value="second">2nd Term</SelectItem>
            </SelectContent>
          </Select>
          {errors.term && <p className="text-sm text-destructive mt-1">{errors.term.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date *</Label>
          <Input id="start_date" type="date" {...register('start_date')} />
          {errors.start_date && <p className="text-sm text-destructive mt-1">{errors.start_date.message}</p>}
        </div>

        <div>
          <Label htmlFor="end_date">End Date *</Label>
          <Input id="end_date" type="date" {...register('end_date')} />
          {errors.end_date && <p className="text-sm text-destructive mt-1">{errors.end_date.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={event?.status || 'upcoming'}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {event ? 'Update Event' : 'Create Event'}
        </Button>
      </div>
    </form>
  );
};
