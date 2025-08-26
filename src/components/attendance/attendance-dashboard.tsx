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

export default function AttendanceDashboard() {
  const { toast } = useToast();
  
  // Timetable state
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractTimetableDataOutput | null>(null);
  
  // Attendance state
  const [daysAbsent, setDaysAbsent] = useState('');
  const [daysConducted, setDaysConducted] = useState('');
  const [totalDays, setTotalDays] = useState('');
  
  // Projection state
  const [isProjecting, setIsProjecting] = useState(false);
  const [projection, setProjection] = useState<ProjectAttendanceOutput | null>(null);
  const [currentPercentage, setCurrentPercentage] = useState<number | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleExtract = async () => {
    if (!photoFile) {
      toast({ variant: "destructive", title: "No file selected", description: "Please choose an image of your timetable." });
      return;
    }

    setIsExtracting(true);
    setExtractedData(null);

    const reader = new FileReader();
    reader.readAsDataURL(photoFile);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const result = await extractTimetableData({ photoDataUri });
        setExtractedData(result);
        toast({ title: "Extraction Successful", description: "Timetable data has been extracted." });
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Extraction Failed", description: "Could not extract data from the image." });
      } finally {
        setIsExtracting(false);
      }
    };
  };

  const handleProject = async () => {
    const absent = parseInt(daysAbsent);
    const conducted = parseInt(daysConducted);
    const total = parseInt(totalDays);

    if (isNaN(absent) || isNaN(conducted) || isNaN(total) || absent < 0 || conducted <= 0 || total <= 0) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Please enter valid, positive numbers for all fields." });
      return;
    }
    if (absent > conducted) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Classes missed cannot be more than classes conducted." });
      return;
    }
    if (conducted > total) {
      toast({ variant: "destructive", title: "Invalid Input", description: "Classes conducted cannot be more than total classes." });
      return;
    }

    setIsProjecting(true);
    setProjection(null);
    
    const currentAtt = ((conducted - absent) / conducted) * 100;
    setCurrentPercentage(currentAtt);

    try {
      const result = await projectAttendance({
        currentAttendancePercentage: currentAtt,
        daysAbsent: absent,
        totalPossibleDays: total
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
          <CardDescription>Upload an image of your class schedule to extract key data automatically.</CardDescription>
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
        {extractedData && (
          <CardContent>
             <Separator className="my-4" />
             <h3 className="font-semibold mb-2">Extracted Information:</h3>
             <p className="text-sm"><strong>Class Timings:</strong> {extractedData.classTimings}</p>
             <p className="text-sm"><strong>Class Durations:</strong> {extractedData.classDurations}</p>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><BarChart2 className="text-accent" /> Step 2: Calculate & Project Attendance</CardTitle>
          <CardDescription>Enter your attendance details to calculate your current standing and project future possibilities.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="days-absent">Classes Missed So Far</Label>
            <Input id="days-absent" type="number" placeholder="e.g., 5" value={daysAbsent} onChange={(e) => setDaysAbsent(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="days-conducted">Classes Conducted So Far</Label>
            <Input id="days-conducted" type="number" placeholder="e.g., 20" value={daysConducted} onChange={(e) => setDaysConducted(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total-days">Total Classes in Semester</Label>
            <Input id="total-days" type="number" placeholder="e.g., 80" value={totalDays} onChange={(e) => setTotalDays(e.target.value)} />
          </div>
        </CardContent>
        <CardContent>
          <Button onClick={handleProject} disabled={isProjecting} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isProjecting && <Loader2 className="animate-spin mr-2" />}
            Calculate & Project Attendance
          </Button>
        </CardContent>
      </Card>
      
      {currentPercentage !== null && projection && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Attendance Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <Label>Current Attendance</Label>
                <span className="font-bold">{currentPercentage.toFixed(2)}%</span>
              </div>
              <Progress value={currentPercentage} className="h-3" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <Label>Projected Attendance (if you attend all remaining classes)</Label>
                <span className="font-bold">{projection.attendanceIfAllAttended.toFixed(2)}%</span>
              </div>
              <Progress value={projection.attendanceIfAllAttended} className="h-3 bg-accent/20 [&>*]:bg-accent" />
            </div>
            <div className={`flex items-center gap-4 p-4 rounded-lg ${projection.canAchieve75Percent ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
              {projection.canAchieve75Percent ? <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" /> : <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />}
              <div>
                <h4 className={`font-headline text-lg ${projection.canAchieve75Percent ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {projection.canAchieve75Percent ? "You're on track!" : "You need to be careful!"}
                </h4>
                <p className={`text-sm ${projection.canAchieve75Percent ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                  {projection.canAchieve75Percent ? "You can achieve above 75% attendance by attending all future classes." : "Even if you attend all remaining classes, you will not reach 75% attendance."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
