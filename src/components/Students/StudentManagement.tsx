
import { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { StudentForm } from './StudentForm';
import { Student } from '@/types';
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';

export const StudentManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  const { toast } = useToast();
  const { data: students = [], isLoading, error } = useStudents();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const deleteStudentMutation = useDeleteStudent();

  const classes = ['10A', '10B', '11A', '11B', '12A', '12B'];
  const sections = ['A', 'B', 'C'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'all' || student.class === selectedClass;
    const matchesSection = selectedSection === 'all' || student.section === selectedSection;
    
    return matchesSearch && matchesClass && matchesSection;
  });

  const handleCreateStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createStudentMutation.mutateAsync(studentData);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    } catch (error) {
      console.error('Failed to create student:', error);
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStudent = async (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingStudent) return;
    
    try {
      await updateStudentMutation.mutateAsync({
        id: editingStudent.id,
        updates: studentData
      });
      setEditingStudent(null);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } catch (error) {
      console.error('Failed to update student:', error);
      toast({
        title: "Error",
        description: "Failed to update student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await deleteStudentMutation.mutateAsync(id);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete student:', error);
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600">
          <h3 className="text-lg font-medium mb-2">Error loading students</h3>
          <p>Please check your database connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage your student records and information</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)} 
          className="bg-educational-blue hover:bg-educational-blue/90"
          disabled={createStudentMutation.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search students by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSection} onValueChange={setSelectedSection}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sections</SelectItem>
                {sections.map(section => (
                  <SelectItem key={section} value={section}>{section}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-educational-blue mx-auto mb-4"></div>
              <p>Loading students...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Students Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-gray-600">{student.rollNumber}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(student)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600"
                        disabled={deleteStudentMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Class:</span>
                    <Badge variant="secondary">{student.class}-{student.section}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Guardian:</span>
                    <span className="text-sm font-medium">{student.guardian || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact:</span>
                    <span className="text-sm">{student.guardianContact || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredStudents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No students found</h3>
              <p>Try adjusting your search criteria or add a new student.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student Form Modal */}
      {showForm && (
        <StudentForm
          student={editingStudent}
          onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          isLoading={createStudentMutation.isPending || updateStudentMutation.isPending}
        />
      )}
    </div>
  );
};
