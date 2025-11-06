import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { useSubjects } from '@/hooks/useSubjects';
import type { ExamWithSubjects } from '@/hooks/useExams';

const examSchema = z.object({
  name: z.string().min(1, 'Exam name is required'),
  academic_year: z.string().min(1, 'Academic year is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  term: z.enum(['first', 'second', 'third']),
  type: z.enum(['midterm', 'final', 'unit-test', 'assignment', 'practical']),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional()
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamFormProps {
  exam?: ExamWithSubjects;
  onSubmit: (data: ExamFormData & { subjects: { subject_id: string; max_marks: number }[] }) => void;
  onCancel: () => void;
}

export const ExamForm = ({ exam, onSubmit, onCancel }: ExamFormProps) => {
  const { data: subjects = [] } = useSubjects();
  const [selectedSubjects, setSelectedSubjects] = useState<{ subject_id: string; max_marks: number }[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: exam ? {
      name: exam.name,
      academic_year: exam.academic_year,
      class: exam.class,
      section: exam.section,
      start_date: exam.start_date,
      end_date: exam.end_date,
      term: exam.term,
      type: exam.type,
      status: exam.status
    } : {
      status: 'upcoming'
    }
  });

  useEffect(() => {
    if (exam?.exam_subjects) {
      setSelectedSubjects(
        exam.exam_subjects.map(es => ({
          subject_id: es.subject_id,
          max_marks: es.max_marks
        }))
      );
    }
  }, [exam]);

  const handleSubjectToggle = (subjectId: string, checked: boolean) => {
    if (checked) {
      setSelectedSubjects([...selectedSubjects, { subject_id: subjectId, max_marks: 100 }]);
    } else {
      setSelectedSubjects(selectedSubjects.filter(s => s.subject_id !== subjectId));
    }
  };

  const handleMaxMarksChange = (subjectId: string, maxMarks: number) => {
    setSelectedSubjects(selectedSubjects.map(s => 
      s.subject_id === subjectId ? { ...s, max_marks: maxMarks } : s
    ));
  };

  const onFormSubmit = (data: ExamFormData) => {
    onSubmit({ ...data, subjects: selectedSubjects });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Exam Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Exam Name *</Label>
            <Input id="name" {...register('name')} placeholder="e.g., Mid-Term Examination" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="academic_year">Academic Year *</Label>
            <Input id="academic_year" {...register('academic_year')} placeholder="e.g., 2024-2025" />
            {errors.academic_year && <p className="text-sm text-destructive mt-1">{errors.academic_year.message}</p>}
          </div>

          <div>
            <Label htmlFor="class">Class *</Label>
            <Input id="class" {...register('class')} placeholder="e.g., 10" />
            {errors.class && <p className="text-sm text-destructive mt-1">{errors.class.message}</p>}
          </div>

          <div>
            <Label htmlFor="section">Section *</Label>
            <Input id="section" {...register('section')} placeholder="e.g., A" />
            {errors.section && <p className="text-sm text-destructive mt-1">{errors.section.message}</p>}
          </div>

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

          <div>
            <Label htmlFor="term">Term *</Label>
            <Select onValueChange={(value) => setValue('term', value as any)} defaultValue={exam?.term}>
              <SelectTrigger>
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first">First Term</SelectItem>
                <SelectItem value="second">Second Term</SelectItem>
                <SelectItem value="third">Third Term</SelectItem>
              </SelectContent>
            </Select>
            {errors.term && <p className="text-sm text-destructive mt-1">{errors.term.message}</p>}
          </div>

          <div>
            <Label htmlFor="type">Exam Type *</Label>
            <Select onValueChange={(value) => setValue('type', value as any)} defaultValue={exam?.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Midterm</SelectItem>
                <SelectItem value="final">Final</SelectItem>
                <SelectItem value="unit-test">Unit Test</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
          </div>

          {exam && (
            <div>
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={exam.status}>
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
          )}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Select Subjects</h3>
        <div className="space-y-3">
          {subjects.map((subject) => {
            const isSelected = selectedSubjects.some(s => s.subject_id === subject.id);
            const selectedSubject = selectedSubjects.find(s => s.subject_id === subject.id);

            return (
              <div key={subject.id} className="flex items-center gap-4 p-3 border rounded-lg">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSubjectToggle(subject.id, checked as boolean)}
                />
                <div className="flex-1">
                  <p className="font-medium">{subject.name}</p>
                  <p className="text-sm text-muted-foreground">{subject.code}</p>
                </div>
                {isSelected && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`max-marks-${subject.id}`} className="text-sm">Max Marks:</Label>
                    <Input
                      id={`max-marks-${subject.id}`}
                      type="number"
                      className="w-24"
                      value={selectedSubject?.max_marks || 100}
                      onChange={(e) => handleMaxMarksChange(subject.id, parseInt(e.target.value) || 100)}
                      min="1"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {exam ? 'Update Exam' : 'Create Exam'}
        </Button>
      </div>
    </form>
  );
};
