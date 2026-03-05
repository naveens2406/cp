import React from 'react';

/**
 * Skeleton — renders a shimmer placeholder block.
 * Uses glass shimmer effect matching the design system.
 */
const Skeleton = ({ className = '', rounded = 'rounded-xl' }) => (
    <div className={`skeleton-glass ${rounded} ${className}`} />
);

/**
 * ServiceCardSkeleton — a full skeleton card matching the service card layout.
 */
export const ServiceCardSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden h-72">
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-12 w-12" rounded="rounded-full" />
                <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="pt-4 border-t border-gray-100">
                <Skeleton className="h-6 w-24" />
            </div>
        </div>
    </div>
);

export default Skeleton;
