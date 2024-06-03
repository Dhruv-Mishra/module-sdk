import { Address, Hex, encodePacked } from 'viem'
import { Module } from '../types'
import { SCHEDULED_ORDERS_EXECUTER_ADDRESS } from './constants'

type Params = {
  executeInterval: number
  numberOfExecutions: number
  startDate: number
  executionData: Hex
  hook?: Address
}

export const getInstallScheduledOrdersExecutor = ({
  executeInterval,
  numberOfExecutions,
  startDate,
  executionData,
  hook,
}: Params): Module => {
  return {
    module: SCHEDULED_ORDERS_EXECUTER_ADDRESS,
    type: 'executor',
    data: encodePacked(
      ['uint48', 'uint16', 'uint48', 'bytes'],
      [executeInterval, numberOfExecutions, startDate, executionData],
    ),
    hook,
  }
}
