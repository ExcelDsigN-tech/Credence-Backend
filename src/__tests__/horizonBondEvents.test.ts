<<<<<<< HEAD
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { subscribeBondCreationEvents } from '../listeners/horizonBondEvents.js'

// Explicitly type mockStream and events
let mockStream: (op: any) => Promise<void>
let events: any[] = []

vi.mock('stellar-sdk', () => {
  // Must use `function` keyword (not arrow) so it works with `new`
  function MockServer() {
    return {
      operations: vi.fn(() => ({
        forAsset: vi.fn(() => ({
          cursor: vi.fn(() => ({
            stream: vi.fn(({ onmessage }: { onmessage: (op: any) => Promise<void> }) => {
              mockStream = onmessage
            }),
          })),
        })),
      })),
    }
  }
  return { Server: MockServer }
})

vi.mock('../services/identityService.js', () => ({
  upsertIdentity: vi.fn().mockResolvedValue(true),
  upsertBond: vi.fn().mockResolvedValue(true),
}))

describe('Horizon Bond Creation Listener', () => {
  beforeEach(() => {
    events = []
    vi.clearAllMocks()
  })

  it('should parse and upsert bond creation events', async () => {
    const { upsertIdentity, upsertBond } = await import('../services/identityService.js') as any

=======
import { subscribeBondCreationEvents } from '../listeners/horizonBondEvents';
import { upsertIdentity, upsertBond } from '../services/identityService';

// Explicitly type mockStream and events
let mockStream: (op: any) => Promise<void>;
let events: any[] = [];

describe('Horizon Bond Creation Listener', () => {
  let mockStream: (op: any) => Promise<void>;
  let events: any[] = [];

  beforeAll(() => {
    // Mock Stellar SDK Server
    jest.mock('stellar-sdk', () => ({
      Server: jest.fn(() => ({
        operations: jest.fn(() => ({
          forAsset: jest.fn(() => ({
            cursor: jest.fn(() => ({
              stream: jest.fn(({ onmessage }: { onmessage: (op: any) => Promise<void> }) => {
                mockStream = onmessage;
              })
            })
          })),
        }))
      }))
    }));
  });

  beforeEach(() => {
    events = [];
    jest.clearAllMocks();
  });

  it('should parse and upsert bond creation events', async () => {
>>>>>>> upstream/main
    const op = {
      type: 'create_bond',
      source_account: 'GABC...',
      id: 'bond123',
      amount: '1000',
      duration: '365',
<<<<<<< HEAD
      paging_token: 'token1',
    }

    subscribeBondCreationEvents((event: any) => events.push(event))
    await mockStream(op)

    expect(upsertIdentity).toHaveBeenCalledWith({ id: 'GABC...' })
    expect(upsertBond).toHaveBeenCalledWith({ id: 'bond123', amount: '1000', duration: '365' })
    expect(events.length).toBe(1)
    expect(events[0].identity.id).toBe('GABC...')
    expect(events[0].bond.id).toBe('bond123')
  })

  it('should ignore non-bond events', async () => {
    const op = { type: 'payment', id: 'other' }
    subscribeBondCreationEvents((event: any) => events.push(event))
    await mockStream(op)
    expect(events.length).toBe(0)
  })

  it('should handle duplicate bond events gracefully', async () => {
    const { upsertBond } = await import('../services/identityService.js') as any

=======
      paging_token: 'token1'
    };
    const upsertIdentityMock = jest.spyOn(require('../services/identityService'), 'upsertIdentity').mockResolvedValue(true);
    const upsertBondMock = jest.spyOn(require('../services/identityService'), 'upsertBond').mockResolvedValue(true);

  subscribeBondCreationEvents((event: any) => events.push(event));
    await mockStream(op);

    expect(upsertIdentityMock).toHaveBeenCalledWith({ id: 'GABC...' });
    expect(upsertBondMock).toHaveBeenCalledWith({ id: 'bond123', amount: '1000', duration: '365' });
    expect(events.length).toBe(1);
    expect(events[0].identity.id).toBe('GABC...');
    expect(events[0].bond.id).toBe('bond123');
  });

  it('should ignore non-bond events', async () => {
    const op = { type: 'payment', id: 'other' };
  subscribeBondCreationEvents((event: any) => events.push(event));
    await mockStream(op);
    expect(events.length).toBe(0);
  });

  it('should handle duplicate bond events gracefully', async () => {
>>>>>>> upstream/main
    const op = {
      type: 'create_bond',
      source_account: 'GABC...',
      id: 'bond123',
      amount: '1000',
      duration: '365',
<<<<<<< HEAD
      paging_token: 'token1',
    }

    subscribeBondCreationEvents(() => {})
    await mockStream(op)
    await mockStream(op) // Duplicate
    expect(upsertBond).toHaveBeenCalledTimes(2)
  })
})
=======
      paging_token: 'token1'
    };
    const upsertBondMock = jest.spyOn(require('../services/identityService'), 'upsertBond').mockResolvedValue(true);
    subscribeBondCreationEvents(() => {});
    await mockStream(op);
    await mockStream(op); // Duplicate
    expect(upsertBondMock).toHaveBeenCalledTimes(2); // Should be idempotent in real DB
  });
});
>>>>>>> upstream/main
