'use client'

import { ChangeEvent, DragEvent, useCallback, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FileText, Upload, X } from 'lucide-react'
import { ErrorModal } from '@/components/modals/ErrorModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface UploadedFile {
  id: string
  name: string
  size: number
  file: File
}

export default function CreateTestSet() {
  const fileIdCounterRef = useRef(1)
  const params = useParams()
  const workspaceId = params.id as string
  const [testSetName, setTestSetName] = useState('')
  const [description, setDescription] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState('')
  const [nameError, setNameError] = useState('')
  const [descriptionError, setDescriptionError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [messageErrorModal, setMessageErrorModal] = useState({
    title: '',
    description: '',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i]
  }

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel']
    const allowedExtensions = ['.csv']
    const maxSize = 1 * 1024 * 1024 // 1MB

    if (file.size > maxSize) {
      setShowErrorModal(true)
      setMessageErrorModal({
        title: 'File Too Large',
        description: 'The file size exceeds 1 MB. Please upload a smaller file.',
      })
      return 'File size must be less than 1MB'
    }

    const hasValidType = allowedTypes.includes(file.type)
    const hasValidExtension = allowedExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    )

    if (!hasValidType && !hasValidExtension) {
      setShowErrorModal(true)
      setMessageErrorModal({
        title: 'Not CSV (File type incorrect)',
        description:
          'Only .csv files are supported. Please upload a valid Test Set CSV file.',
      })
      return 'Only CSV files are allowed'
    }

    return null
  }

  const handleFileSelect = useCallback(
    async (files: FileList) => {
      const newFiles: UploadedFile[] = []
      const errors: string[] = []
      const listNameFileErrors: string[] = []
      const formData = new FormData()
      uploadedFiles.forEach((file) => {
        formData.append('files', file.file)
      })

      Array.from(files).forEach((file) => {
        const error = validateFile(file)
        if (error) {
          errors.push(`${file.name}: ${error}`)
          listNameFileErrors.push(file.name)
        } else {
          const isDuplicate = uploadedFiles.some(
            (existingFile) =>
              existingFile.name === file.name && existingFile.size === file.size
          )

          if (!isDuplicate) {
            newFiles.push({
              id: String(fileIdCounterRef.current++),
              name: file.name,
              size: file.size,
              file: file,
            })
          } else {
            errors.push(`${file.name}: File already exists`)
            listNameFileErrors.push(file.name)
          }
        }
        formData.append('files', file)
      })

      const response: any = await fetch(
        `/api/workspaces/${workspaceId}/test-sets/check-file-csv`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = (await response.json())?.data ?? []

      data.forEach((file: any) => {
        const bytes = new Uint8Array([...file.filename].map((c) => c.charCodeAt(0)))
        const decoder = new TextDecoder('utf-8')
        file.filename = decoder.decode(bytes)

        if (file?.error?.length > 0 && !listNameFileErrors.includes(file.filename)) {
          errors.push(
            `${file.filename}: Make sure all mandatory fields are included and correctly formatted.`
          )
        }
      })

      if (errors.length > 0) {
        setError(errors.join('<br/>'))
      } else {
        setError('')
      }

      if (newFiles.length > 0) {
        setUploadedFiles((prev) => [...prev, ...newFiles])
      }
    },
    [uploadedFiles, workspaceId]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileSelect(files)
      }
    },
    [handleFileSelect]
  )

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files)
    }
  }

  const removeFile = (fileId: string) => {
    const errors = error.split('<br/>')
    const uploadedFile: any = uploadedFiles.find((file) => file.id === fileId)
    const updatedErrors = errors.filter(
      (err: string) => err?.indexOf(uploadedFile?.name) === -1
    )
    setError(updatedErrors.join('<br/>'))
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleSubmit = async () => {
    // Reset errors
    setNameError('')
    setDescriptionError('')

    let hasErrors = false

    // Validate Test Set name
    if (!testSetName.trim()) {
      setNameError('Test Set name is required')
      hasErrors = true
    }

    // Validate Description
    if (!description.trim()) {
      setDescriptionError('Description is required')
      hasErrors = true
    }

    // If there are validation errors, don't proceed
    if (hasErrors) {
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare files array from uploaded files
      const filesToUpload = uploadedFiles.map((uploadedFile) => uploadedFile.file)

      // Call internal API to create test set
      const formData = new FormData()
      formData.append('testSetName', testSetName.trim())
      formData.append('description', description.trim())

      // Append all files
      filesToUpload.forEach((file) => {
        formData.append('files', file)
      })

      // Validate file
      const responseCheckFile: any = await fetch(
        `/api/workspaces/${workspaceId}/test-sets/check-file-csv`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!responseCheckFile.ok) {
        setError('')
        const errorData = await responseCheckFile.json().catch(() => ({}))
        console.info('Error code from API:', errorData.code)
        const errorMessage =
          errorData.message ||
          errorData.response?.data?.message ||
          'There was an error updating your workspace. Please try again.'
        setShowErrorModal(true)
        setMessageErrorModal({
          title: 'Unknown error',
          description: errorMessage,
        })
      } else {
        const data = (await responseCheckFile.json())?.data ?? []
        const errors: string[] = []
        data.forEach((file: any) => {
          const bytes = new Uint8Array([...file.filename].map((c) => c.charCodeAt(0)))
          const decoder = new TextDecoder('utf-8')
          file.filename = decoder.decode(bytes)

          if (file?.error?.length > 0) {
            errors.push(
              `${file.filename}: Make sure all mandatory fields are included and correctly formatted.`
            )
          }
        })

        if (errors.length > 0) {
          setError(errors.join('<br/>'))
        } else {
          setError('')
        }
      }

      const response = await fetch(`/api/workspaces/${workspaceId}/test-sets`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.info('Error code from API:', errorData.code)

        if (errorData.code === 'ERR_INVALID_CSV_FORMAT') {
          setShowErrorModal(true)
          setMessageErrorModal({
            title: 'Your data doesn’t match the required format.',
            description:
              'Make sure all mandatory fields are included and correctly formatted.',
          })
        } else {
          const errorMessage =
            errorData.message ||
            errorData.response?.data?.message ||
            'There was an error updating your workspace. Please try again.'
          setShowErrorModal(true)
          setMessageErrorModal({
            title: 'Unknown error',
            description: errorMessage,
          })
        }
      } else {
        await response.json() // Parse response but don't store if not needed

        // Show success toast
        toast({
          title: 'Test set created successfully!',
          description: `"${testSetName}" has been created with ${filesToUpload.length} file(s).`,
          variant: 'default',
          duration: 5000,
        })

        // Navigate back to workspace page
        router.push(`/workspace/${workspaceId}`)
      }
    } catch (error: any) {
      console.error('Failed to create test set:', error)
      const errorMessage =
        error.message ||
        error.response?.data?.message ||
        'There was an error updating your workspace. Please try again.'
      setShowErrorModal(true)
      setMessageErrorModal({
        title: 'Unknown error',
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push(`/workspace`)
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Create Test Set</h1>
        <p className="text-slate-400 text-sm mt-1">
          Required fields are marked with an asterisk (*).
        </p>
      </div>

      {/* Form Content */}
      <div className="max-w-none">
        {/* Form */}
        <div className="space-y-6">
          {/* Test Set Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Test Set name*
            </label>
            <Input
              value={testSetName}
              onChange={(e) => {
                setTestSetName(e.target.value)
                if (nameError) setNameError('') // Clear error when user starts typing
              }}
              onBlur={() => {
                if (!testSetName.trim()) {
                  setNameError('Test Set name is required')
                }
              }}
              className={`w-full bg-neutral-700 border text-white placeholder-slate-400 focus:ring-blue-500 ${
                nameError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-neutral-600 focus:border-blue-500'
              }`}
              placeholder="Enter test set name"
            />
            {nameError && <p className="text-red-400 text-sm mt-1">{nameError}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Description for this Test Sets*
            </label>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                if (descriptionError) setDescriptionError('') // Clear error when user starts typing
              }}
              onBlur={() => {
                if (!description.trim()) {
                  setDescriptionError('Description is required')
                }
              }}
              className={`w-full bg-neutral-700 border text-white placeholder-slate-400 focus:ring-blue-500 min-h-[100px] ${
                descriptionError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-neutral-600 focus:border-blue-500'
              }`}
              placeholder="Enter test set description"
            />
            {descriptionError && (
              <p className="text-red-400 text-sm mt-1">{descriptionError}</p>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-4">
              Upload your own Test Set
            </label>
            <div className="bg-neutral-700 rounded-lg p-4 lg:p-6 border border-neutral-600">
              <label className="block text-sm font-bold text-white mb-2">
                File Upload
              </label>
              <p className="text-slate-400 text-sm mb-4">
                Upload your CSV file (maximum size: 1 MB). Make sure the file is properly
                formatted and within the allowed size limit
              </p>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-blue-500 bg-neutral-700'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium mb-2 text-sm lg:text-base">
                      Drag your file(s) to start uploading
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="h-px bg-white flex-1"></div>
                      <span className="text-white text-sm">OR</span>
                      <div className="h-px bg-white flex-1"></div>
                    </div>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-blue-700 text-blue-600 px-4 lg:px-6 py-2 text-sm lg:text-base hover:text-white"
                  >
                    Browse files
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-slate-400 mt-4">Only support .csv files</p>
              {/* Error Message */}
              {error && (
                <div className="mt-2 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                  <p
                    className="text-red-400 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: error,
                    }}
                  />
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-4">
                  <h4 className="text-sm font-medium text-neutral-300">
                    Uploaded Files ({uploadedFiles.length})
                  </h4>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-neutral-700 rounded-lg border-[#E7E7E7] border"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-slate-400" />
                        <div>
                          <p className="text-white font-medium">{file.name}</p>
                          <p className="text-slate-400 text-sm">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col lg:flex-row lg:justify-end space-y-4 lg:space-y-0 lg:space-x-4 mt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full lg:w-auto border-none text-blue-500 hover:bg-slate-700 font-bold"
          >
            Back to Workspace List
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold disabled:opacity-50"
            disabled={!testSetName.trim() || !description.trim() || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Test Set'}
          </Button>
        </div>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={messageErrorModal.title}
        description={messageErrorModal.description}
      />
    </div>
  )
}
