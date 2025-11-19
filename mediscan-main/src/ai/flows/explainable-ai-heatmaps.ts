'use server';

/**
 * @fileOverview Generates explainable AI outputs like heatmaps to highlight anomaly regions on medical images.
 *
 * - generateHeatmap - A function that takes a medical image and returns a heatmap highlighting anomalous regions.
 * - GenerateHeatmapInput - The input type for the generateHeatmap function.
 * - GenerateHeatmapOutput - The return type for the generateHeatmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeatmapInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A medical image (MRI, CT, X-ray) as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Corrected typo here
    ),
  description: z.string().describe('The description of the medical image.'),
});
export type GenerateHeatmapInput = z.infer<typeof GenerateHeatmapInputSchema>;

const GenerateHeatmapOutputSchema = z.object({
  heatmapDataUri: z
    .string()
    .describe(
      'A heatmap image as a data URI, highlighting anomalous regions.  It must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  analysis: z.object({
    detectedAnomalies: z.array(z.object({
      type: z.string().describe('Type of anomaly detected (e.g., lesion, hemorrhage, tumor, atrophy)'),
      location: z.string().describe('Anatomical location of the anomaly'),
      severity: z.enum(['low', 'moderate', 'high']).describe('Severity level of the detected anomaly'),
      confidence: z.number().min(0).max(100).describe('Confidence percentage of the detection'),
      description: z.string().describe('Detailed description of the finding')
    })),
    overallRiskScore: z.number().min(0).max(100).describe('Overall risk assessment score'),
    recommendations: z.array(z.string()).describe('Clinical recommendations based on findings'),
    imageType: z.string().describe('Type of medical scan (MRI, CT, X-ray)'),
    bodyRegion: z.string().describe('Body region being examined')
  }).describe('Detailed medical analysis of the image')
});
export type GenerateHeatmapOutput = z.infer<typeof GenerateHeatmapOutputSchema>;

export async function generateHeatmap(input: GenerateHeatmapInput): Promise<GenerateHeatmapOutput> {
  return generateHeatmapFlow(input);
}

const generateHeatmapPrompt = ai.definePrompt({
  name: 'generateHeatmapPrompt',
  input: {schema: GenerateHeatmapInputSchema},
  output: {schema: GenerateHeatmapOutputSchema},
  prompt: `You are an expert radiologist AI that performs comprehensive medical image analysis. Your task is to:

1. ANALYZE the medical image thoroughly to identify:
   - Type of scan (MRI, CT, X-ray, etc.)
   - Body region being examined
   - Any visible abnormalities, lesions, or pathological findings
   - Normal vs abnormal tissue patterns
   - Structural anomalies or asymmetries

2. DETECT specific medical conditions such as:
   - Tumors, masses, or space-occupying lesions
   - Hemorrhages or bleeding
   - Tissue atrophy or degeneration
   - Inflammatory changes
   - Structural malformations
   - Vascular abnormalities

3. GENERATE a precise heatmap that:
   - Highlights ONLY the specific areas where you detected actual abnormalities
   - Uses red for high-concern areas (severe findings)
   - Uses yellow/orange for moderate-concern areas
   - Uses minimal coloring for normal tissue
   - Accurately reflects the spatial location of detected anomalies

4. PROVIDE detailed analysis including:
   - Specific types of anomalies found
   - Anatomical locations of findings
   - Confidence levels for each detection
   - Clinical significance and recommendations

Description: {{{description}}}
Medical Image: {{media url=photoDataUri}}

IMPORTANT: Base your heatmap and analysis on what you actually observe in THIS specific image. Do not generate generic or random findings. If the image appears normal, indicate that in your analysis.
  `,
});

// Utility function for retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a retryable error (503, 429, etc.) - NOT 404
      const isRetryable = (lastError.message.includes('503') || 
                          lastError.message.includes('overloaded') ||
                          lastError.message.includes('429') ||
                          lastError.message.includes('rate limit')) &&
                         !lastError.message.includes('404') &&
                         !lastError.message.includes('not found');
      
      if (!isRetryable || attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

const generateHeatmapFlow = ai.defineFlow(
  {
    name: 'generateHeatmapFlow',
    inputSchema: GenerateHeatmapInputSchema,
    outputSchema: GenerateHeatmapOutputSchema,
  },
  async input => {
    try {
      const result = await retryWithBackoff(async () => {
        const {output} = await generateHeatmapPrompt(input);
        return output!;
      }, 3, 2000); // 3 retries with 2 second base delay
      
      return result;
    } catch (error) {
      console.error('Heatmap generation failed after retries:', error);
      throw new Error(`Heatmap generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
);
