import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Student {
  name: string;
  dateOfBirth?: string;
  class: string;
  section: string;
  rollNumber?: string;
  guardian?: string;
  guardianContact?: string;
}

interface ExcelImportProps {
  onImport: (students: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;
  isLoading: boolean;
}

export const ExcelImport = ({ onImport, isLoading }: ExcelImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = [
      {
        name: 'John Doe',
        dateOfBirth: '2005-01-15',
        class: 'Form 1',
        section: 'A',
        rollNumber: '001',
        guardian: 'Jane Doe',
        guardianContact: '+1234567890'
      },
      {
        name: 'Mary Smith',
        dateOfBirth: '2005-03-22',
        class: 'Form 1',
        section: 'B',
        rollNumber: '002',
        guardian: 'John Smith',
        guardianContact: '+1234567891'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student_template.xlsx');
    
    toast({
      title: "Template Downloaded",
      description: "Excel template has been downloaded to your computer"
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const students = jsonData.map((row: any) => ({
        name: row.name || '',
        dateOfBirth: row.dateOfBirth || '',
        class: row.class || '',
        section: row.section || '',
        rollNumber: row.rollNumber || '',
        guardian: row.guardian || '',
        guardianContact: row.guardianContact || ''
      }));

      // Validate required fields
      const invalidStudents = students.filter(student => 
        !student.name.trim() || !student.class || !student.section
      );

      if (invalidStudents.length > 0) {
        toast({
          title: "Validation Error",
          description: `${invalidStudents.length} students are missing required fields (name, class, or section)`,
          variant: "destructive"
        });
        return;
      }

      await onImport(students);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to read the Excel file. Please check the format.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border border-dashed border-border rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-medium">Import Students from Excel</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Upload an Excel file with student data. Required fields: name, class, section
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button
          variant="outline"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
        
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="excel-upload"
            disabled={isLoading}
          />
          <Label htmlFor="excel-upload" asChild>
            <Button 
              variant="default" 
              className="flex items-center gap-2 cursor-pointer"
              disabled={isLoading}
            >
              <Upload className="h-4 w-4" />
              Upload Excel File
            </Button>
          </Label>
        </div>
      </div>
    </div>
  );
};