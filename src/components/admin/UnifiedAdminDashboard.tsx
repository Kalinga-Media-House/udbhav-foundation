'use client';

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { OverviewStatsWidget } from '@/components/admin/widgets/OverviewStatsWidget';
import { PendingApprovalsWidget } from '@/components/admin/widgets/PendingApprovalsWidget';
import { RecentActivityWidget } from '@/components/admin/widgets/RecentActivityWidget';
import { RevenueChartWidget } from '@/components/admin/widgets/RevenueChartWidget';

const WIDGET_MAP = {
  'overview-stats': OverviewStatsWidget,
  'revenue-chart': RevenueChartWidget,
  'recent-activity': RecentActivityWidget,
  'pending-approvals': PendingApprovalsWidget,
};

const DEFAULT_WIDGETS = [
  { id: 'overview-stats', width: 'full' },
  { id: 'revenue-chart', width: 'half' },
  { id: 'pending-approvals', width: 'half' },
  { id: 'recent-activity', width: 'full' }
];

function SortableWidget({ id, widgetConfig }: { id: string, widgetConfig: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  const WidgetComponent = WIDGET_MAP[id as keyof typeof WIDGET_MAP];

  if (!WidgetComponent) return null;

  const widthClass = widgetConfig.width === 'half' ? 'col-span-1 lg:col-span-1' : 'col-span-1 lg:col-span-2';

  return (
    <div ref={setNodeRef} style={style} className={`${widthClass} relative group bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden`}>
      <div 
        {...attributes} 
        {...listeners}
        className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <WidgetComponent />
    </div>
  );
}

export function UnifiedAdminDashboard() {
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS);
  
  useEffect(() => {
    // Load preferences from local storage or API
    const saved = localStorage.getItem('admin_dashboard_widgets');
    if (saved) {
      try {
        setWidgets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse widget layout", e);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('admin_dashboard_widgets', JSON.stringify(newItems));
        return newItems;
      });
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Enterprise Dashboard</h1>
        <p className="text-zinc-500 mt-1">
          Drag and drop widgets to customize your overview.
        </p>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SortableContext 
            items={widgets.map(w => w.id)}
            strategy={rectSortingStrategy}
          >
            {widgets.map((widget) => (
              <SortableWidget key={widget.id} id={widget.id} widgetConfig={widget} />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
