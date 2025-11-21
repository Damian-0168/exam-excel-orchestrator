import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ExamEvent {
  id: string;
  name: string;
  description?: string;
  academic_year: string;
  term: 'first' | 'second';
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ExamEventWithExams extends ExamEvent {
  exams: {
    id: string;
    name: string;
    class: string;
    section: string;
    exam_date: string;
    pdf_file_path?: string;
    teacher_id?: string;
    exam_subjects: {
      id: string;
      subject_id: string;
      max_marks: number;
      subjects: {
        name: string;
        code: string;
      };
    }[];
  }[];
}

export const useExamEvents = () => {
  return useQuery({
    queryKey: ['examEvents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_events')
        .select(`
          *,
          exams (
            id,
            name,
            class,
            section,
            exam_date,
            pdf_file_path,
            teacher_id,
            exam_subjects (
              id,
              subject_id,
              max_marks,
              subjects (
                name,
                code
              )
            )
          )
        `)
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as ExamEventWithExams[];
    }
  });
};

export const useExamEvent = (id: string) => {
  return useQuery({
    queryKey: ['examEvent', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exam_events')
        .select(`
          *,
          exams (
            id,
            name,
            class,
            section,
            exam_date,
            pdf_file_path,
            teacher_id,
            type,
            status,
            exam_subjects (
              id,
              subject_id,
              max_marks,
              subjects (
                name,
                code
              )
            )
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ExamEventWithExams;
    },
    enabled: !!id
  });
};

export const useCreateExamEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventData: {
      name: string;
      description?: string;
      academic_year: string;
      term: 'first' | 'second';
      start_date: string;
      end_date: string;
      status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('exam_events')
        .insert({
          ...eventData,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examEvents'] });
      toast({
        title: 'Success',
        description: 'Exam event created successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateExamEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<ExamEvent>;
    }) => {
      const { error } = await supabase
        .from('exam_events')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examEvents'] });
      toast({
        title: 'Success',
        description: 'Exam event updated successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteExamEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exam_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examEvents'] });
      toast({
        title: 'Success',
        description: 'Exam event deleted successfully'
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });
};
