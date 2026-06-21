'use server';

import { revalidatePath } from 'next/cache';

/**
 * @fileOverview Institutional Server-Side Revalidation Nodes.
 */

export async function clearAppCache() {
  try {
    revalidatePath('/');
    revalidatePath('/exams');
    revalidatePath('/mocks');
    revalidatePath('/leaderboard');
    revalidatePath('/current-affairs');
    revalidatePath('/notes');
    return { success: true };
  } catch (error) {
    console.error('[CACHE_CLEAR_FAILURE]:', error);
    throw new Error('Cache revalidation node failed.');
  }
}