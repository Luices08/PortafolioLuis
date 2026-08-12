import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export default function PageHeader({ title, description, onCreate, createLabel = 'Nuevo' }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-display text-xl font-semibold text-paper">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {onCreate && (
        <Button onClick={onCreate} size="sm">
          <Plus size={15} /> {createLabel}
        </Button>
      )}
    </div>
  );
}
