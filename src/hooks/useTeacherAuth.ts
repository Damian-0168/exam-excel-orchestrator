import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TeacherSession {
  id: string;
  name: string;
  username: string;
  subjects: string[];
}

export const useTeacherAuth = () => {
  const [session, setSession] = useState<TeacherSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if teacher is logged in
    const teacherData = localStorage.getItem('teacherSession');
    if (teacherData) {
      setSession(JSON.parse(teacherData));
    }
    setLoading(false);
  }, []);

  const signUp = async (username: string, password: string, name: string, email: string, subjectIds: string[]) => {
    try {
      setLoading(true);
      
      // Hash password using SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = btoa(String.fromCharCode.apply(null, hashArray));
      
      // Create teacher
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          name,
          email,
          username,
          role: 'teacher'
        })
        .select()
        .single();

      if (teacherError) throw teacherError;

      // Create teacher auth
      const { error: authError } = await supabase
        .from('teacher_auth')
        .insert({
          teacher_id: teacher.id,
          username,
          password_hash: passwordHash
        });

      if (authError) throw authError;

      // Assign subjects
      const subjectAssignments = subjectIds.map(subjectId => ({
        teacher_id: teacher.id,
        subject_id: subjectId,
        classes: ['Form 1', 'Form 2', 'Form 3', 'Form 4']
      }));

      const { error: subjectError } = await supabase
        .from('teacher_subjects')
        .insert(subjectAssignments);

      if (subjectError) throw subjectError;

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Hash password using SHA-256
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = btoa(String.fromCharCode.apply(null, hashArray));
      
      // Get teacher auth
      const { data: authData, error: authError } = await supabase
        .from('teacher_auth')
        .select(`
          teacher_id,
          teachers!inner(*)
        `)
        .eq('username', username)
        .eq('password_hash', passwordHash)
        .single();

      if (authError) throw new Error('Invalid credentials');

      // Get teacher subjects
      const { data: subjects, error: subjectsError } = await supabase
        .from('teacher_subjects')
        .select(`
          subjects(id, name)
        `)
        .eq('teacher_id', authData.teacher_id);

      if (subjectsError) throw subjectsError;

      const sessionData: TeacherSession = {
        id: authData.teacher_id,
        name: authData.teachers.name,
        username: authData.teachers.username,
        subjects: subjects.map(s => s.subjects.id)
      };

      setSession(sessionData);
      localStorage.setItem('teacherSession', JSON.stringify(sessionData));

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setSession(null);
    localStorage.removeItem('teacherSession');
  };

  return {
    session,
    loading,
    signUp,
    signIn,
    signOut
  };
};