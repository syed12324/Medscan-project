'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const performanceData = [
  { name: 'Accuracy', value: 0.95, fill: 'hsl(var(--chart-1))' },
  { name: 'Precision', value: 0.92, fill: 'hsl(var(--chart-2))' },
  { name: 'Recall', value: 0.94, fill: 'hsl(var(--chart-3))' },
  { name: 'F1-Score', value: 0.93, fill: 'hsl(var(--chart-4))' },
];

const rocData = [
  { fpr: 0.0, tpr: 0.0 },
  { fpr: 0.1, tpr: 0.5 },
  { fpr: 0.2, tpr: 0.75 },
  { fpr: 0.3, tpr: 0.85 },
  { fpr: 0.4, tpr: 0.9 },
  { fpr: 0.5, tpr: 0.93 },
  { fpr: 0.6, tpr: 0.95 },
  { fpr: 0.7, tpr: 0.97 },
  { fpr: 0.8, tpr: 0.98 },
  { fpr: 0.9, tpr: 0.99 },
  { fpr: 1.0, tpr: 1.0 },
];

const confusionMatrix = [
  [1850, 50],
  [60, 1040],
];

const kpiData = [
  { title: 'ROC-AUC', value: '0.96', description: 'High model discriminability' },
  { title: 'Sensitivity', value: '94.0%', description: 'True Positive Rate' },
  { title: 'Specificity', value: '97.4%', description: 'True Negative Rate' },
  { title: 'Total Scans', value: '3,000', description: 'In validation set' },
];

export default function EvaluationCharts() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Overall model performance indicators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  activeBar={<Rectangle fill="hsl(var(--primary))" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ROC-AUC Curve</CardTitle>
            <CardDescription>
              Receiver Operating Characteristic (Area: 0.96).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fpr"
                  type="number"
                  label={{
                    value: 'False Positive Rate',
                    position: 'insideBottom',
                    offset: -5,
                  }}
                  stroke="hsl(var(--foreground))"
                />
                <YAxis
                  label={{
                    value: 'True Positive Rate',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                  stroke="hsl(var(--foreground))"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tpr"
                  name="Model"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={(d) => d.fpr}
                  name="Random"
                  stroke="hsl(var(--accent))"
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix</CardTitle>
          <CardDescription>
            Performance on the validation dataset (3000 scans).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="relative">
            <Table className="w-auto">
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead className="text-center font-bold">
                    Predicted: Normal
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Predicted: Anomaly
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead className="font-bold">Actual: Normal</TableHead>
                  <TableCell className="text-center text-lg font-medium text-green-600 dark:text-green-500 bg-green-500/10">
                    {confusionMatrix[0][0]}
                  </TableCell>
                  <TableCell className="text-center text-lg font-medium text-orange-600 dark:text-orange-500 bg-orange-500/10">
                    {confusionMatrix[0][1]}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableHead className="font-bold">Actual: Anomaly</TableHead>
                  <TableCell className="text-center text-lg font-medium text-orange-600 dark:text-orange-500 bg-orange-500/10">
                    {confusionMatrix[1][0]}
                  </TableCell>
                  <TableCell className="text-center text-lg font-medium text-green-600 dark:text-green-500 bg-green-500/10">
                    {confusionMatrix[1][1]}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
