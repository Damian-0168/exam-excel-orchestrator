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

  const signUp = async (email: string, password: string, name: string, emailParam: string, subjectIds: string[]) => {
    try {
      setLoading(true);
      
      // Hash password (simple implementation - in production use bcrypt)  
      const passwordHash = btoa(password); // Base64 encoding for demo
      
      // Create teacher
      const { data: teacher, error: teacherError } = await supabase
        .from('teachers')
        .insert({
          name,
          email,
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
          username: email, // Use email as username for authentication
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

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // TEMPORARY: Skip authentication for development
      const sessionData: TeacherSession = {
        id: 'dev-teacher-id',
        name: 'Development Teacher',
        username: email,
        subjects: []
      };

      setSession(sessionData);
      localStorage.setItem('teacherSession', JSON.stringify(sessionData));

      return { success: true };
      
      /* 
      // COMMENTED OUT FOR DEVELOPMENT - UNCOMMENT WHEN AUTH IS FIXED
      const passwordHash = btoa(password);
      console.log('Sign in attempt:', { email, passwordHash });
      
      // First, let's check if user exists by email in the teachers table
      const { data: userCheck, error: userError } = await supabase
        .from('teacher_auth')
        .select(`
          teacher_id,
          username,
          password_hash,
          teachers!inner(id, name, email)
        `)
        .eq('teachers.email', email)
        .maybeSingle();

      console.log('User check result:', { userCheck, userError });

      if (userError) {
        console.error('Auth query error:', userError);
        throw new Error('Database error occurred');
      }

      if (!userCheck) {
        throw new Error('No account found with this email');
      }

      // Check password
      if (userCheck.password_hash !== passwordHash) {
        console.log('Password mismatch:', { 
          stored: userCheck.password_hash, 
          provided: passwordHash,
          originalPassword: password
        });
        throw new Error('Invalid password');
      }

      const authData = userCheck;

      // Get teacher subjects
      const { data: subjects, error: subjectsError } = await supabase
        .from('teacher_subjects')
        .select(`
          subjects(id, name)
        `)
        .eq('teacher_id', authData.teacher_id);

      if (subjectsError) {
        console.error('Subjects query error:', subjectsError);
        // Don't fail login if subjects can't be loaded
      }

      const sessionData: TeacherSession = {
        id: authData.teacher_id,
        name: authData.teachers.name,
        username: authData.teachers.email,
        subjects: subjects?.map(s => s.subjects.id) || []
      };

      setSession(sessionData);
      localStorage.setItem('teacherSession', JSON.stringify(sessionData));

      return { success: true };
      */
    } catch (error: any) {
      console.error('Sign in error:', error);
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