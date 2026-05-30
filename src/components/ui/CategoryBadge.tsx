import React from 'react';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../utils/categoryColors';
import type { AgentCategory } from '../../types';

interface Props { category: AgentCategory; size?: 'sm' | 'md' }

export function CategoryBadge({ category, size = 'sm' }: Props) {
  const colors = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.domain;
  const label = CATEGORY_LABELS[category] ?? category;
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'} ${colors.badge}`}>
      {label}
    </span>
  );
}
