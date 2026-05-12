import dns from "node:dns";

export const configureDns = () => {
  const dnsServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers?.length) {
    dns.setServers(dnsServers);
    console.log(`Using custom DNS servers: ${dnsServers.join(", ")}`);
  }
};
