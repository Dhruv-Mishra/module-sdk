import {
  Hex,
  encodeAbiParameters,
  encodeFunctionData,
  encodePacked,
  zeroAddress,
} from 'viem'
import { ScheduledTransfer } from './types'
import { Execution } from '../../account/types'
import { SCHEDULED_TRANSFERS_EXECUTER_ADDRESS } from './constants'
import { abi } from './abi'

type Params = {
  scheduledTransfer: ScheduledTransfer
}

export const getScheduledTransferData = ({
  scheduledTransfer,
}: Params): Hex => {
  const amount = BigInt(
    Number(scheduledTransfer.amount) *
      10 ** (scheduledTransfer.token?.decimals || 18),
  )

  return encodeAbiParameters(
    [
      { name: 'recipient', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    [
      scheduledTransfer.recipient,
      scheduledTransfer.token
        ? scheduledTransfer.token.token_address
        : zeroAddress,
      amount,
    ],
  )
}

type CreateScheduledTransferExecutionParams = {
  scheduledTransfer: ScheduledTransfer
}

export const getCreateScheduledTransferAction = ({
  scheduledTransfer,
}: CreateScheduledTransferExecutionParams): Execution => {
  return {
    target: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'addOrder',
      abi,
      args: [
        encodePacked(
          ['uint48', 'uint16', 'uint48', 'bytes'],
          [
            scheduledTransfer.repeatEvery,
            scheduledTransfer.numberOfRepeats,
            scheduledTransfer.startDate,
            getScheduledTransferData({ scheduledTransfer }),
          ],
        ),
      ],
    }),
  }
}

type ExecuteTransferParams = {
  jobId: number
}

export const getExecuteScheduledTransferAction = ({
  jobId,
}: ExecuteTransferParams): Execution => {
  return {
    target: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'executeOrder',
      abi,
      args: [BigInt(jobId)],
    }),
  }
}

export const getToggleScheduledTransferAction = ({
  jobId,
}: ExecuteTransferParams): Execution => {
  return {
    target: SCHEDULED_TRANSFERS_EXECUTER_ADDRESS,
    value: BigInt(0),
    callData: encodeFunctionData({
      functionName: 'toggleOrder',
      abi,
      args: [BigInt(jobId)],
    }),
  }
}
