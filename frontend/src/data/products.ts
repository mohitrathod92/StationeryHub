import { BookOpen, Pen, Paperclip, Palette } from 'lucide-react';

// Static category definitions
// Products are now fetched from the API

export const categories = [
  {
    id: 'notebooks',
    name: 'Notebooks & Journals',
    description: 'Premium notebooks for every need',
    icon: BookOpen,
  },
  {
    id: 'writing',
    name: 'Writing Instruments',
    description: 'Pens, pencils & markers',
    icon: Pen,
  },
  {
    id: 'office',
    name: 'Office Supplies',
    description: 'Essential desk accessories',
    icon: Paperclip,
  },
  {
    id: 'art',
    name: 'Art & Craft Supplies',
    description: 'Unleash your creativity',
    icon: Palette,
  },
];
