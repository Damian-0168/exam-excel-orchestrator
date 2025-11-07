import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClassesSections = () => {
  return useQuery({
    queryKey: ['classes-sections'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('teacher_profiles')
        .select('school_id')
        .eq('id', user.id)
        .single();

      if (!profile?.school_id) throw new Error('School not found');

      const { data: students, error } = await supabase
        .from('students')
        .select('class, section')
        .eq('school_id', profile.school_id);

      if (error) throw error;

      // Get unique classes and sections
      const classes = [...new Set(students?.map(s => s.class).filter(Boolean))].sort();
      const sections = [...new Set(students?.map(s => s.section).filter(Boolean))].sort();

      return { classes, sections };
    }
  });
};
