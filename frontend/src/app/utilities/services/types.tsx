export interface Service {
  name: string;
  address?: string;
  datacenter?: string;
  id?: string;
  node?: string;
  status?: string;
  port?: string;
}

export interface Grouped {
  name: string;
  nodes: Service[];
  hasCritical: boolean;
  hasWarning: boolean;
}

