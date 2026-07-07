import {
  Accessibility, ArrowBigUp, ArrowLeft, Award, BadgeCheck, BatteryCharging, BookOpen, Bot,
  BrainCircuit, Briefcase, Building2, Bus, Calendar, CheckCircle2, ChevronDown, ChevronRight,
  ClipboardList, Clock, Cog, Compass, Cpu, Delete, Dumbbell, FileBadge, FlaskConical, FolderKanban,
  GraduationCap, Hammer, Handshake, HeartPulse, Landmark, Laptop, Lightbulb, Mail, MapPin, Mic,
  Microchip, Network, PartyPopper, Phone, PhoneCall, Radio, Rocket, Search, Send, ShieldCheck,
  Sparkles, Stethoscope, Target, Trophy, User, Users, Utensils, Zap,
} from 'lucide-react';

// Explicit map (not `import * as Icons`) so unused lucide icons get tree-shaken
// out of the production bundle — keep this list in sync with every icon name
// used across asietContent.js and the components.
const ICONS = {
  accessibility: Accessibility, 'arrow-big-up': ArrowBigUp, 'arrow-left': ArrowLeft,
  award: Award, 'badge-check': BadgeCheck, 'battery-charging': BatteryCharging,
  'book-open': BookOpen, bot: Bot, 'brain-circuit': BrainCircuit, briefcase: Briefcase,
  'building-2': Building2, bus: Bus, calendar: Calendar, 'check-circle-2': CheckCircle2,
  'chevron-down': ChevronDown, 'chevron-right': ChevronRight, 'clipboard-list': ClipboardList,
  clock: Clock, cog: Cog, compass: Compass, cpu: Cpu, delete: Delete, dumbbell: Dumbbell,
  'file-badge': FileBadge, 'flask-conical': FlaskConical, 'folder-kanban': FolderKanban,
  'graduation-cap': GraduationCap, hammer: Hammer, handshake: Handshake, 'heart-pulse': HeartPulse,
  landmark: Landmark, laptop: Laptop, lightbulb: Lightbulb, mail: Mail, 'map-pin': MapPin,
  mic: Mic, microchip: Microchip, network: Network, 'party-popper': PartyPopper, phone: Phone,
  'phone-call': PhoneCall, radio: Radio, rocket: Rocket, search: Search, send: Send,
  'shield-check': ShieldCheck, sparkles: Sparkles, stethoscope: Stethoscope, target: Target,
  trophy: Trophy, user: User, users: Users, utensils: Utensils, zap: Zap,
};

/**
 * Icon — Lucide icon renderer (real React components via lucide-react, no CDN
 * runtime dependency). Pass the kebab-case Lucide name (e.g. "map-pin").
 * `anim` applies one of the brand icon keyframes: iconFloat | sparkleTwinkle | iconWiggle.
 */
export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 2, anim, className = '', style = {} }) {
  const Component = ICONS[name];

  const animStyle = anim
    ? { animation: `${anim} ${anim === 'sparkleTwinkle' ? '3s' : '3.2s'} ease-in-out infinite` }
    : {};

  if (!Component) {
    return <span className={className} style={{ display: 'inline-flex', width: size, height: size, ...style }} />;
  }

  return (
    <span
      className={className}
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        lineHeight: 0,
        ...animStyle,
        ...style,
      }}
    >
      <Component size={size} color={color} strokeWidth={strokeWidth} />
    </span>
  );
}
