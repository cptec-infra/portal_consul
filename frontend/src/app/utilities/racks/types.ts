export interface Racks {
  id: number;
  name: string;
  location_name: string;
  height: number;
  object_count: number;
}

export interface RackDetails {
  id: number;
  name: string;
  height: number;
  location_name: string;
  row_name: string;
}

export interface RackObject {
  id: number;
  name: string;
  unit_no: number;
  asset_no: string;
  atom: number;
  state: string;
  objtype_id: number;
}