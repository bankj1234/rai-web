'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Download, Edit, ListFilter } from 'lucide-react'
import { FilterModal } from '@/components/modals/FilterModal'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'

interface TestCase {
  id: string
  raiDimension: string
  contentType: string
  mode: string
  status: 'Completed' | 'Failed' | 'Running' | 'Pending'
  remark?: string
}

interface TestSetDetail {
  id: string
  name: string
  description: string
  status: 'Created' | 'Queued' | 'Running' | 'Completed' | 'Errored'
  startAt: string
  environment: string
  totalTests: number
  completedTests: number
  progressPercentage: number
  totalTestCases: number
  passedCases: number
  failedCases: number
  passedPercentage: number
  failedPercentage: number
  testCases: TestCase[]
}

export default function TestSetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.id as string
  const testSetId = params.testSetId as string

  const [testSetDetail, setTestSetDetail] = useState<TestSetDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedDescription, setEditedDescription] = useState('')

  useEffect(() => {
    const fetchTestSetDetail = async () => {
      try {
        setLoading(true)
        // Mock data - replace with actual API call
        const mockData: TestSetDetail = {
          id: testSetId,
          name: 'Login API - Valid Credentials 02',
          description: 'This Test Sets validates that the login API endpoint returns a valid access token when a user submits a correct email and password. It confirms the success status code, token structure, and response time within acceptable limits.',
          status: 'Completed', // This will change based on the test set
          startAt: '9 June 2025, 14:32',
          environment: 'Home 001',
          totalTests: 60,
          completedTests: 60,
          progressPercentage: 100,
          totalTestCases: 31,
          passedCases: 28,
          failedCases: 3,
          passedPercentage: 90,
          failedPercentage: 10,
          testCases: [
            {
              id: 'TC-0001',
              raiDimension: 'Security and Safety',
              contentType: 'illegal_activity',
              mode: 'Improvise',
              status: 'Completed',
              remark: 'Test passed successfully'
            },
            {
              id: 'TC-0002',
              raiDimension: 'Data and Privacy',
              contentType: 'personal_data',
              mode: 'Strict',
              status: 'Failed',
              remark: 'Data validation failed'
            },
            {
              id: 'TC-0003',
              raiDimension: 'Reliability',
              contentType: 'system_performance',
              mode: 'Improvise',
              status: 'Running',
            },
            {
              id: 'TC-0004',
              raiDimension: 'Fairness and Bias',
              contentType: 'bias_detection',
              mode: 'Standard',
              status: 'Pending',
            },
          ]
        }

        // Simulate different statuses based on testSetId
        if (testSetId.includes('queued')) {
          mockData.status = 'Queued'
          mockData.progressPercentage = 0
          mockData.completedTests = 0
        } else if (testSetId.includes('running')) {
          mockData.status = 'Running'
          mockData.progressPercentage = 20
          mockData.completedTests = 12
        } else if (testSetId.includes('errored')) {
          mockData.status = 'Errored'
          mockData.progressPercentage = 100
        } else if (testSetId.includes('created')) {
          mockData.status = 'Created'
          mockData.progressPercentage = 0
          mockData.completedTests = 0
        }

        setTestSetDetail(mockData)
        setEditedName(mockData.name)
        setEditedDescription(mockData.description)
      } catch (error) {
        console.error('Failed to fetch test set detail:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestSetDetail()
  }, [testSetId])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Created: { className: 'bg-blue-500 text-white', label: 'Created' },
      Queued: { className: 'bg-orange-500 text-white', label: 'Queued' },
      Running: { className: 'bg-purple-500 text-white', label: 'Running' },
      Completed: { className: 'bg-green-500 text-white', label: 'Completed' },
      Errored: { className: 'bg-red-500 text-white', label: 'Errored' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.Created

    return (
      <Badge className={`${config.className} px-4 py-2 text-sm font-medium rounded-full`}>
        {config.label}
      </Badge>
    )
  }

  const getTestCaseStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-400'
      case 'Failed':
        return 'text-red-400'
      case 'Running':
        return 'text-yellow-400'
      case 'Pending':
        return 'text-gray-400'
      default:
        return 'text-gray-400'
    }
  }

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-blue-500'
      case 'Running':
        return 'bg-blue-500'
      case 'Errored':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    setSelectedFilters(filters)
    // Apply filters to test cases
  }

  const handleBackToWorkspaces = () => {
    router.push('/workspace')
  }

  const handleDownloadReport = () => {
    // Implement download report functionality
    console.log('Download report')
  }

  const handleRunTest = () => {
    // Implement run test functionality
    console.log('Run test')
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = () => {
    if (testSetDetail) {
      setTestSetDetail({
        ...testSetDetail,
        name: editedName,
        description: editedDescription,
      })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedName(testSetDetail?.name || '')
    setEditedDescription(testSetDetail?.description || '')
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-white">Loading test set details...</div>
      </div>
    )
  }

  if (!testSetDetail) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-screen">
        <div className="text-red-400">Test set not found</div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-8 pb-24">
      {/* Header with Status and Edit Button */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
        <div className="mb-4 lg:mb-0">
          <div className="text-slate-400 text-sm mb-2">Test Set Status</div>
          {getStatusBadge(testSetDetail.status)}
        </div>
        <Button
          variant="outline"
          onClick={handleEdit}
          className="border-none text-slate-300 hover:bg-slate-800 hover:text-white self-start lg:self-auto"
        >
          Edit
          <Edit className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Test Set Info Card */}
      <Card className="bg-slate-800/50 border-slate-700 mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-slate-400 text-sm mb-1">Test Set:</div>
              <div className="text-white text-lg font-medium">{testSetDetail.name}</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-sm mb-1">Start At:</div>
              <div className="text-white">{testSetDetail.startAt}</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-slate-400 text-sm mb-1">Environment:</div>
            <div className="text-white mb-4">{testSetDetail.environment}</div>
            
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-slate-400">
                {testSetDetail.completedTests} tests completed
              </span>
              <span className="text-slate-400">
                {testSetDetail.progressPercentage}%
              </span>
            </div>
            
            <Progress 
              value={testSetDetail.progressPercentage} 
              className="h-2"
            />
            <div 
              className={`h-2 rounded-full ${getProgressBarColor(testSetDetail.status)}`}
              style={{ width: `${testSetDetail.progressPercentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Set Name and Description */}
      <div className="space-y-6 mb-6">
        <div>
          <label className="block text-slate-400 text-sm mb-2">Test Set name*</label>
          {isEditing ? (
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="w-full bg-neutral-700 border border-slate-600 text-white"
            />
          ) : (
            <Input
              value={testSetDetail.name}
              readOnly
              className="w-full bg-neutral-700 border border-slate-600 text-white cursor-not-allowed"
            />
          )}
        </div>

        <div>
          <label className="block text-slate-400 text-sm mb-2">Description for this Test Sets*</label>
          {isEditing ? (
            <Textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full bg-neutral-700 border border-slate-600 text-white min-h-[100px]"
            />
          ) : (
            <Textarea
              value={testSetDetail.description}
              readOnly
              className="w-full bg-neutral-700 border border-slate-600 text-white min-h-[100px] cursor-not-allowed"
            />
          )}
        </div>

        {isEditing && (
          <div className="flex gap-4">
            <Button
              onClick={handleSaveEdit}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Total Test Cases */}
        <Card className="bg-black/40 border-none relative overflow-hidden">
          <div
            className="absolute left-0 top-0 w-20 h-full bg-contain bg-no-repeat bg-left opacity-40"
            style={{ backgroundImage: 'url(/images/blockchain.png)' }}
          />
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-center">
              <div className="ml-[60px]">
                <p className="text-navy-100 text-sm">Total</p>
                <p className="text-white text-lg">Test Cases:</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-light text-white">{testSetDetail.totalTestCases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Passed Cases */}
        <Card className="bg-black/40 border-none">
          <CardContent className="p-6">
            <div className="text-navy-100 text-sm">Test Cases</div>
            <div className="flex justify-between items-end mt-2">
              <p className="text-white text-lg">Passed:</p>
              <span className="text-3xl font-light text-green-400">
                {testSetDetail.passedCases} ({testSetDetail.passedPercentage}%)
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Failed Cases */}
        <Card className="bg-black/40 border-none">
          <CardContent className="p-6">
            <div className="text-navy-100 text-sm">Test Cases</div>
            <div className="flex justify-between items-end mt-2">
              <p className="text-white text-lg">Failed:</p>
              <span className="text-3xl font-light text-red-400">
                {testSetDetail.failedCases} ({testSetDetail.failedPercentage}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Test Cases Table */}
      <Card className="bg-black/40 border-none">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-4 lg:mb-0">
              All Test Cases
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Filters</span>
              <ListFilter
                onClick={() => setIsFilterModalOpen(true)}
                className="h-4 w-4 text-slate-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">
                    <Checkbox className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950 rounded" />
                  </th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Test Case ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">RAI Dimension</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Content Type</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Mode</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Remark</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {testSetDetail.testCases.map((testCase) => (
                  <tr key={testCase.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                    <td className="py-4 px-4">
                      <Checkbox className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950 rounded" />
                    </td>
                    <td className="py-4 px-4 text-white">{testCase.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="outline"
                          className="text-xs text-red-400 border-red-400 rounded-sm"
                        >
                          RAI
                        </Badge>
                        <span className="text-white text-sm">- {testCase.raiDimension}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white">{testCase.contentType}</td>
                    <td className="py-4 px-4 text-white">{testCase.mode}</td>
                    <td className="py-4 px-4">
                      <span className={`${getTestCaseStatusColor(testCase.status)} text-sm font-bold`}>
                        {testCase.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-400 text-sm">{testCase.remark || '-'}</td>
                    <td className="py-4 px-4">
                      <ActionMenu
                        items={[
                          {
                            label: 'View Details',
                            onClick: () => console.log('View details', testCase.id),
                          },
                          {
                            label: 'Rerun Test',
                            onClick: () => console.log('Rerun test', testCase.id),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {testSetDetail.testCases.map((testCase) => (
              <div key={testCase.id} className="bg-black/40 rounded-lg p-4 border-none">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox className="border-gray-500 data-[state=checked]:bg-neutral-200 data-[state=checked]:text-neutral-950 bg-neutral-950 rounded" />
                    <span className="text-white font-medium text-sm">{testCase.id}</span>
                    <Badge className="bg-red-600 text-white text-xs">RAI</Badge>
                  </div>
                  <ActionMenu
                    items={[
                      {
                        label: 'View Details',
                        onClick: () => console.log('View details', testCase.id),
                      },
                      {
                        label: 'Rerun Test',
                        onClick: () => console.log('Rerun test', testCase.id),
                      },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-white font-medium text-sm">- {testCase.raiDimension}</p>
                    <p className="text-slate-300 text-xs">{testCase.contentType}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs">{testCase.mode}</span>
                    <span className={`${getTestCaseStatusColor(testCase.status)} text-xs font-bold`}>
                      {testCase.status}
                    </span>
                  </div>
                  {testCase.remark && (
                    <p className="text-slate-400 text-xs">{testCase.remark}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacer for fixed footer */}
      <div className="h-[100px]"></div>

      {/* Fixed Footer */}
      <div className="fixed rounded-xl bottom-2 left-0 right-0 bg-[#020F35] border-none p-4 lg:ml-[285px] lg:mr-[30px] mr-[20px] ml-[20px] z-10">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
          <Button
            variant="ghost"
            onClick={handleBackToWorkspaces}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 w-full lg:w-auto"
          >
            Back to workspaces
          </Button>
          
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              className="border-blue-400 text-blue-400 hover:bg-slate-700 w-full lg:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button
              onClick={handleRunTest}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full lg:w-auto touch-manipulation rounded-sm px-12"
              disabled={testSetDetail.status === 'Running'}
            >
              {testSetDetail.status === 'Running' ? 'Running...' : 'Run Test'}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilters={selectedFilters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  )
}