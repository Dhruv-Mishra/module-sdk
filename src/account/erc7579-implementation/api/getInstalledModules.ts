import { Address, PublicClient } from 'viem'
import { Account, Action } from '../../Account'
import { ModuleType } from '../../../module/Module'
import AccountInterface from '../constants/abis/ERC7579Implementation.json'
import { SENTINEL_ADDRESS } from '../../../common/constants'
import { isContract } from '../../../common/utils'
import { getInitData } from './getInitData'

export const getInstalledModules = async ({
  client,
  account,
  moduleTypes = ['validator', 'executor', 'hook', 'fallback'],
}: {
  client: PublicClient
  account: Account
  moduleTypes?: ModuleType[]
}): Promise<Address[]> => {
  const modules: Address[] = []
  if (await isContract({ client, address: account.address })) {
    for (const moduleType of moduleTypes) {
      switch (moduleType) {
        case 'validator':
          const validators = await getModulesPaginated({
            client,
            functionName: 'getValidatorPaginated',
            accountAddress: account.address,
          })
          validators && modules.push(...validators)
        case 'executor':
          const executors = await getModulesPaginated({
            client,
            functionName: 'getExecutorsPaginated',
            accountAddress: account.address,
          })
          executors && modules.push(...executors)
        case 'hook':
        // todo: implement on account
        case 'fallback':
        // todo: implement on account
      }
    }
  } else if (account.initCode) {
    const initialModules = getInitData({ initCode: account.initCode })
    for (const moduleType of moduleTypes) {
      switch (moduleType) {
        case 'validator':
          for (const validator of initialModules.validators) {
            modules.push(validator.module)
          }
        case 'executor':
          for (const executor of initialModules.executors) {
            modules.push(executor.module)
          }
        case 'hook':
          for (const hook of initialModules.hooks) {
            modules.push(hook.module)
          }
        case 'fallback':
          for (const fallback of initialModules.fallbacks) {
            modules.push(fallback.module)
          }
      }
    }
  } else {
    throw new Error('Account has no init code and is not deployed')
  }
  return modules
}

const getModulesPaginated = async ({
  client,
  functionName,
  accountAddress,
}: {
  client: PublicClient
  functionName: string
  accountAddress: Address
}) => {
  const data = (await client.readContract({
    address: accountAddress,
    abi: AccountInterface.abi,
    functionName: functionName,
    args: [SENTINEL_ADDRESS, 100],
  })) as [Address[], Address]
  return data[0]
}