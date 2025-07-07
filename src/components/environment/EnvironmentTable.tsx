import { ActionMenu, ActionMenuItem } from '@/components/ui/ActionMenu'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TableCard, TableCardContent } from '@/components/ui/TableCard'
import { TableHeader } from '@/components/ui/TableHeader'
import { TableCell, TableRow } from '@/components/ui/TableRow'
import { Environment } from '@/services/environment.service'

interface EnvironmentTableProps {
  environments: Environment[]
  onEnvironmentClick: (environmentId: string) => void
  onDeleteEnvironment: (environment: Environment) => void
  onEditEnvironment: (environment: Environment) => void
}

export function EnvironmentTable({
  environments,
  onEnvironmentClick,
  onDeleteEnvironment,
  onEditEnvironment,
}: EnvironmentTableProps) {
  const getActionMenuItems = (environment: Environment): ActionMenuItem[] => [
    {
      label: 'View',
      onClick: () => onEnvironmentClick(environment.id),
    },
    {
      label: 'Edit',
      onClick: () => onEditEnvironment(environment),
    },
    {
      label: 'Delete',
      onClick: () => onDeleteEnvironment(environment),
      variant: 'destructive',
    },
  ]

  return (
    <Card className="bg-black/40 border-none">
      <CardHeader className="pb-0">
        <TableHeader
          title="Your Environments"
          columns={[
            { label: 'Environment Name', className: 'col-span-8 text-left' },
            { label: 'Last Updated', className: 'col-span-3 text-center' },
            { label: 'Action', className: 'col-span-1 text-center' },
          ]}
        />
      </CardHeader>
      <CardContent>
        {/* Mobile Cards */}
        {environments.map((environment) => (
          <TableCard key={environment.id}>
            <TableCardContent
              title={
                <button
                  onClick={() => onEnvironmentClick(environment.id)}
                  className="text-left"
                >
                  <h3 className="text-white font-medium text-base hover:text-blue-300 transition-colors">
                    {environment.name}
                  </h3>
                </button>
              }
              subtitle={`Last Updated: ${environment.lastUpdated}`}
              actions={<ActionMenu items={getActionMenuItems(environment)} />}
            />
          </TableCard>
        ))}

        {/* Desktop Table Rows */}
        <div className="hidden lg:block">
          {environments.map((environment) => (
            <TableRow key={environment.id}>
              <TableCell className="col-span-8 flex items-center justify-start">
                <div className="text-left w-full flex items-center gap-2">
                  <button
                    onClick={() => onEnvironmentClick(environment.id)}
                    className="text-left"
                  >
                    <span className="text-white font-normal hover:text-blue-300 transition-colors">
                      {environment.name}
                    </span>
                  </button>
                </div>
              </TableCell>
              <TableCell className="col-span-3 text-white font-normal text-sm flex items-center justify-center">
                {environment.lastUpdated}
              </TableCell>
              <TableCell className="col-span-1 relative flex justify-center">
                <ActionMenu items={getActionMenuItems(environment)} />
              </TableCell>
            </TableRow>
          ))}
        </div>

        {/* Empty State */}
        {environments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No environments found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
