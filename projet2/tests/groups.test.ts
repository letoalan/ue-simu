import { describe, it, expect } from 'vitest';
import { allocateStudents } from '../src/ui/intro/groupAllocator';

describe('Group Allocator Module', () => {
  it('allocates students evenly across commission, states, parties, and lobbies', () => {
    const studentNames = Array.from({ length: 25 }, (_, i) => `Étudiant ${i + 1}`);
    const result = allocateStudents(studentNames);

    expect(result.commission.members.length).toBeGreaterThanOrEqual(1);
    expect(result.states.length).toBe(6);
    expect(result.parties.length).toBe(6);
    expect(result.lobbies.length).toBe(6);

    const totalAllocated =
      result.commission.members.length +
      result.states.reduce((sum, g) => sum + g.members.length, 0) +
      result.parties.reduce((sum, g) => sum + g.members.length, 0) +
      result.lobbies.reduce((sum, g) => sum + g.members.length, 0);

    expect(totalAllocated).toBe(25);
  });

  it('handles small classes (e.g. 5 students)', () => {
    const studentNames = ['Alice', 'Bob', 'Charlie', 'David', 'Emma'];
    const result = allocateStudents(studentNames);

    expect(result.commission.members.length).toBeGreaterThanOrEqual(1);

    const totalAllocated =
      result.commission.members.length +
      result.states.reduce((sum, g) => sum + g.members.length, 0) +
      result.parties.reduce((sum, g) => sum + g.members.length, 0) +
      result.lobbies.reduce((sum, g) => sum + g.members.length, 0);

    expect(totalAllocated).toBe(5);
  });

  it('handles empty participant list gracefully', () => {
    const result = allocateStudents([]);
    expect(result.commission.members.length).toBe(0);
    expect(result.states.every(s => s.members.length === 0)).toBe(true);
  });
});
