import { useState } from 'react';
import { Machine, MachineConfig, StateValue } from 'xstate';

export const promiseActions: { [key: string]: PromiseEvents } = {
  RESOLVE: { type: 'RESOLVE' },
  RESOLVE_EMPTY: { type: 'RESOLVE_EMPTY' },
  REJECT: { type: 'REJECT' },
  RETRY: { type: 'RETRY' },
};

export const promiseStates: PromiseSchema['states'] = {
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved',
  empty: 'empty',
};

interface PromiseSchema {
  states: {
    pending: {};
    rejected: {};
    resolved: {};
    empty: {};
  };
}

type PromiseEvents = { type: 'RESOLVE' } | { type: 'RESOLVE_EMPTY' } | { type: 'REJECT' } | { type: 'RETRY' };

const machineConfig: MachineConfig<any, PromiseSchema, PromiseEvents> = {
  id: 'promise',
  initial: 'pending',
  states: {
    pending: { on: { RESOLVE: 'resolved', RESOLVE_EMPTY: 'empty', REJECT: 'rejected' } },
    rejected: { on: { RETRY: 'pending' } },
    resolved: { type: 'final' },
    empty: { type: 'final' },
  },
};

const machine = Machine(machineConfig);

export default function usePromiseMachine() {
  const [state, setState] = useState<StateValue>(machine.initialState.value);

  const transition = (action: PromiseEvents) => setState((prevState) => machine.transition(prevState, action).value);

  return { transition, promiseState: state };
}
