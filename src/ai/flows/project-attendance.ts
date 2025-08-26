'use server';
/**
 * @fileOverview Predicts whether a student can achieve a 75% attendance rate by attending all remaining classes for each subject.
 *
 * - projectAttendance - A function that handles the attendance projection process.
 * - ProjectAttendanceInput - The input type for the projectAttendance function.
 * - ProjectAttendanceOutput - The return type for the projectAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubjectAttendanceInputSchema = z.object({
  subjectName: z.string(),
  classesPerWeek: z.number(),
  classesMissed: z.number(),
});

const ProjectAttendanceInputSchema = z.object({
  subjects: z.array(SubjectAttendanceInputSchema),
  totalWorkingDays: z.number().describe('Total number of working days in the semester.'),
  daysPassed: z.number().describe('Number of working days passed so far.'),
});
export type ProjectAttendanceInput = z.infer<typeof ProjectAttendanceInputSchema>;

const SubjectAttendanceProjectionSchema = z.object({
  subjectName: z.string(),
  canAchieve75Percent: z.boolean(),
  projectedPercentage: z.number(),
  currentPercentage: z.number(),
});

const ProjectAttendanceOutputSchema = z.object({
  projections: z.array(SubjectAttendanceProjectionSchema),
});
export type ProjectAttendanceOutput = z.infer<typeof ProjectAttendanceOutputSchema>;


export async function projectAttendance(input: ProjectAttendanceInput): Promise<ProjectAttendanceOutput> {
  return projectAttendanceFlow(input);
}

const projectAttendanceFlow = ai.defineFlow(
  {
    name: 'projectAttendanceFlow',
    inputSchema: ProjectAttendanceInputSchema,
    outputSchema: ProjectAttendanceOutputSchema,
  },
  async (input) => {
    const { subjects, totalWorkingDays, daysPassed } = input;
    
    // Assuming 5 working days in a week
    const totalWeeks = totalWorkingDays / 5;
    const weeksPassed = daysPassed / 5;

    const projections = subjects.map(subject => {
      const totalClasses = Math.floor(subject.classesPerWeek * totalWeeks);
      const conductedClasses = Math.floor(subject.classesPerWeek * weeksPassed);
      
      if (conductedClasses === 0) {
        // Not enough data to calculate
        return {
          subjectName: subject.subjectName,
          canAchieve75Percent: (totalClasses - subject.classesMissed) / totalClasses * 100 >= 75,
          projectedPercentage: (totalClasses - subject.classesMissed) / totalClasses * 100,
          currentPercentage: 100,
        };
      }

      const attendedClasses = conductedClasses - subject.classesMissed;
      const currentPercentage = (attendedClasses / conductedClasses) * 100;
      
      const remainingClasses = totalClasses - conductedClasses;
      const projectedAttendedClasses = attendedClasses + remainingClasses;
      const projectedPercentage = (projectedAttendedClasses / totalClasses) * 100;
      
      const canAchieve75Percent = projectedPercentage >= 75;

      return {
        subjectName: subject.subjectName,
        canAchieve75Percent,
        projectedPercentage: isNaN(projectedPercentage) ? 0 : projectedPercentage,
        currentPercentage: isNaN(currentPercentage) ? 0 : currentPercentage,
      };
    });

    return { projections };
  }
);
