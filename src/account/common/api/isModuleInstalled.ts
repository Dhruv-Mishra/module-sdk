import { Address, PublicClient } from "viem";
import { Account } from "../Account";
import { Network } from "../../Network";
import { getPublicClient } from "../../Network/helpers";
import AccountInterface from "@/src/constants/abis/Account.json";
import { getInitializationDataFromInitcode } from "./createAccount";
import { Module } from "../../../module/common/Module";
import { isContract } from "../../../common/utils";

export const isModuleInstalled = (
  client: PublicClient,
  account: Account,
  module: Module
) => {
  switch (module.type) {
    case "validator":
      return isValidatorInstalled(client, account, module.address);
    case "executor":
      return isExecutorInstalled(client, account, module.address);
    case "fallback":
      return isFallbackInstalled(client, account, module.address);
    case "hook":
      return isHookInstalled(client, account, module.address);
    default:
      throw new Error(`Unknown module type ${module.type}`);
  }
};

export async function isValidatorInstalled(
  client: PublicClient,
  account: Account,
  validator: Address
): Promise<boolean> {
  let isModuleInstalled = false;

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: "isValidatorInstalled",
      args: [validator],
    })) as boolean;
  } else {
    const { initialValidators } = getInitializationDataFromInitcode(
      account.initCode
    );
    isModuleInstalled = initialValidators.some(
      (validatorModule) => validatorModule.module === validator
    );
  }
  return isModuleInstalled;
}

export async function isExecutorInstalled(
  client: PublicClient,
  account: Account,
  executor: Address
): Promise<boolean> {
  let isModuleInstalled = false;

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: "isExecutorInstalled",
      args: [executor],
    })) as boolean;
  } else {
    const { initialExecutors } = getInitializationDataFromInitcode(
      account.initCode
    );
    isModuleInstalled = initialExecutors.some(
      (executorModule) => executorModule.module === executor
    );
  }
  return isModuleInstalled;
}

export async function isFallbackInstalled(
  client: PublicClient,
  account: Account,
  fallbackHandler: Address
): Promise<boolean> {
  let isModuleInstalled = false;

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: "isFallbackInstalled",
      args: [fallbackHandler],
    })) as boolean;
  } else {
    const { initialFallback } = getInitializationDataFromInitcode(
      account.initCode
    );
    isModuleInstalled = initialFallback.module === fallbackHandler;
  }
  return isModuleInstalled;
}

export async function isHookInstalled(
  client: PublicClient,
  account: Account,
  hook: Address
): Promise<boolean> {
  let isModuleInstalled = true;

  if (await isContract(client, account.address)) {
    isModuleInstalled = (await client.readContract({
      address: account.address,
      abi: AccountInterface.abi,
      functionName: "isHookInstalled",
      args: [hook],
    })) as boolean;
  } else {
    const { initialHook } = getInitializationDataFromInitcode(account.initCode);
    isModuleInstalled = initialHook.module === hook;
  }
  return isModuleInstalled;
}
