'use server';
/**
 * @fileOverview Predicts whether a student can achieve a 75% attendance rate by attending all remaining classes.
 *
 * - projectAttendance - A function that handles the attendance projection process.
 * - ProjectAttendanceInput - The input type for the projectAttendance function.
 * - ProjectAttendanceOutput - The return type for the projectAttendance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectAttendanceInputSchema = z.object({
  currentAttendancePercentage: z
    .number()
    .describe('The current attendance percentage of the student.'),
  daysAbsent: z.number().describe('The number of days the student has been absent.'),
  totalPossibleDays: z
    .number()
    .describe('The total number of possible attendance days in the semester.'),
});
export type ProjectAttendanceInput = z.infer<typeof ProjectAttendanceInputSchema>;

const ProjectAttendanceOutputSchema = z.object({
  canAchieve75Percent: z
    .boolean()
    .describe(
      'Whether the student can achieve a 75% attendance rate by attending all remaining classes.'
    ),
  attendanceIfAllAttended: z
    .number()
    .describe(
      'The final attendance percentage if the student attends all remaining classes.'
    ),
});
export type ProjectAttendanceOutput = z.infer<typeof ProjectAttendanceOutputSchema>;

export async function projectAttendance(input: ProjectAttendanceInput): Promise<ProjectAttendanceOutput> {
  return projectAttendanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'projectAttendancePrompt',
  input: {schema: ProjectAttendanceInputSchema},
  output: {schema: ProjectAttendanceOutputSchema},
  prompt: `You are an expert attendance calculator.

You will receive the current attendance percentage, the number of days the student has been absent, and the total number of possible attendance days in the semester.

Calculate whether the student can achieve a 75% attendance rate if they attend all remaining classes.

currentAttendancePercentage: {{{currentAttendancePercentage}}}
daysAbsent: {{{daysAbsent}}}
totalPossibleDays: {{{totalPossibleDays}}}
`,
});

const projectAttendanceFlow = ai.defineFlow(
  {
    name: 'projectAttendanceFlow',
    inputSchema: ProjectAttendanceInputSchema,
    outputSchema: ProjectAttendanceOutputSchema,
  },
  async input => {
    const {currentAttendancePercentage, daysAbsent, totalPossibleDays} = input;

    const remainingDays = totalPossibleDays - daysAbsent;

    const attendanceIfAllAttended = (remainingDays / totalPossibleDays) * 100;
    const canAchieve75Percent = attendanceIfAllAttended >= 75;

    return {
      canAchieve75Percent: canAchieve75Percent,
      attendanceIfAllAttended: attendanceIfAllAttended,
    };
  }
);
