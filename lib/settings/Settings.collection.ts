'use client';

import { createCollection } from '@/lib/cappuccino/client';
import { Settings } from './Settings.model';

export function getSettingsCollection() {
    return createCollection<Settings>('settings');
}
