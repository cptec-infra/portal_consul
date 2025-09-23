export interface Machine {
  address: string;
  name: string;
  status: string;
  type: string;
  zone: string;
  ipv4: string;
  dnsName: string;
  id: string;
  node: string;
  port: string;
  datacenter: string;
}

export interface PrometheusMetrics {
  node_name: string;
  metrics: {
    cpu_usage: string;
    memory_total: string;
    memory_free: string;
    memory_usage: string;
    disk_read_bytes: string;
    disk_write_bytes: string;
    network_receive_bytes: string;
    network_transmit_bytes: string;
    process_cpu_usage: string;
    process_memory_usage: string;
  };
  error?: string;
}
