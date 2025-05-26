'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash } from 'lucide-react'
import type { DialogSharedPerson } from './types'

export interface SharePeopleListProps {
  people: DialogSharedPerson[]
  roles: { value: string; label: string; description?: string }[]
  getRoleDisplayName: (roleValue: string) => string
  onRemovePerson?: (personId: string) => void | Promise<void>
  onRoleChange?: (personId: string, role: string) => void | Promise<void>
}

export function SharePeopleList({ people, roles, getRoleDisplayName, onRemovePerson, onRoleChange }: SharePeopleListProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-3">Permissions</h3>
      <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
        {people.map((person) => (
          <SharePersonItem
            key={person.id}
            person={person}
            roles={roles}
            getRoleDisplayName={getRoleDisplayName}
            onRemovePerson={onRemovePerson}
            onRoleChange={onRoleChange}
          />
        ))}
      </div>
    </div>
  )
}

interface SharePersonItemProps {
  person: DialogSharedPerson
  roles: { value: string; label: string; description?: string }[]
  getRoleDisplayName: (roleValue: string) => string
  onRemovePerson?: (personId: string) => void | Promise<void>
  onRoleChange?: (personId: string, role: string) => void | Promise<void>
}

function SharePersonItem({ person, roles, getRoleDisplayName, onRemovePerson, onRoleChange }: SharePersonItemProps) {
  return (
    <div key={person.id} className="flex items-center justify-between rounded-md p-2 hover:bg-muted/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-8 w-8 shrink-0">
          {person.image ? (
            <AvatarImage src={person.image} alt={person.name} />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary-foreground text-xs">{person.name.charAt(0).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div className="truncate">
          <p className="text-sm font-medium truncate">{person.name}</p>
          {person.role && !person.isOwner && <p className="text-xs text-muted-foreground truncate">{getRoleDisplayName(person.role)}</p>}
          {person.isOwner && <p className="text-xs text-muted-foreground truncate">Owner</p>}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!person.isOwner && onRemovePerson && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => onRemovePerson(person.id)}
            aria-label={`Remove ${person.name}`}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
        {!person.isOwner && onRoleChange && roles.length > 1 && (
          <Select value={person.role} onValueChange={(newRole) => onRoleChange(person.id, newRole)}>
            <SelectTrigger className="w-[100px] h-7 text-xs focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value} className="text-xs">
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {person.isOwner && <span className="h-7 w-[100px] flex items-center justify-start text-xs text-muted-foreground pl-3">Owner</span>}
      </div>
    </div>
  )
}
