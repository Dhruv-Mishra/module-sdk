import { getAccount } from 'src/account'
import { getPublicClient, getTestClient } from 'test/utils/userOps/clients'
import { setupEnvironment, cleanUpEnvironment } from '../infra'
import { testSmartSessionsValidator, testWebauthnValidator } from '../modules'
import {
  testOwnableValidator,
  testAutoSavingsExecutor,
  testDeadmanSwitchValidator,
  testMultiFactorValidator,
  testOwnableExecutor,
  testRegistryHook,
  testColdStorageHook,
  testScheduledOrdersExecutor,
  testScheduledTransfersExecutor,
  testHookMultiPlexer,
  testSocialRecoveryValidator,
} from 'test/e2e/modules'

describe('Test Nexus-7579 Account', () => {
  const testClient = getTestClient()
  const publicClient = getPublicClient()
  const account = getAccount({
    address: '0x0000000000781492f9942b873C29635420c31e7f',
    type: 'nexus',
  })

  beforeAll(async () => {
    await setupEnvironment({
      account,
      publicClient: publicClient,
      testClient,
    })
  }, 50000)

  afterAll(async () => {
    await cleanUpEnvironment({
      account,
      client: publicClient,
    })
  }, 50000)

  testOwnableValidator({
    account,
    publicClient,
    testClient,
  })

  // testWebauthnValidator({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testOwnableExecutor({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testAutoSavingsExecutor({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testDeadmanSwitchValidator({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testSocialRecoveryValidator({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testRegistryHook({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testMultiFactorValidator({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testColdStorageHook({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testScheduledOrdersExecutor({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testScheduledTransfersExecutor({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  // testHookMultiPlexer({
  //   account,
  //   publicClient,
  //   testClient,
  // })

  testSmartSessionsValidator({
    account,
    publicClient,
    testClient,
  })
})
