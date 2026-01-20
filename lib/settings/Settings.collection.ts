'use client';

import { createCollection } from '@/lib/cappuccino/client';
import type { Setting } from './Settings.model';

export function getSettingsCollection() {
    return createCollection<Setting>('settings');
}
