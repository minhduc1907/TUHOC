import React from 'react';
import {
  Calculator,
  BookOpen,
  Languages,
  Atom,
  Compass,
  ShieldCheck,
  Laptop,
  Wrench,
  Activity,
  Palette,
  Sparkles,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';

interface Props {
  iconName: string;
  className?: string;
}

export const SubjectIcon: React.FC<Props> = ({ iconName, className = 'w-5 h-5' }) => {
  switch (iconName) {
    case 'Calculator':
      return <Calculator className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Atom':
      return <Atom className={className} />;
    case 'Compass':
      return <Compass className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
