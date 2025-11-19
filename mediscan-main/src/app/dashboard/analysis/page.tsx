import ImageAnalyzer from '@/components/image-analyzer';

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Anomaly Detection
        </h1>
        <p className="text-muted-foreground">
          Upload a medical image to analyze for potential anomalies.
        </p>
      </div>
      <ImageAnalyzer />
    </div>
  );
}
