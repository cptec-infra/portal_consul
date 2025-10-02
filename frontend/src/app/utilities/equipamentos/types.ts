export interface Equipment {
  id: number;
  name: string;
  location_names: string;
  rack_names: string;
  objtype_id: number;
  asset_no: string;
}

export interface EquipmentDetails {
  id: number;
  name: string;
  objtype_id: number;
}

export interface EquipmentAttribute {
  attribute_name: string;
  attribute_value: string;
}

export interface EquipmentPort {
  port_name: string;
  port_type: string;
  port_label: string;
  port_state: string;
}

export interface EquipmentResponse {
  object: EquipmentDetails;
  attributes: EquipmentAttribute[];
  ports: EquipmentPort[];
}