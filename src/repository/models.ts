import type {Blob} from "buffer";
import {UUID} from '../container/uuid'

export interface UserRecord {
  readonly userId: UUID
  password: string
  email: string
  phone: string
  admin: boolean
}

export interface QRCodeRecord {
  readonly qrCodeId: UUID
  data: string
  readonly createdAt: EpochTimeStamp
  expiryTime: EpochTimeStamp
  userId: UUID
}

export interface ScanRecord {
  readonly scanId: number
  readonly createdAt: EpochTimeStamp
  readonly qrCodeId: UUID
}

export interface QRCodePropertyInstanceRecord {
  readonly qrCodeId: UUID
  readonly propertyName: string
  value: Blob
}

export interface QRCodePropertyRecord {
  readonly propertyName: string
  readonly type: string
}
