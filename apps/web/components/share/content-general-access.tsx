'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface ShareGeneralAccessProps {
  selectedAccessType: string
  onAccessChange?: (accessType: string) => void
  accessTypes: { value: string; label: string; description?: string; icon?: React.ReactNode }[]
}

export function ShareGeneralAccess({ selectedAccessType, onAccessChange, accessTypes }: ShareGeneralAccessProps) {
  return (
    <>
      <h3 className="text-sm font-medium mb-2">General access</h3>
      <Select value={selectedAccessType} onValueChange={onAccessChange}>
        <SelectTrigger className="w-full justify-start text-left h-auto whitespace-normal min-h-[40px]">
          <SelectValue placeholder="Select access type" />
        </SelectTrigger>
        <SelectContent>
          {accessTypes.map((type) => (
            <SelectItem key={type.value} value={type.value} className="py-2">
              <div className="flex items-start gap-2">
                {type.icon && <div className="mt-0.5 text-muted-foreground shrink-0">{type.icon}</div>}
                <div>
                  <p className="text-sm font-medium">{type.label}</p>
                  {type.description && <p className="text-xs text-muted-foreground">{type.description}</p>}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
