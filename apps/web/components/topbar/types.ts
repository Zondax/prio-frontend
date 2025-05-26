export interface TopBarItem {
  key: string | number
  name: string
  href: string
}

export type TopBarItems = ReadonlyArray<TopBarItem>
