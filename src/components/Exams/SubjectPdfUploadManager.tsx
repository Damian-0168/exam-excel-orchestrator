import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUploadSubjectPdf, useDeleteSubjectPdf } from '@/hooks/useExamSubjectPdf';
import { toast } from '@/hooks/use-toast';

interface SubjectPdfUploadManagerProps {
  examSubjectId: string;
  subjectName: string;
  currentPdfPath?: string | null;
  onPdfUploaded?: (pdfPath: string) => void;
}

export const SubjectPdfUploadManager = ({
  examSubjectId,
  subjectName,
  currentPdfPath,
  onPdfUploaded
}: SubjectPdfUploadManagerProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const uploadPdf = useUploadSubjectPdf();
  const deletePdf = useDeleteSubjectPdf();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file',
        description: 'Please select a PDF file',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    uploadPdf.mutate(
      { examSubjectId, pdfFile: file },
      {
        onSuccess: (result) => {
          setIsUploading(false);
          if (onPdfUploaded) {
            onPdfUploaded(result.pdf_file_path);
          }
        },
        onError: () => {
          setIsUploading(false);
        }
      }
    );
  };

  const handleDeletePdf = () => {
    deletePdf.mutate(examSubjectId);
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-medium text-sm">{subjectName}</Label>
          {currentPdfPath && (
            <Badge variant="secondary" className="text-xs">
              PDF Uploaded
            </Badge>
          )}
        </div>

        {currentPdfPath ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => document.getElementById(`pdf-${examSubjectId}`)?.click()}
              disabled={uploadPdf.isPending}
            >
              <Upload className="w-3 h-3 mr-1" />
              Replace PDF
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDeletePdf}
              disabled={deletePdf.isPending}
              className="text-destructive hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ) : (
          <label
            htmlFor={`pdf-${examSubjectId}`}
            className="flex items-center justify-center w-full px-3 py-2 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors text-sm"
          >
            <Upload className="w-3 h-3 mr-1" />
            <span>Upload PDF</span>
          </label>
        )}

        <input
          id={`pdf-${examSubjectId}`}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </Card>
  );
};
