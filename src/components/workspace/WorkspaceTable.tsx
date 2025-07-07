import { Edit } from 'lucide-react'
import { ActionMenu, ActionMenuItem } from '@/components/ui/ActionMenu'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TableCard, TableCardContent } from '@/components/ui/TableCard'
import { TableHeader } from '@/components/ui/TableHeader'
import { TableCell, TableRow } from '@/components/ui/TableRow'

interface Workspace {
  id: string
  name: string
  lastUpdated: string
}

interface WorkspaceTableProps {
  workspaces: Workspace[]
  onWorkspaceClick: (workspaceId: string) => void
  onDeleteWorkspace: (workspace: Workspace) => void
  onCreateTestSet: (workspaceId: string) => void
  onEditWorkspace: (workspace: Workspace) => void
}

export function WorkspaceTable({
  workspaces,
  onWorkspaceClick,
  onDeleteWorkspace,
  onCreateTestSet,
  onEditWorkspace,
}: WorkspaceTableProps) {
  const getActionMenuItems = (workspace: Workspace): ActionMenuItem[] => [
    {
      label: 'View Workspace',
      onClick: () => onWorkspaceClick(workspace.id),
    },
    {
      label: 'Create Test Set',
      onClick: () => onCreateTestSet(workspace.id),
    },
    {
      label: 'Delete',
      onClick: () => onDeleteWorkspace(workspace),
      variant: 'destructive',
    },
  ]

  return (
    <Card className="bg-black/40 border-none">
      <CardHeader className="pb-0">
        <TableHeader
          title="Your Workspaces"
          columns={[
            { label: 'Workspace Name', className: 'col-span-8 text-left' },
            { label: 'Last Updated', className: 'col-span-3 text-center' },
            { label: 'Action', className: 'col-span-1 text-center' },
          ]}
        />
      </CardHeader>
      <CardContent>
        {/* Mobile Cards */}
        {workspaces.map((workspace) => (
          <TableCard key={workspace.id}>
            <TableCardContent
              title={
                <button
                  onClick={() => onWorkspaceClick(workspace.id)}
                  className="text-left"
                >
                  <h3 className="text-white font-medium text-base hover:text-blue-300 transition-colors">
                    {workspace.name}
                  </h3>
                </button>
              }
              titleActions={
                <button
                  onClick={() => onEditWorkspace(workspace)}
                  className="p-1 hover:bg-slate-700 rounded"
                >
                  <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                </button>
              }
              subtitle={`Last Updated: ${workspace.lastUpdated}`}
              actions={<ActionMenu items={getActionMenuItems(workspace)} />}
            />
          </TableCard>
        ))}

        {/* Desktop Table Rows */}
        <div className="hidden lg:block">
          {workspaces.map((workspace) => (
            <TableRow key={workspace.id}>
              <TableCell className="col-span-8 flex items-center justify-start">
                <div className="text-left w-full flex items-center gap-2">
                  <button
                    onClick={() => onWorkspaceClick(workspace.id)}
                    className="text-left"
                  >
                    <span className="text-white font-normal hover:text-blue-300 transition-colors">
                      {workspace.name}
                    </span>
                  </button>
                  <button
                    onClick={() => onEditWorkspace(workspace)}
                    className="p-1 hover:bg-slate-700 rounded"
                  >
                    <Edit className="h-4 w-4 text-slate-400 hover:text-white" />
                  </button>
                </div>
              </TableCell>
              <TableCell className="col-span-3 text-white font-normal text-sm flex items-center justify-center">
                {workspace.lastUpdated}
              </TableCell>
              <TableCell className="col-span-1 relative flex justify-center">
                <ActionMenu items={getActionMenuItems(workspace)} />
              </TableCell>
            </TableRow>
          ))}
        </div>

        {/* Empty State */}
        {workspaces.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No workspaces found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
