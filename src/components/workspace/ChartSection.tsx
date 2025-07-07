'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FailCaseData } from '@/services/workspace.service'

interface ChartSectionProps {
  handleTimeChange: (time: string) => void
  failCaseData: FailCaseData[]
}

export function ChartSection({ failCaseData, handleTimeChange }: ChartSectionProps) {
  const [timeFilter, setTimeFilter] = useState('Last 7 days')

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value)
    handleTimeChange(value)
  }

  const dataWithX = failCaseData.map((d, i) => ({ ...d, x: i }))

  const colorMap: Record<string, string> = {
    'High Risk': '#F44336',
    'Medium Risk': '#FF9800',
    'Low Risk': '#FFEB3B',
  }

  return (
    <Card className="bg-black/40 border-none mb-2">
      <CardContent className="p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6">
          <h3 className="text-lg font-semibold text-white mb-4 lg:mb-0">Fail case</h3>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-full sm:w-32 bg-none border-none text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="Last 7 days" className="text-white">
                  Last 7 days
                </SelectItem>
                <SelectItem value="Last 30 days" className="text-white">
                  Last 30 days
                </SelectItem>
                <SelectItem value="Last 90 days" className="text-white">
                  Last 90 days
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-48 lg:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataWithX}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />

              <XAxis
                dataKey="x"
                type="number"
                domain={[-0.5, dataWithX.length - 0.5]}
                ticks={dataWithX.map((d) => d.x)}
                tickFormatter={(x: number) => dataWithX[x]?.category || ''}
                tickLine={false}
                axisLine={false}
                interval={0}
              />

              <YAxis
                domain={[0, 'dataMax + 10']}
                tickFormatter={(v) => `${v}%`}
                tickLine={false}
                axisLine={false}
              />

              <ReferenceArea x1={-0.48} x2={1.46} fill="#000000" fillOpacity={0.2} />
              <ReferenceArea x1={1.54} x2={3.46} fill="#000000" fillOpacity={0.2} />
              <ReferenceArea x1={3.54} x2={4.46} fill="#000000" fillOpacity={0.2} />

              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {dataWithX.map((entry, index) => (
                  <Cell key={`category-cell-${index}`} fill={colorMap[entry.group]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
