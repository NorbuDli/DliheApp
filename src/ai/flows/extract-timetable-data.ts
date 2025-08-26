'use server';

/**
 * @fileOverview This flow extracts timetable data from an image.
 *
 * - extractTimetableData - Extracts class timings and durations from an image of a timetable.
 * - ExtractTimetableDataInput - The input type for the extractTimetableData function.
 * - ExtractTimetableDataOutput - The return type for the extractTimetableData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTimetableDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a timetable, as a data URI that must include a MIME type and use Base64 encoding. Expected format: data:<mimetype>;base64,<encoded_data>.'
    ),
});
export type ExtractTimetableDataInput = z.infer<typeof ExtractTimetableDataInputSchema>;

const SubjectSchema = z.object({
  subjectName: z.string().describe('The name of the subject.'),
  classesPerWeek: z.number().describe('The number of classes per week for the subject.'),
});

const ExtractTimetableDataOutputSchema = z.object({
  subjects: z.array(SubjectSchema).describe('A list of subjects and their weekly class counts.'),
});
export type ExtractTimetableDataOutput = z.infer<typeof ExtractTimetableDataOutputSchema>;

export async function extractTimetableData(input: ExtractTimetableDataInput): Promise<ExtractTimetableDataOutput> {
  return extractTimetableDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTimetableDataPrompt',
  input: {schema: ExtractTimetableDataInputSchema},
  output: {schema: ExtractTimetableDataOutputSchema},
  prompt: `You are an expert at extracting timetable data from images.

You will be provided with an image of a timetable. You will extract the subjects and the number of classes per week for each subject.

Here is the timetable image:
{{media url=photoDataUri}}
`,
});

const extractTimetableDataFlow = ai.defineFlow(
  {
    name: 'extractTimetableDataFlow',
    inputSchema: ExtractTimetableDataInputSchema,
    outputSchema: ExtractTimetableDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
