import EvaluationCharts from '@/components/evaluation-charts';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Model Performance
        </h1>
        <p className="text-muted-foreground">
          Evaluating the diagnostic accuracy of MediScan AI.
        </p>
      </div>
      <EvaluationCharts />
    </div>
  );
}
