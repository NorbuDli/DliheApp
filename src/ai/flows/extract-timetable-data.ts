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

const ExtractTimetableDataOutputSchema = z.object({
  classTimings: z
    .string()
    .describe('The timings of the classes in the timetable.'),
  classDurations: z
    .string()
    .describe('The durations of the classes in the timetable.'),
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

You will be provided with an image of a timetable. You will extract the class timings and durations from the image, and return them in a structured format.

Here is the timetable image:
{{media url=photoDataUri}}

Timings: {{classTimings}}
Durations: {{classDurations}}`,
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
