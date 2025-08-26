"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { extractTimetableData, ExtractTimetableDataOutput } from '@/ai/flows/extract-timetable-data';
import { projectAttendance, ProjectAttendanceOutput } from '@/ai/flows/project-attendance';
import { Loader2, UploadCloud, FileText, BarChart2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Separator } from '../ui/separator';

type SubjectAttendance = {
  subjectName: string;
  classesPerWeek: number;
  classesMissed: string;
};

export default function AttendanceDashboard() {
  const { toast } = useToast();
  
  // Timetable state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractTimetableDataOutput | null>(null);
  const [subjectAttendance, setSubjectAttendance] = useState<SubjectAttendance[]>([]);

  // Attendance state
  const [totalWorkingDays, setTotalWorkingDays] = useState('');
  const [daysPassed, setDaysPassed] = useState('');
  
  // Projection state
  const [isProjecting, setIsProjecting] = useState(false);
  const [projection, setProjection] = useState<ProjectAttendanceOutput | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setExtractedData(null);
      setSubjectAttendance([]);
      setProjection(null);
    }
  };

  const handleExtract = async () => {
    if (!photoFile) {
      toast({ variant: "destructive", title: "No file selected", description: "Please choose an image of your timetable." });
      return;
    }

    setIsExtracting(true);
    setExtractedData(null);
    setProjection(null);

    const reader = new FileReader();
    reader.readAsDataURL(photoFile);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const result = await extractTimetableData({ photoDataUri });
        setExtractedData(result);
        setSubjectAttendance(result.subjects.map(s => ({ ...s, classesMissed: '' })));
        toast({ title: "Extraction Successful", description: "Timetable data has been extracted." });
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Extraction Failed", description: "Could not extract data from the image." });
      } finally {
        setIsExtracting(false);
      }
    };
  };

  const handleSubjectMissedChange = (subjectName: string, value: string) => {
    setSubjectAttendance(prev => 
      prev.map(s => s.subjectName === subjectName ? { ...s, classesMissed: value } : s)
    );
  };

  const handleProject = async () => {
    const totalDays = parseInt(totalWorkingDays);
    const passedDays = parseInt(daysPassed);

    if (isNaN(totalDays) || isNaN(passedDays) || totalDays <= 0 || passedDays < 0) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Please enter valid numbers for total and passed days." });
      return;
    }

    if (passedDays > totalDays) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Days passed cannot be more than total working days." });
      return;
    }

    const subjectsForProjection = subjectAttendance.map(s => ({
      ...s,
      classesMissed: parseInt(s.classesMissed) || 0,
    }));

    setIsProjecting(true);
    setProjection(null);
    
    try {
      const result = await projectAttendance({
        subjects: subjectsForProjection,
        totalWorkingDays: totalDays,
        daysPassed: passedDays
      });
      setProjection(result);
      toast({ title: "Projection Complete", description: "Your attendance has been projected." });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Projection Failed", description: "Could not project your attendance." });
    } finally {
      setIsProjecting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><UploadCloud className="text-primary"/> Step 1: Upload Timetable</CardTitle>
          <CardDescription>Upload an image of your class schedule to automatically extract your subjects.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="timetable-upload" className="block text-sm font-medium text-foreground/80 mb-2">Timetable Image</Label>
          <Input id="timetable-upload" type="file" accept="image/*" onChange={handleFileChange} />
          {photoFile && <p className="text-sm text-muted-foreground">Selected: {photoFile.name}</p>}
          <Button onClick={handleExtract} disabled={!photoFile || isExtracting} className="w-full">
            {isExtracting ? <Loader2 className="animate-spin mr-2" /> : <FileText className="mr-2" />}
            Extract Timetable Data
          </Button>
        </CardContent>
      </Card>

      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BarChart2 className="text-accent" /> Step 2: Enter Attendance Details</CardTitle>
            <CardDescription>Provide the semester duration and classes missed for each subject.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total-days">Total Working Days in Semester</Label>
                <Input id="total-days" type="number" placeholder="e.g., 90" value={totalWorkingDays} onChange={(e) => setTotalWorkingDays(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="days-passed">Working Days Passed So Far</Label>
                <Input id="days-passed" type="number" placeholder="e.g., 30" value={daysPassed} onChange={(e) => setDaysPassed(e.target.value)} />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Classes Missed Per Subject</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {subjectAttendance.map((subject) => (
                  <div key={subject.subjectName} className="space-y-2">
                    <Label htmlFor={`missed-${subject.subjectName}`}>{subject.subjectName} ({subject.classesPerWeek} classes/week)</Label>
                    <Input 
                      id={`missed-${subject.subjectName}`} 
                      type="number" 
                      placeholder="e.g., 5" 
                      value={subject.classesMissed} 
                      onChange={(e) => handleSubjectMissedChange(subject.subjectName, e.target.value)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardContent>
            <Button onClick={handleProject} disabled={isProjecting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isProjecting && <Loader2 className="animate-spin mr-2" />}
              Calculate & Project Attendance
            </Button>
          </CardContent>
        </Card>
      )}
      
      {projection && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Attendance Projection Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projection.projections.map((proj) => (
              <div key={proj.subjectName} className="p-4 rounded-lg border">
                <h4 className="font-headline text-xl mb-4">{proj.subjectName}</h4>
                
                <div className="space-y-4">
                   <div>
                    <div className="flex justify-between mb-1">
                      <Label>Current Attendance</Label>
                      <span className="font-bold">{proj.currentPercentage.toFixed(2)}%</span>
                    </div>
                    <Progress value={proj.currentPercentage} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label>Projected Attendance (if you attend all remaining classes)</Label>
                      <span className="font-bold">{proj.projectedPercentage.toFixed(2)}%</span>
                    </div>
                    <Progress value={proj.projectedPercentage} className="h-3 bg-accent/20 [&>*]:bg-accent" />
                  </div>
                </div>

                <div className={`mt-4 flex items-center gap-4 p-4 rounded-lg ${proj.canAchieve75Percent ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                  {proj.canAchieve75Percent ? <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />}
                  <div>
                    <h5 className={`font-semibold text-lg ${proj.canAchieve75Percent ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      {proj.canAchieve75Percent ? "You're on track!" : "You need to be careful!"}
                    </h5>
                    <p className={`text-sm ${proj.canAchieve75Percent ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                      {proj.canAchieve75Percent ? "You can achieve above 75% attendance." : "Even if you attend all remaining classes, you will not reach 75% attendance."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
