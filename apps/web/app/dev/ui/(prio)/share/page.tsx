'use client'

import { DebugScenarioWrapper, widthVariants } from '@/components/debug/debug-scenario-wrapper'
import { ShareDialogContent } from '@/components/share/content-all'
import type { DialogSharedPerson } from '@/components/share/dialog'
import { Button } from '@/components/ui/button'
import { Check, LucideLink, LucideUser, LucideUserPlus } from 'lucide-react'
import { Fragment, type ReactNode, useState } from 'react'

const initialMockPeople: () => DialogSharedPerson[] = () => [
  { id: '1', name: 'Alice Wonderland', image: 'https://via.placeholder.com/40/FFC0CB/000000?Text=A', role: 'editor' },
  { id: '2', name: 'Bob The Builder', image: 'https://via.placeholder.com/40/ADD8E6/000000?Text=B', role: 'viewer' },
  { id: 'owner-id', name: 'Charlie Owner', image: 'https://via.placeholder.com/40/90EE90/000000?Text=C', role: 'editor', isOwner: true },
]

interface RoleOption {
  value: string
  label: string
  description: string
}

const defaultRoles: RoleOption[] = [
  { value: 'editor', label: 'Editor', description: 'Can edit and manage settings' },
  { value: 'viewer', label: 'Viewer', description: 'Can view and comment' },
]

interface AccessTypeOption {
  value: string
  label: string
  description: string
  icon: ReactNode
}
const defaultAccessTypes: AccessTypeOption[] = [
  { value: '1', label: 'Restricted', description: 'Only invited people can access', icon: <LucideUser className="h-4 w-4" /> },
  { value: '2', label: 'Public', description: 'Anyone with the link can view', icon: <LucideUserPlus className="h-4 w-4" /> },
]

interface ShareScenario {
  scenarioTitle: string
  props: {
    canManagePermissions: boolean
    isLoading: boolean
    initialPeople?: DialogSharedPerson[]
    defaultRestricted?: boolean
  }
  customWidthVariants?: (typeof widthVariants)[number][]
}

const shareScenarios: ShareScenario[] = [
  {
    scenarioTitle: 'Full Control (Editable)',
    props: {
      canManagePermissions: true,
      isLoading: false,
      defaultRestricted: true,
    },
  },
  {
    scenarioTitle: 'View Only (No Permissions)',
    props: {
      canManagePermissions: false,
      isLoading: false,
      defaultRestricted: false,
    },
    customWidthVariants: widthVariants.filter((v) => v.name.startsWith('SM (max-w-sm') || v.name.startsWith('LG (max-w-lg')),
  },
  {
    scenarioTitle: 'Loading State',
    props: {
      canManagePermissions: true,
      isLoading: true,
      defaultRestricted: true,
    },
    customWidthVariants: [widthVariants.find((v) => v.name.startsWith('MD (max-w-md'))!],
  },
  {
    scenarioTitle: 'Empty State (No initial people)',
    props: {
      canManagePermissions: true,
      isLoading: false,
      initialPeople: [],
      defaultRestricted: true,
    },
    customWidthVariants: widthVariants.filter((v) => v.name.startsWith('XS (max-w-xs') || v.name.startsWith('Full (max-w-full)')),
  },
]

function ShareDialogInstanceWrapper({
  scenarioTitle,
  scenarioProps,
  dialogTitle,
}: {
  scenarioTitle: string
  scenarioProps: ShareScenario['props']
  dialogTitle: string
}) {
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  const [currentPeople, setCurrentPeople] = useState<DialogSharedPerson[]>(scenarioProps.initialPeople ?? initialMockPeople())
  const [currentSelectedAccessType, setCurrentSelectedAccessType] = useState<string>(scenarioProps.defaultRestricted ? '1' : '2')

  const handleShare = (emailOrUsername: string) => {
    console.log(`[${scenarioTitle}] Share with:`, emailOrUsername)
    const newPerson: DialogSharedPerson = {
      id: `new-${Date.now()}`,
      name: emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername,
      role: 'viewer',
    }
    setCurrentPeople((prev) => [...prev, newPerson])
  }

  const handleCopyLink = () => {
    console.log(`[${scenarioTitle}] Link copied!`)
    setIsLinkCopied(true)
    setTimeout(() => setIsLinkCopied(false), 2000)
  }

  const handleAccessChange = (access: string) => {
    console.log(`[${scenarioTitle}] Access changed to:`, access)
    setCurrentSelectedAccessType(access)
  }

  const handleRoleChange = (personId: string, role: string) => {
    console.log(`[${scenarioTitle}] Role for ${personId} to:`, role)
    setCurrentPeople((prev) => prev.map((p) => (p.id === personId ? { ...p, role } : p)))
  }

  const handleRemovePerson = (personId: string) => {
    console.log(`[${scenarioTitle}] Removed person:`, personId)
    setCurrentPeople((prev) => prev.filter((p) => p.id !== personId))
  }

  const handleEmbeddedClose = () => {
    console.log(`[${scenarioTitle}] ShareDialogContent: Done button clicked.`)
  }

  return (
    <div className="space-y-4 rounded-lg bg-card p-4 shadow-sm">
      <ShareDialogContent
        title={dialogTitle}
        people={currentPeople}
        isLinkCopied={isLinkCopied}
        onShare={handleShare}
        onCopyLink={handleCopyLink}
        onAccessChange={handleAccessChange}
        onRoleChange={handleRoleChange}
        onRemove={handleRemovePerson}
        canManagePermissions={scenarioProps.canManagePermissions}
        roles={defaultRoles}
        accessTypes={defaultAccessTypes}
        selectedAccessType={currentSelectedAccessType}
        isLoading={scenarioProps.isLoading}
        handleClose={handleEmbeddedClose}
      />
    </div>
  )
}

export default function SharePage() {
  return (
    <div className="space-y-12 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Share Dialog Scenarios</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Showcasing <code>ShareDialogContent</code> in various configurations and sizes using <code>DebugScenarioWrapper</code>. Each
          scenario below is rendered across multiple responsive widths.
        </p>
      </div>
      {shareScenarios.map((scenario, index) => (
        <div key={scenario.scenarioTitle} className="mb-10 rounded-xl border bg-slate-50/50 p-4 dark:bg-slate-800/20">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Scenario {index + 1}: {scenario.scenarioTitle}
          </h3>
          <DebugScenarioWrapper
            title={`Component: ShareDialogContent - ${scenario.scenarioTitle}`}
            variants={scenario.customWidthVariants}
            showVariantDetails={true}
          >
            <ShareDialogInstanceWrapper
              scenarioTitle={scenario.scenarioTitle}
              scenarioProps={scenario.props}
              dialogTitle={`Share: ${scenario.scenarioTitle}`}
            />
          </DebugScenarioWrapper>
        </div>
      ))}
    </div>
  )
}
