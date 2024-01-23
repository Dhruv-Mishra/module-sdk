import { createPublicClient, http } from "viem";

export const createClient = (rpcUrl: string) => {
  return createPublicClient({
    transport: http(rpcUrl),
  });
};
