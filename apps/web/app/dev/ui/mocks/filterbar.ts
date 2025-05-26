import { FilterTagType, FilterTag as GrpcFilterTag } from '@prio-grpc/entities/proto/api/v1/event_pb'

export interface MockFilterTagAsObject {
  type: FilterTagType
  value: string
  displayText: string
  id?: string
  name?: string
}

export class MockFilterTag extends GrpcFilterTag {
  private _id: string
  private _name: string

  constructor(id: string, name: string, type: FilterTagType, value: string, displayText: string) {
    super()
    this._id = id
    this._name = name
    this.setType(type)
    this.setValue(value)
    this.setDisplayText(displayText)
  }

  getId(): string {
    return this._id
  }

  getName(): string {
    return this._name
  }

  setId(id: string): MockFilterTag {
    this._id = id
    return this
  }

  setName(name: string): MockFilterTag {
    this._name = name
    return this
  }

  toObject(includeInstance?: boolean): MockFilterTagAsObject {
    const baseObject = super.toObject(includeInstance) as GrpcFilterTag.AsObject
    return {
      ...baseObject,
      id: this._id,
      name: this._name,
      type: this.getType(),
      value: this.getValue(),
      displayText: this.getDisplayText(),
    }
  }

  clone(): this {
    const newInstance = new MockFilterTag(this._id, this._name, this.getType(), this.getValue(), this.getDisplayText())
    return newInstance as this
  }
}

export const mockFilterTags: MockFilterTag[] = [
  new MockFilterTag('tag1', 'Location: Paris', FilterTagType.FILTER_TAG_TYPE_LOCATION, 'Paris', 'Location: Paris'),
  new MockFilterTag('tag2', 'Date: Next Week', FilterTagType.FILTER_TAG_TYPE_DATE, 'next_week', 'Date: Next Week'),
  new MockFilterTag('tag3', 'Type: Conference', FilterTagType.FILTER_TAG_TYPE_CATEGORY, 'conference', 'Type: Conference'),
]
