// Generic interface for shared person, decoupled from specific implementation
export interface DialogSharedPerson {
  id: string
  name: string
  image?: string
  role?: string
  isOwner?: boolean
}
