export interface Contact {
  id: number;
  contact_name: string;
}

export interface ContactEquipment {
  id: number;
  name: string;
  objtype_id: number;
  asset_no: string;
}

export interface ContactEquipmentCount {
  [contactName: string]: number;
}