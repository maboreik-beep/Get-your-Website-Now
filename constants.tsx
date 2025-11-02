import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  Industry, Page, Section,
  FooterSection, HeroSection, AboutSection, ServicesSection, TestimonialsSection,
  CTASection, TeamSection, StorySection, ContactSection, ProductsSection, FeaturesSection, PricingSection, ClientsSection, GallerySection, FAQSection, BlogSection,
  TeamMember, TestimonialItem, ServiceItem, TimelineItem, ProductItem, FeatureItem, PriceItem, ClientItem, GalleryItem, FAQItem, BlogItem
} from './types';

// Helper to generate unique IDs
export const generateId = (prefix: string = 'id'): string => `${prefix}-${Math.random().toString(36).substr(2, 9)}`;

export const INDUSTRIES: Industry[] = [
  'Design Agency', 'Charity', 'Hotel', 'Business Services', 'Portfolio', 'Interior Designer', 'Online Store',
  'Fashion', 'Furniture', 'Real Estate', 'Construction', 'Marketing',
  'Designer', 'Photographer', 'Restaurant', 'Store', 'Logistics',
  'Lawyer', 'Medical', 'Technology', 'Blog', 'Events', 'Child Care', 'Industrial', 'Security'
];

export const THEME_COLORS = [
  { name: 'Lime', value: '#A3E635' }, // Original primary
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Teal', value: '#14B8A6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Yellow', value: '#EAB308' },
];

// Updated logo Base64 for better visibility on dark backgrounds (white with green play button)
export const GOONLINE_LOGO_BASE64 = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjY0IiB2aWV3Qm94PSIwIDAgMjU2IDY0IiBmb3JtPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDx0ZXh0IHg9IjAiIHk9IjIwIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtd2VpZ2h0PSI2MDAiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMTBweCI+Tk9XPC90ZXh0PgogIDx0ZXh0IHg9IjMyIiB5PSIzMiIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXdlaWdoPSI4MDAiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMjRweCI+R088L3RleHQ+CiAgPHRleHQgeD0iNzAiIHk9IjMyIiBmb250LWZhbWlseT0iSW50ZXIiIGZvbnQtd2VpZ2h0PSI4MDAiIGZpbGw9IiNGRkZGRkYiIGZvbnQtc2l6ZT0iMjRweCI+T05MSU5FPC90ZXh0PgogIDxwYXRoIGQ9Ik0xNDcuMzQ5IDMxLjYzMzFMMTY2Ljg2NCAyNS41NzE0QzE3MC4zNTYgMjQuMzY3MiAxNzIuNTg2IDI4LjA5NzEgMTcwLjUxMiAzMS4zMDkxTDE2Ny4wNzcgMzYuNDExTDE3MC41MzYgNDEuNTI0NUS,MTcwLjUzNiA0MS41MjQ1QzE3Mi41OTMgNDQuNzQ1IDE3MC4zNTcgNDguNDg1OCAxNjYuODcwIDQ3LjI3MjZMMTQ3LjM1NSA0MS4yNjYyTDE0Ny4zNDkgMzEuNjMzMVYzMS42MzMxWiIgZmlsbD0iI0EzRTYzNSIvPgogIDx0ZXh0IHg9IjMyIiB5PSI0NCIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXdlaWdodD0iNDAwIiBmaWxsPSIjRkZGRkZGIiBmb250LXNpemU9IjhweCI+d3d3Lmdvb25saW5lLmNsb3VkPC90ZXh0Pgo8L3N2Zz4`;

export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <img src={GOONLINE_LOGO_BASE64} alt="Go Online Logo" className={className} />
);

// Icon definitions
export const ICONS = {
  Wand: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5v-5.714c0-.597-.237-1.17-.659-1.591L14.25 3.104M3.75 12h16.5M12 3.75h.008v.008H12V3.75z" /></svg>,
  DocumentText: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  Chart: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6h2.25a2.25 2.25 0 012.25 2.25V10.5h.75m-9 9l5.197-5.197a7.5 7.5 0 0110.607 0C21.803 16.514 22.5 17.587 22.5 18.75c0 1.956-1.532 3.535-3.535 3.535L14.75 19.5" /></svg>,
  Briefcase: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.5H3V6A2.25 2.25 0 015.25 3.75h13.5A2.25 2.25 0 0121 6v7.5zm-18 0v4.5A2.25 2.25 0 005.25 20.25h13.5A2.25 2.25 0 0021 18v-4.5m-18 0h18" /></svg>,
  Megaphone: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.923a2.25 2.25 0 01-2.429 2.429L14.44 8.783l-3.236-3.236c-.23-.23-.585-.194-.974-.015a10.026 10.026 0 00-4.636 4.636c-.179.389-.215.744.015.974l3.236 3.236-1.393 2.245a2.25 2.25 0 01-2.429 2.429L3 21m18-9c0 3.866-3.134 7-7 7-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7z" /></svg>,
  Code: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 8.25L5.25 13.5l5.25 5.25m3-10.5l5.25 5.25-5.25 5.25" /></svg>,
  Design: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.786 1.128 2.25 2.25 0 01-2.403 1.157 4.5 4.5 0 004.87-2.114 6.001 6.001 0 005.786-1.128zm.75-5.714c-.011-.122-.03-.242-.054-.362A13.627 13.627 0 008 7.375 6 6 0 003 9.75c0 .647.11 1.266.306 1.849a6.25 6.25 0 001.077 1.897 4.502 4.502 0 003.954 1.168 6 6 0 00-.001-3.692zM21.75 12h-.008v-.008h.008V12zm-3.75-9H15.3c-.535 0-1.042.213-1.414.586L12 5.572 9.414 3c-.372-.373-.879-.586-1.414-.586H4.5A2.25 2.25 0 002.25 4.5v3.394c0 .535.213 1.042.586 1.414l5.198 5.198 2.658 2.658c.23.23.584.195.974.015a10.026 10.026 0 004.636-4.636c.179-.389.215-.744-.015-.974l-2.658-2.658-5.198-5.198A2.25 2.25 0 008.25 2.25H4.5v1.5a.75.75 0 01-.75.75H2.25v3.394c0 .535.213 1.042.586 1.414l5.198 5.198 2.658 2.658c.23.23.584.195.974.015a10.026 10.026 0 004.636-4.636c.179-.389.215-.744-.015-.974l-2.658-2.658-5.198-5.198A2.25 2.25 0 008.25 2.25H4.5zM12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>,
  Shield: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.56-1.196 2.75-2.69 3.064C16.636 18.067 14.364 21 12 21s-4.636-2.933-6.31-6.216C4.196 14.75 3 13.56 3 12V6.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6.75V12z" /></svg>,
  Support: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02A.75.75 0 0112 11.75h.008v.008H12a.75.75 0 01-.709-.004zM4.5 9.75a7.5 7.5 0 0115 0h-3C15.75 12.164 13.93 14.25 11.25 14.25S6.75 12.164 6.75 9.75h-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-4.5m0 0l-3 3-3-3m3 3l3-3m-3 3v-4.5" /></svg>,
  Photograph: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75L6 12m0 0l-3.75-3.75M6 12h18m0 0l-3.75 3.75M18 12l3.75-3.75" /></svg>,
  ShoppingCart: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.162-4.439 3.333-6.495l-.65-3.567M12 10.5h.007v.007H12v-.007zm3.75 6.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>,
  UserGroup: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.75c0-.621-.503-1.125-1.125-1.125H5.625c-.621 0-1.125.503-1.125 1.125v2.25c0 .621.503 1.125 1.125 1.125h11.25c.621 0 1.125-.503 1.125-1.125v-2.25zM15.75 10.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 4.5v.375c0 .621.504 1.125 1.125 1.125h3.25c.621 0 1.125-.504 1.125-1.125V4.5m0 0h-.008v.008H9v-.008zM18 4.5v.375c0 .621-.504 1.125-1.125 1.125h-3.25c-.621 0-1.125-.504-1.125-1.125V4.5m0 0h-.008v.008h.008V4.5zM12 4.5h.008v.008H12V4.5z" /></svg>,
  Close: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  ChevronUp: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75L12 8.25l7.5 7.5" /></svg>,
  ChevronDown: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25L12 15.75l-7.5-7.5" /></svg>,
  // Corrected icon definitions for Message, Trash, ShoppingCart, MicOff
  Message: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 9.75V21h4.5L12 16.5l4.5 4.5h4.5V9.75M12 12a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" /></svg>,
  Trash: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18m-2.25 3.75l-.907 10.428A2.25 2.25 0 0117 21H7a2.25 2.25 0 01-2.193-2.622L4.5 9.75m3.75-.75h.008v.008H8.25V9zm-3 0h.008v.008H5.25V9zm-.375 0h.008v.008H4.875V9zm-.375 0h.008v.008H4.5V9z" /></svg>,
  Mic: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75V21m-2.25-4.5h4.5m-3.75 0v3.75m0-3.75a2.25 2.25 0 01-4.5 0V9a4.5 4.5 0 119 0v5.25a2.25 2.25 0 01-4.5 0z" /></svg>,
  MicOff: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364l-12.728-12.728M12 2.25v2.25M6.636 17.364l-1.414 1.414M4.5 12h-2.25M17.364 6.636l1.414-1.414M18 12h2.25M12 18.75v-2.25M17.364 17.364l-1.414-1.414M6.636 6.636l1.414 1.414m-4.5 0A7.5 7.5 0 0112 4.5m0 3a3.75 3.75 0 110 7.5V21a3 3 0 01-3-3H6m-2.25-.75A3.75 3.75 0 004.5 18h1.5m0-1.5a3.75 3.75 0 017.5 0M9 12a3.75 3.75 0 00-3.75 3.75m1.5-11.25H9a3.75 3.75 0 013.75 3.75v7.5m-9-3.75A7.5 7.5 0 0112 19.5" /></svg>,
  Geo: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
  Send: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>,
  Plus: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  // New icons for menu and editor/preview toggle
  Bars3: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  XMark: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  Eye: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Pencil: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75v-10.5A2.25 2.25 0 015.25 6H10" /></svg>,
  ArrowUp: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" /></svg>,
  ArrowDown: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>,
  // Social Icons
  Twitter: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.254 5.309c-.779.345-1.635.578-2.529.682.898-.539 1.59-1.396 1.916-2.414-.843.5-1.782.866-2.774 1.063C18.17 4.12 16.94 3.5 15.612 3.5c-2.413 0-4.373 1.954-4.373 4.373 0 .343.039.677.113.992-3.638-.182-6.864-1.928-9.023-4.577-.376.64-.593 1.387-.593 2.185 0 1.517.771 2.858 1.942 3.646-.718-.022-1.393-.22-1.983-.548v.056c0 2.103 1.498 3.856 3.483 4.256-.363.099-.744.151-1.137.151-.278 0-.547-.026-.81-.077.553 1.724 2.152 2.977 4.04 3.011-1.488 1.164-3.355 1.859-5.397 1.859-.352 0-.699-.021-1.04-.061 1.922 1.233 4.195 1.954 6.643 1.954 8.274 0 12.802-6.85 12.802-12.802 0-.195-.004-.39-.013-.584.881-.632 1.64-1.42 2.246-2.327z"/></svg>,
  Linkedin: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.23 0H1.77C.792 0 0 .774 0 1.734v20.532c0 .96.792 1.734 1.77 1.734h20.46c.978 0 1.77-.774 1.77-1.734V1.734c0-.96-.792-1.734-1.77-1.734zM7.3 20.25H3.6V8.25h3.7v12zm-1.85-13.6c-1.2 0-2.18-.95-2.18-2.12C3.27 3.38 4.25 2.43 5.45 2.43c1.2 0 2.18.95 2.18 2.12 0 1.17-.98 2.1-2.18 2.1zM20.48 20.25h-3.7V14.5c0-1.3-.02-2.96-1.8-2.96-1.82 0-2.1 1.4-2.1 2.86v5.85h-3.7V8.25h3.55v1.65h.05c.49-.9 1.68-1.85 3.45-1.85 3.69 0 4.37 2.43 4.37 5.58v6.62h.01z"/></svg>,
  Facebook: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24h11.334V14.61H9.68V11.026h2.979V8.402c0-2.966 1.812-4.582 4.455-4.582 1.309 0 2.436.097 2.768.14V7.47h-1.834c-1.448 0-1.733.688-1.733 1.702v2.106h3.873l-.61 3.584h-3.263V24h6.046c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>,
  Instagram: (p: any) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.071 1.17.055 1.805.249 2.227.424.607.246 1.058.799 1.258 1.41.173.47.319.864.424 2.227.059 1.266.071 1.646.071 4.85s-.012 3.584-.071 4.85c-.055 1.17-.249 1.805-.424 2.227-.246.607-.799 1.058-1.41 1.258-.173.47-.319.864-.424 2.227-.059 1.266-.071 1.646-.071 4.85s.012 3.584.071 4.85c.055 1.17.249 1.805.424 2.227.246.607.799 1.058 1.41-1.258.47-.173.864.319 2.227-.424 1.266-.059 1.646-.071 4.85-.071zm0-2.163c-3.265 0-3.693.013-4.994.072-1.262.059-2.105.275-2.825.556-1.18.465-2.158 1.444-2.623 2.623-.28.72-.497 1.563-.556 2.825-.059 1.3-.072 1.729-.072 4.994s.013 3.693.072 4.994c.059 1.262.275 2.105.556 2.825 0 0 .978.465 2.158 1.444 2.623 2.623-.28.72-.497 1.563-.556 2.825-.059 1.3-.072 1.729-.072 4.994s-.013 3.693-.072 4.994c-.059 1.262-.275 2.105-.556 2.825-1.18.465-2.158 1.444-2.623 2.623-.28.72-.497 1.563-.556 2.825-.059 1.3-.072 1.729-.072 4.994s-.013 3.693-.072 4.994zM12 6.865c-2.831 0-5.135 2.304-5.135 5.135s2.304 5.135 5.135 5.135 5.135-2.304 5.135-5.135-2.304-5.135-5.135-5.135zm0 8.571c-1.996 0-3.436-1.44-3.436-3.436s1.44-3.436 3.436-3.436 3.436 1.44 3.436 3.436-1.44 3.436-3.436 3.436zm6.807-9.646c0-.85-.688-1.538-1.538-1.538-.849 0-1.538.688-1.538 1.538 0 .849.688 1.538 1.538 1.538.85 0 1.538-.688 1.538-1.538z"/></svg>,
};

// Generic Icon Component
export const Icon: React.FC<{ name: keyof typeof ICONS; className?: string; style?: React.CSSProperties }> = ({ name, className, style }) => {
    const SvgIcon = ICONS[name];
    if (!SvgIcon) return null;
    return <SvgIcon className={`w-6 h-6 ${className}`} style={style} />;
};

// --- Multi-language UI Setup ---
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' }, // Arabic
  // Add more languages as needed
];

interface UITranslations {
  [key: string]: string;
}

const UI_TRANSLATIONS: { [langCode: string]: UITranslations } = {
  en: {
    'createWebsite': 'Create a New Website',
    'provideDetails': 'Provide some basic details to get started.',
    'companyName': 'Your Company Name',
    'selectIndustry': 'Select an industry...',
    'describeWebsiteAI': 'Describe your website (for AI generation)',
    'aiPromptPlaceholder': 'E.g., "a modern tech blog about AI with dark theme and minimalist design" or "a vibrant restaurant website focusing on Italian cuisine with an online reservation system"',
    'uploadBrochureOptional': 'Or upload a brochure (optional, for AI generation)',
    'uploadFile': 'Upload a file',
    'dragAndDrop': 'or drag and drop',
    'imageSelected': 'Image selected!',
    'imageFormats': 'PNG, JPG up to 10MB',
    'chooseTheme': 'Choose a base theme',
    'light': 'Light',
    'dark': 'Dark',
    'generateWithAI': 'Generate with AI',
    'startWithTemplate': 'Start with Template',
    'aiBuildingSite': 'AI is building your site...',
    'generatingFromBrochure': 'Generating with AI from your brochure...',
    'generatingFromDescription': 'Generating with AI from your description...',
    'generatingWithAI': 'Generating with AI...',
    'craftingFromTemplate': 'Crafting from template...',
    'errorCompanyNameIndustryRequired': 'Please enter a company name and select an `industry` field. The `name` is a Record<string,string> and `industry` field `Industry` from the `types.ts` file. Please enter the `name` field as `string` and `industry` field as `Industry` of type `string` and the `theme` field can be either `light` or `dark` of type `string`.',
    'buildStunningWebsite': 'Build Your Stunning Website',
    'inMinutes': 'in Minutes',
    'effortlesslyCreate': 'Effortlessly create a professional online presence with our AI-powered builder. No code, no hassle. Just your vision, brought to life.',
    'getStartedForFree': 'Get Started For Free',
    'fourteenDayFreeTrial': '14 days free trial, no credit card required.', // New
    'welcomeBack': 'Welcome Back',
    'signInManageWebsites': 'Sign in to manage your websites.',
    'createAccountGetStarted': 'Create an account to get started.',
    'signInGoogle': 'Sign in with Google',
    'or': 'OR',
    'emailAddress': 'Email Address',
    'password': 'Password',
    'login': 'Login',
    'createAccount': 'Create Account',
    'loading': 'Loading...',
    'dontHaveAccount': "Don't have an account?",
    'alreadyHaveAccount': "Already have an account?",
    'signUp': 'Sign Up',
    'logout': 'Logout',
    'myWebsites': 'My Websites', // New
    'yourWebsites': 'Your Websites',
    'createNewWebsite': 'Create New Website',
    'loadingYourWebsites': 'Loading your websites...',
    'noWebsitesYet': 'No websites yet!',
    'clickButtonCreateFirst': 'Click the button above to create your first one.',
    'editSite': 'Edit Site',
    'save': 'Save',
    'saveAndPublish': 'Save & Publish',
    'saving': 'Saving...',
    'saved': 'Saved!',
    'error': 'Error!',
    'projectSettings': 'Project Settings',
    'globalTheme': 'Global Theme',
    'themeColor': 'Theme Color',
    'pages': 'Pages',
    'applyPageTemplate': 'Apply Page Template',
    'addNewPage': 'Add New Page',
    'sections': 'Sections',
    'addNewSection': 'Add New Section',
    'addANewPage': 'Add a New Page',
    'enterCustomPageNameOptional': 'Enter Custom Page Name (Optional)',
    'orSelectAPageTemplate': 'Or select a page template...',
    'createPage': 'Create Page',
    'cancel': 'Cancel',
    'addANewSection': 'Add New Section',
    'applyPageTemplateModal': 'Apply Page Template',
    'applyTemplateWarning': 'Applying a template will replace all existing sections on the current page. This cannot be undone.',
    'deleteSectionConfirm': 'Are you sure you want to delete this section? This action cannot be undone.',
    'toggleEditorPanel': 'Toggle editor panel',
    'exitEditor': 'Exit editor',
    'aiCopilot': 'AI Co-pilot',
    'closeChat': 'Close chat',
    'chatBotGreeting': "Hi! I'm your AI co-pilot. You can ask me to edit your site directly, like 'change the headline to...'.",
    'chatInputPlaceholder': 'e.g., Change my headline...',
    'sendMessage': 'Send message',
    'chatConnectionError': "Sorry, I'm having trouble connecting. Please try again later.",
    'voiceAssistant': 'Voice Assistant',
    'stopVoiceAssistant': 'Stop voice assistant',
    'startVoiceAssistant': 'Start voice assistant',
    'you': 'You',
    'ai': 'AI',
    'uiLanguage': 'UI Language',
    'preview': 'Preview',
    'edit': 'Edit',
    'defaultContentLanguage': 'Default Content Language',
    'supportedContentLanguages': 'Supported Content Languages',
    'currentPreviewLanguage': 'Current Preview Language',
    'translateContent': 'Translate Content to Secondary Language',
    'translating': 'Translating',
    'translatedSuccess': 'Translation successful!',
    'translationFailed': 'Translation failed!',
    'newPage': 'New Page',
    'newEvent': 'New Event',
    'role': 'Role',
    'newPageName': 'New Page Name',
    'applyTemplate': 'Apply Template',
    'default': 'Default',
    'publish': 'Publish',
    'publishedSuccess': 'Published!',
    'allRightsReserved': 'All Rights Reserved',
    'closeModal': 'Close Modal',
    'translateContentConfirm': 'Are you sure you want to translate the entire website content to {{langName}}? This will overwrite any existing content in that language.',
    'moveUp': 'Move Up',
    'moveDown': 'Move Down',
    // New section/item creation defaults
    'newAboutSection': 'About Us',
    'tellYourStoryHere': 'Tell your story here.',
    'newProducts': 'Our Products',
    'newFeatures': 'Key Features',
    'newPricing': 'Our Pricing',
    'newGallery': 'Our Gallery',
    'newTestimonials': 'Client Testimonials',
    'newFaq': 'Frequently Asked Questions',
    'newCallToAction': 'Call to Action',
    'newBlogPosts': 'Latest Blog Posts',
    'newContactSection': 'Contact Us',
    'serviceName': 'Service Name',
    'briefDescription': 'Brief description.',
    'newProduct': 'New Product',
    'productDetails': 'Product details.',
    'newFeature': 'New Feature',
    'featureDetails': 'Feature details.',
    'newPlan': 'New Plan',
    'feature1': 'Feature 1',
    'newClient': 'New Client',
    'newMember': 'New Member',
    'jobTitle': 'Job Title',
    'newImage': 'New Image',
    'glowingReview': 'A glowing review.',
    'customer': 'Customer',
    'newQuestion': 'New Question?',
    'answerToNewQuestion': 'The answer to the new question.',
    'newCallToActionHeadline': 'New Call to Action', // Distinct from newCallToAction for title
    'encourageUsers': 'Encourage users.',
    'actNow': 'Act Now',
    'newBlogPost': 'New Post',
    'briefSummary': 'A brief summary.',
    'author': 'Author',
    'newContact': 'New Contact',
    'addressPlaceholder': '123 Main St',
    'phonePlaceholder': '555-1234',
    'newHeroSection': 'New Hero Section',
    'captivateAudience': 'Captivate your audience.',
    'discover': 'Discover',
    'ourHistory': 'Our History',
    'keyMilestones': 'Key milestones in our journey.',
    'founded': 'Founded',
    'newServices': 'New Services',
    'ourClients': 'Our Clients',
    'ourTeam': 'Our Team',
    'websiteContentLanguages': 'Website Content Languages',
  },
  ar: {
    'createWebsite': 'إنشاء موقع إلكتروني جديد',
    'provideDetails': 'قدّم بعض التفاصيل الأساسية للبدء.',
    'companyName': 'اسم شركتك',
    'selectIndustry': 'اختر مجال العمل...',
    'describeWebsiteAI': 'صف موقعك (لتوليد الذكاء الاصطناعي)',
    'aiPromptPlaceholder': 'مثال: "مدونة تقنية حديثة عن الذكاء الاصطناعي بتصميم داكن وبسيط" أو "موقع مطعم حيوي يركز على المأكولات الإيطالية مع نظام حجز عبر الإنترنت"',
    'uploadBrochureOptional': 'أو حمّل كتيبًا (اختياري، لتوليد الذكاء الاصطناعي)',
    'uploadFile': 'تحميل ملف',
    'dragAndDrop': 'أو اسحب وأفلت',
    'imageSelected': 'تم اختيار الصورة!',
    'imageFormats': 'PNG, JPG حتى 10 ميجابايت',
    'chooseTheme': 'اختر سمة أساسية',
    'light': 'فاتح',
    'dark': 'داكن',
    'generateWithAI': 'إنشاء بالذكاء الاصطناعي',
    'startWithTemplate': 'البدء بقالب',
    'aiBuildingSite': 'الذكاء الاصطناعي يبني موقعك...',
    'generatingFromBrochure': 'جاري الإنشاء بالذكاء الاصطناعي من كتيبك...',
    'generatingFromDescription': 'جاري الإنشاء بالذكاء الاصطناعي من وصفك...',
    'generatingWithAI': 'جاري الإنشاء بالذكاء الاصطناعي...',
    'craftingFromTemplate': 'جاري صياغة القالب...',
    'errorCompanyNameIndustryRequired': 'الرجاء إدخال اسم الشركة واختيار مجال العمل.',
    'errorWebsiteGenerationFailed': 'فشل إنشاء الموقع الإلكتروني. قد يكون هذا بسبب طلب معقد، مشاكل في الشبكة، أو خطأ في واجهة برمجة التطبيقات. الرجاء المحاولة مرة أخرى أو تبسيط طلبك.',
    'buildStunningWebsite': 'أنشئ موقعك الإلكتروني المذهل',
    'inMinutes': 'في دقائق معدودة',
    'effortlesslyCreate': 'أنشئ حضورًا احترافيًا عبر الإنترنت بسهولة باستخدام منشئنا المدعوم بالذكاء الاصطناعي. بلا أكواد، بلا عناء. رؤيتك فقط، تتحقق على أرض الواقع.',
    'getStartedForFree': 'ابدأ مجانًا',
    'fourteenDayFreeTrial': 'تجربة مجانية لمدة 14 يومًا، لا تتطلب بطاقة ائتمان.', // New
    'welcomeBack': 'مرحبًا بعودتك',
    'signInManageWebsites': 'سجّل الدخول لإدارة مواقعك.',
    'createAccountGetStarted': 'أنشئ حسابًا للبدء.',
    'signInGoogle': 'تسجيل الدخول باستخدام جوجل',
    'or': 'أو',
    'emailAddress': 'عنوان البريد الإلكتروني',
    'password': 'كلمة المرور',
    'login': 'تسجيل الدخول',
    'createAccount': 'إنشاء حساب',
    'loading': 'جاري التحميل...',
    'dontHaveAccount': 'أليس لديك حساب؟',
    'alreadyHaveAccount': 'هل لديك حساب بالفعل؟',
    'signUp': 'التسجيل',
    'logout': 'تسجيل الخروج',
    'myWebsites': 'مواقعي', // New
    'yourWebsites': 'مواقعك',
    'createNewWebsite': 'إنشاء موقع إلكتروني جديد',
    'loadingYourWebsites': 'جاري تحميل مواقعك...',
    'noWebsitesYet': 'لا توجد مواقع بعد!',
    'clickButtonCreateFirst': 'انقر على الزر أعلاه لإنشاء أول موقع لك.',
    'editSite': 'تعديل الموقع',
    'save': 'حفظ',
    'saveAndPublish': 'حفظ ونشر',
    'saving': 'جاري الحفظ...',
    'saved': 'تم الحفظ!',
    'error': 'خطأ!',
    'projectSettings': 'إعدادات المشروع',
    'globalTheme': 'السمة العامة',
    'themeColor': 'لون السمة',
    'pages': 'الصفحات',
    'applyPageTemplate': 'تطبيق قالب صفحة',
    'addNewPage': 'إضافة صفحة جديدة',
    'sections': 'الأقسام',
    'addNewSection': 'إضافة قسم جديد',
    'addANewPage': 'إضافة صفحة جديدة',
    'enterCustomPageNameOptional': 'أدخل اسم صفحة مخصص (اختياري)',
    'orSelectAPageTemplate': 'أو اختر قالب صفحة...',
    'createPage': 'إنشاء صفحة',
    'cancel': 'إلغاء',
    'addANewSection': 'إضافة قسم جديد',
    'applyPageTemplateModal': 'تطبيق قالب صفحة',
    'applyTemplateWarning': 'سيؤدي تطبيق قالب إلى استبدال جميع الأقسام الموجودة في الصفحة الحالية. لا يمكن التراجع عن هذا الإجراء.',
    'deleteSectionConfirm': 'هل أنت متأكد أنك تريد حذف هذا القسم؟ لا يمكن التراجع عن هذا الإجراء.',
    'toggleEditorPanel': 'تبديل لوحة التحرير',
    'exitEditor': 'الخروج من المحرر',
    'aiCopilot': 'الطيار المساعد بالذكاء الاصطناعي',
    'closeChat': 'إغلاق الدردشة',
    'chatBotGreeting': "مرحباً! أنا مساعدك بالذكاء الاصطناعي. يمكنك أن تطلب مني تعديل موقعك مباشرة، مثل 'تغيير العنوان إلى...'.",
    'chatInputPlaceholder': 'مثال: غير عنواني...',
    'sendMessage': 'إرسال رسالة',
    'chatConnectionError': 'عذراً، أواجه مشكلة في الاتصال. الرجاء المحاولة لاحقاً.',
    'voiceAssistant': 'المساعد الصوتي',
    'stopVoiceAssistant': 'إيقاف المساعد الصوتي',
    'startVoiceAssistant': 'بدء المساعد الصوتي',
    'you': 'أنت',
    'ai': 'الذكاء الاصطناعي',
    'uiLanguage': 'لغة الواجهة',
    'preview': 'معاينة',
    'edit': 'تعديل',
    'defaultContentLanguage': 'لغة المحتوى الافتراضية',
    'supportedContentLanguages': 'لغات المحتوى المدعومة',
    'currentPreviewLanguage': 'لغة المعاينة الحالية',
    'translateContent': 'ترجمة المحتوى إلى اللغة الثانوية',
    'translating': 'جاري الترجمة',
    'translatedSuccess': 'تمت الترجمة بنجاح!',
    'translationFailed': 'فشلت الترجمة!',
    'newPage': 'صفحة جديدة',
    'newEvent': 'حدث جديد',
    'role': 'الدور',
    'newPageName': 'اسم صفحة جديدة',
    'applyTemplate': 'تطبيق القالب',
    'default': 'افتراضي',
    'publish': 'نشر',
    'publishedSuccess': 'تم النشر!',
    'allRightsReserved': 'جميع الحقوق محفوظة',
    'closeModal': 'إغلاق النافذة',
    'translateContentConfirm': 'هل أنت متأكد أنك تريد ترجمة محتوى الموقع بالكامل إلى {{langName}}؟ سيؤدي هذا إلى الكتابة فوق أي محتوى موجود بتلك اللغة.',
    'moveUp': 'نقل للأعلى',
    'moveDown': 'نقل للأسفل',
    // New section/item creation defaults (Arabic)
    'newAboutSection': 'عنا',
    'tellYourStoryHere': 'احكِ قصتك هنا.',
    'newProducts': 'منتجاتنا',
    'newFeatures': 'الميزات الرئيسية',
    'newPricing': 'أسعارنا',
    'newGallery': 'معرضنا',
    'newTestimonials': 'شهادات العملاء',
    'newFaq': 'الأسئلة الشائعة',
    'newCallToAction': 'دعوة للعمل',
    'newBlogPosts': 'أحدث المدونات',
    'newContactSection': 'اتصل بنا',
    'serviceName': 'اسم الخدمة',
    'briefDescription': 'وصف موجز.',
    'newProduct': 'منتج جديد',
    'productDetails': 'تفاصيل المنتج.',
    'newFeature': 'ميزة جديدة',
    'featureDetails': 'تفاصيل الميزة.',
    'newPlan': 'خطة جديدة',
    'feature1': 'الميزة 1',
    'newClient': 'عميل جديد',
    'newMember': 'عضو جديد',
    'jobTitle': 'المسمى الوظيفي',
    'newImage': 'صورة جديدة',
    'glowingReview': 'مراجعة متوهجة.',
    'customer': 'عميل',
    'newQuestion': 'سؤال جديد؟',
    'answerToNewQuestion': 'إجابة على السؤال الجديد.',
    'newCallToActionHeadline': 'دعوة جديدة للعمل',
    'encourageUsers': 'شجع المستخدمين.',
    'actNow': 'تواصل الآن',
    'newBlogPost': 'منشور جديد',
    'briefSummary': 'ملخص موجز.',
    'author': 'المؤلف',
    'newContact': 'اتصال جديد',
    'addressPlaceholder': '123 الشارع الرئيسي',
    'phonePlaceholder': '555-1234',
    'newHeroSection': 'قسم البطل الجديد',
    'captivateAudience': 'اجذب جمهورك.',
    'discover': 'اكتشف',
    'ourHistory': 'تاريخنا',
    'keyMilestones': 'المحطات الرئيسية في رحلتنا.',
    'founded': 'تأسست',
    'newServices': 'خدمات جديدة',
    'ourClients': 'عملاؤنا',
    'ourTeam': 'فريقنا',
    'websiteContentLanguages': 'لغات محتوى الموقع',
  },
};

interface LanguageContextType {
  currentUILanguage: string;
  setUILanguage: React.Dispatch<React.SetStateAction<string>>;
  t: (key: string, variables?: Record<string, string>) => string; // Updated t signature
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUILanguage, setUILanguage] = useState<string>(() => {
    // Get browser language, fall back to 'en'
    const browserLanguage = navigator.language.split('-')[0];
    return LANGUAGES.some(lang => lang.code === browserLanguage) ? browserLanguage : 'en';
  });

  const t = useCallback((key: string, variables?: Record<string, string>): string => {
    let translation = UI_TRANSLATIONS[currentUILanguage]?.[key] || UI_TRANSLATIONS.en[key] || key;
    if (variables) {
      for (const [varName, varValue] of Object.entries(variables)) {
        translation = translation.replace(`{{${varName}}}`, varValue);
      }
    }
    return translation;
  }, [currentUILanguage]);

  return (
    <LanguageContext.Provider value={{ currentUILanguage, setUILanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


// --- Section Helper Functions ---
const createHeroSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: HeroSection['layout'] = 'left-aligned', defaultLang: string): HeroSection => ({
  id: generateId(`hero-${index}`),
  type: 'Hero',
  enabled: true,
  headline: { [defaultLang]: `${companyName[defaultLang]}: Innovate. Create. Inspire.` },
  subheadline: { [defaultLang]: `We bring your visions to life with cutting-edge solutions and unparalleled creativity. Discover what makes us different.` },
  ctaText: { [defaultLang]: 'Explore Services' },
  ctaText2: { [defaultLang]: 'Contact Us' },
  backgroundImage: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-hero-${index}/1920/1080`,
  layout,
  theme: 'dark', // Hero sections often look best dark for impact
});

const createAboutSection = (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', index: number = 0, layout: AboutSection['layout'] = 'image-right', defaultLang: string): AboutSection => ({
  id: generateId(`about-${index}`),
  type: 'About',
  enabled: true,
  title: { [defaultLang]: `About ${companyName[defaultLang]}` },
  text: { [defaultLang]: `With years of experience in the ${industry} sector, ${companyName[defaultLang]} is dedicated to providing exceptional solutions. Our mission is to empower businesses and individuals alike through innovation, quality, and a commitment to excellence. We believe in building lasting relationships with our clients, understanding their unique needs, and delivering results that exceed expectations.` },
  image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-about-${index}/600/400`,
  layout,
  theme,
});

const createStorySection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): StorySection => ({
    id: generateId(`story-${index}`),
    type: 'Story',
    enabled: true,
    title: { [defaultLang]: `Our Journey at ${companyName[defaultLang]}` },
    text: { [defaultLang]: `From humble beginnings to a leading name, our commitment to innovation and customer satisfaction has driven us every step of the way.` },
    timeline: [
        { id: generateId('timeline-item-0'), year: '2010', event: { [defaultLang]: `Founded ${companyName[defaultLang]} with a vision for the future` } },
        { id: generateId('timeline-item-1'), year: '2015', event: { [defaultLang]: `Expanded operations and welcomed key talent` } },
        { id: generateId('timeline-item-2'), year: '2020', event: { [defaultLang]: `Launched our flagship product/service, transforming the ${companyName[defaultLang].toLowerCase().includes('agency') ? 'digital' : 'industry'}` } },
        { id: generateId('timeline-item-3'), year: '2023', event: { [defaultLang]: `Achieved significant milestones and garnered industry recognition` } },
    ],
    theme,
});

const createServicesSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: ServicesSection['layout'] = 'grid-icon-top', defaultLang: string): ServicesSection => ({
  id: generateId(`services-${index}`),
  type: 'Services',
  enabled: true,
  title: { [defaultLang]: `Our Expert Services` },
  items: [
    { id: generateId('si'), icon: 'Briefcase', name: { [defaultLang]: 'Strategic Consulting' }, description: { [defaultLang]: 'Unlock your business potential with expert guidance and insights tailored to your goals.' } },
    { id: generateId('si'), icon: 'Chart', name: { [defaultLang]: 'Market Analysis' }, description: { [defaultLang]: 'Gain a competitive edge with in-depth market research and data-driven strategies.' } },
    { id: generateId('si'), icon: 'Megaphone', name: { [defaultLang]: 'Digital Marketing' }, description: { [defaultLang]: 'Amplify your online presence and reach your target audience effectively.' } },
    { id: generateId('si'), icon: 'Code', name: { [defaultLang]: 'Web Development' }, description: { [defaultLang]: 'Build robust, scalable, and user-friendly websites and applications.' } },
  ],
  layout,
  theme,
});

const createProductsSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): ProductsSection => ({
    id: generateId(`products-${index}`),
    type: 'Products',
    enabled: true,
    title: { [defaultLang]: `Our Latest Products` },
    items: [
        { id: generateId('pi'), name: { [defaultLang]: 'Product Alpha' }, description: { [defaultLang]: 'Innovative solution for modern needs.' }, price: '$29.99', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-prod-alpha/400/300` },
        { id: generateId('pi'), name: { [defaultLang]: 'Product Beta' }, description: { [defaultLang]: 'Next-gen tool for efficiency.' }, price: '$49.00', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-prod-beta/400/300` },
        { id: generateId('pi'), name: { [defaultLang]: 'Product Gamma' }, description: { [defaultLang]: 'Essential for every professional.' }, price: '$19.50', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-prod-gamma/400/300` },
    ],
    theme,
});

const createFeaturesSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: FeaturesSection['layout'] = 'image-right-text-left', defaultLang: string): FeaturesSection => ({
    id: generateId(`features-${index}`),
    type: 'Features',
    enabled: true,
    // Fix: Explicitly assert the type of 'title' to resolve a potential subtle type inference issue,
    // ensuring it's treated as Record<string, string> where expected.
    title: { [defaultLang]: `Why Choose ${companyName[defaultLang]}?` } as Record<string, string>,
    items: [
        { id: generateId('fi-1'), name: { [defaultLang]: 'Unmatched Quality' }, description: { [defaultLang]: 'We are committed to delivering products and services of the highest standard.' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-feature-1/600/400` },
        { id: generateId('fi-2'), name: { [defaultLang]: 'Customer-Centric Approach' }, description: { [defaultLang]: 'Your satisfaction is our priority. We listen, adapt, and deliver.' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-feature-2/600/400` },
        { id: generateId('fi-3'), name: { [defaultLang]: 'Innovative Solutions' }, description: { [defaultLang]: 'Leveraging the latest technology to provide cutting-edge results.' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-feature-3/600/400` },
    ],
    layout,
    theme,
});

const createPricingSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): PricingSection => ({
    id: generateId(`pricing-${index}`),
    type: 'Pricing',
    enabled: true,
    title: { [defaultLang]: 'Flexible Pricing Plans' },
    items: [
        { id: generateId('pr1'), plan: { [defaultLang]: 'Basic' }, price: '49', period: { [defaultLang]: 'month' }, features: [{ [defaultLang]: 'Feature A' }, { [defaultLang]: 'Feature B' }, { [defaultLang]: 'Basic Support' }], featured: false },
        { id: generateId('pr2'), plan: { [defaultLang]: 'Pro' }, price: '99', period: { [defaultLang]: 'month' }, features: [{ [defaultLang]: 'All Basic Features' }, { [defaultLang]: 'Feature C' }, { [defaultLang]: 'Priority Support' }, { [defaultLang]: 'Advanced Analytics' }], featured: true },
        { id: generateId('pr3'), plan: { [defaultLang]: 'Enterprise' }, price: 'Contact Us', period: '', features: [{ [defaultLang]: 'All Pro Features' }, { [defaultLang]: 'Custom Integrations' }, { [defaultLang]: 'Dedicated Account Manager' }], featured: false },
    ],
    theme,
});

const createClientsSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): ClientsSection => ({
    id: generateId(`clients-${index}`),
    type: 'Clients',
    enabled: true,
    title: { [defaultLang]: 'Trusted by Industry Leaders' },
    items: [
        { id: generateId('cl1'), name: { [defaultLang]: 'Client A' }, logo: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-client-a/200/100` },
        { id: generateId('cl2'), name: { [defaultLang]: 'Client B' }, logo: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-client-b/200/100` },
        { id: generateId('cl3'), name: { [defaultLang]: 'Client C' }, logo: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-client-c/200/100` },
        { id: generateId('cl4'), name: { [defaultLang]: 'Client D' }, logo: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-client-d/200/100` },
    ],
    theme: 'light', // Forcing 'light' theme for the Clients section for better logo visibility.
});

const createTeamSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: TeamSection['layout'] = 'grid', defaultLang: string): TeamSection => ({
    id: generateId(`team-${index}`),
    type: 'Team',
    enabled: true,
    title: { [defaultLang]: `Meet the Team Behind ${companyName[defaultLang]}` },
    members: [
        { id: generateId('tm1'), name: { [defaultLang]: 'John Doe' }, title: { [defaultLang]: 'CEO & Founder' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-team-john/400/400`, social: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' } },
        { id: generateId('tm2'), name: { [defaultLang]: 'Jane Smith' }, title: { [defaultLang]: 'Lead Designer' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-team-jane/400/400`, social: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' } },
        { id: generateId('tm3'), name: { [defaultLang]: 'Peter Jones' }, title: { [defaultLang]: 'Head of Development' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-team-peter/400/400`, social: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' } },
        { id: generateId('tm4'), name: { [defaultLang]: 'Sarah Brown' }, title: { [defaultLang]: 'Marketing Director' }, image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-team-sarah/400/400`, social: { twitter: '#', linkedin: '#', facebook: '#', instagram: '#' } },
    ],
    layout,
    theme,
});

const createGallerySection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: GallerySection['layout'] = 'grid', defaultLang: string): GallerySection => ({
    id: generateId(`gallery-${index}`),
    type: 'Gallery',
    enabled: true,
    title: { [defaultLang]: 'Our Portfolio' },
    items: [
        { id: generateId('gi1'), image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-gallery-1/500/500`, title: { [defaultLang]: 'Project Alpha' }, category: { [defaultLang]: 'Design' } },
        { id: generateId('gi2'), image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-gallery-2/500/500`, title: { [defaultLang]: 'Creative Solution' }, category: { [defaultLang]: 'Marketing' } },
        { id: generateId('gi3'), image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-gallery-3/500/500`, title: { [defaultLang]: 'Web Development' }, category: { [defaultLang]: 'Development' } },
        { id: generateId('gi4'), image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-gallery-4/500/500`, title: { [defaultLang]: 'Brand Identity' }, category: { [defaultLang]: 'Design' } },
    ],
    layout,
    theme,
});

const createTestimonialsSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: TestimonialsSection['layout'] = 'grid', defaultLang: string): TestimonialsSection => ({
    id: generateId(`testimonials-${index}`),
    type: 'Testimonials',
    enabled: true,
    title: { [defaultLang]: 'What Our Clients Say' },
    items: [
        { id: generateId('ti1'), text: { [defaultLang]: 'Outstanding service and incredible results. Our business has seen significant growth thanks to their expertise.' }, author: { [defaultLang]: 'Alice Johnson' }, role: { [defaultLang]: 'CEO, Tech Innovations' }, avatar: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-avatar-alice/100/100` },
        { id: generateId('ti2'), text: { [defaultLang]: 'A truly collaborative partner. They understood our vision perfectly and delivered beyond expectations.' }, author: { [defaultLang]: 'Bob Williams' }, role: { [defaultLang]: 'Marketing Lead, Global Corp' }, avatar: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-avatar-bob/100/100` },
        { id: generateId('ti3'), text: { [defaultLang]: 'Professional, responsive, and always ready to help. Highly recommend their services!' }, author: { [defaultLang]: 'Carol Davis' }, role: { [defaultLang]: 'Founder, Creative Solutions' }, avatar: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-avatar-carol/100/100` },
    ],
    layout,
    theme,
});

const createFAQSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): FAQSection => ({
    id: generateId(`faq-${index}`),
    type: 'FAQ',
    enabled: true,
    title: { [defaultLang]: 'Frequently Asked Questions' },
    items: [
        { id: generateId('faq1'), question: { [defaultLang]: 'How long does it take to build a website?' }, answer: { [defaultLang]: 'The timeline varies depending on complexity, but our AI-powered builder can get you started in minutes, with full customization typically taking a few days.' } },
        { id: generateId('faq2'), question: { [defaultLang]: 'Do I need any coding knowledge?' }, answer: { [defaultLang]: 'Absolutely not! Our platform is designed for everyone, no coding required. You can build and manage your site with an intuitive drag-and-drop interface.' } },
        { id: generateId('faq3'), question: { [defaultLang]: 'Can I update my website myself?' }, answer: { [defaultLang]: 'Yes, our editor allows you to easily update all aspects of your website anytime, anywhere, without needing a developer.' } },
    ],
    theme,
});

const createCTASection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string): CTASection => ({
    id: generateId(`cta-${index}`),
    type: 'CTA',
    enabled: true,
    title: { [defaultLang]: `Ready to Transform Your Online Presence?` },
    text: { [defaultLang]: `Join thousands of satisfied customers who have built stunning websites with ${companyName[defaultLang]}.` },
    ctaText: { [defaultLang]: 'Get Started Today' },
    ctaLink: '#',
    backgroundImage: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-cta-bg/1920/1080`,
    theme: 'dark', // CTA sections often look good with a dark, impactful theme
});

const createBlogSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: BlogSection['layout'] = 'grid', defaultLang: string): BlogSection => ({
    id: generateId(`blog-${index}`),
    type: 'Blog',
    enabled: true,
    title: { [defaultLang]: 'Latest News & Insights' },
    items: [
        { id: generateId('bi1'), title: { [defaultLang]: 'The Future of AI in Web Design' }, excerpt: { [defaultLang]: 'Explore how artificial intelligence is revolutionizing the way we create and interact with websites.' }, author: { [defaultLang]: 'AI Expert' }, date: '2024-03-10', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-blog-ai/400/300` },
        { id: generateId('bi2'), title: { [defaultLang]: '5 Tips for a Stunning Website' }, excerpt: { [defaultLang]: 'Discover key strategies to make your website stand out and attract more visitors.' }, author: { [defaultLang]: 'Design Guru' }, date: '2024-03-05', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-blog-tips/400/300` },
        { id: generateId('bi3'), title: { [defaultLang]: 'SEO Essentials for Small Businesses' }, excerpt: { [defaultLang]: 'Learn the basics of Search Engine Optimization to improve your site\'s visibility.' }, author: { [defaultLang]: 'Marketing Pro' }, date: '2024-02-28', image: `https://picsum.photos/seed/${companyName[defaultLang].replace(/\s/g, '-')}-blog-seo/400/300` },
    ],
    layout,
    theme,
});

const createContactSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, layout: ContactSection['layout'] = 'address-left-form-right', defaultLang: string): ContactSection => ({
    id: generateId(`contact-${index}`),
    type: 'Contact',
    enabled: true,
    title: { [defaultLang]: 'Get in Touch' },
    address: { [defaultLang]: `123 Main Street, Anytown, ${companyName[defaultLang]} 12345` },
    email: `info@${companyName[defaultLang].toLowerCase().replace(/\s/g, '')}.com`,
    phone: '+1 (555) 123-4567',
    formRecipientEmail: `form@${companyName[defaultLang].toLowerCase().replace(/\s/g, '')}.com`,
    layout,
    theme,
});

const createFooterSection = (companyName: Record<string, string>, theme: 'light' | 'dark', index: number = 0, defaultLang: string, t: (key: string) => string): FooterSection => ({
    id: generateId(`footer-${index}`),
    type: 'Footer',
    enabled: true,
    // FIX: Wrapped string literal in a multilingual object
    text: { [defaultLang]: `© ${new Date().getFullYear()} ${companyName[defaultLang]}. ${t('allRightsReserved')}` },
    socialLinks: {
        twitter: '#',
        linkedin: '#',
        facebook: '#',
        instagram: '#',
    },
    theme: 'dark', // Footer sections often benefit from a dark, consistent theme
});


// Helper function to create a default section of a given type
export const createDefaultSection = (
    companyName: Record<string, string>,
    theme: 'light' | 'dark',
    defaultLang: string,
    t: (key: string, variables?: Record<string, string>) => string, // Pass t function
    sectionType: Section['type'],
    index: number = 0
): Section => {
    switch (sectionType) {
        case 'Hero': return createHeroSection(companyName, theme, index, 'centered', defaultLang);
        case 'About': return createAboutSection(companyName, 'Business Services', theme, index, 'image-right', defaultLang);
        case 'Story': return createStorySection(companyName, theme, index, defaultLang);
        case 'Services': return createServicesSection(companyName, theme, index, 'grid-icon-top', defaultLang);
        case 'Products': return createProductsSection(companyName, theme, index, defaultLang);
        case 'Features': return createFeaturesSection(companyName, theme, index, 'image-right-text-left', defaultLang);
        case 'Pricing': return createPricingSection(companyName, theme, index, defaultLang);
        case 'Clients': return createClientsSection(companyName, theme, index, defaultLang);
        case 'Team': return createTeamSection(companyName, theme, index, 'grid', defaultLang);
        case 'Gallery': return createGallerySection(companyName, theme, index, 'grid', defaultLang);
        case 'Testimonials': return createTestimonialsSection(companyName, theme, index, 'grid', defaultLang);
        case 'FAQ': return createFAQSection(companyName, theme, index, defaultLang);
        case 'CTA': return createCTASection(companyName, theme, index, defaultLang);
        case 'Blog': return createBlogSection(companyName, theme, index, 'grid', defaultLang);
        case 'Contact': return createContactSection(companyName, theme, index, 'address-left-form-right', defaultLang);
        case 'Footer': return createFooterSection(companyName, theme, index, defaultLang, t);
        default:
            // Fallback for an unknown section type, though ideally all types are handled
            return {
                id: generateId('unknown'),
                type: 'Hero', // Default to Hero to satisfy the type, though this case should ideally not be hit
                enabled: false,
                headline: { [defaultLang]: 'Unknown Section' },
                subheadline: { [defaultLang]: 'This section type is not recognized.' },
                ctaText: { [defaultLang]: 'Learn More' },
                backgroundImage: 'https://picsum.photos/seed/unknown/1920/1080',
                theme: 'dark',
            } as HeroSection; // Cast to satisfy HeroSection, as it's the simplest complete section
    }
};

// --- Page Templates ---
export const PAGE_TEMPLATES = {
    'Home': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'home',
        name: { [defaultLang]: 'Home' },
        sections: [
            createHeroSection(companyName, theme, 0, 'centered', defaultLang),
            createAboutSection(companyName, industry, theme, 0, 'image-left', defaultLang),
            createServicesSection(companyName, theme, 0, 'grid-icon-top', defaultLang),
            createFeaturesSection(companyName, theme, 0, 'image-right-text-left', defaultLang),
            createTestimonialsSection(companyName, theme, 0, 'grid', defaultLang),
            createCTASection(companyName, theme, 0, defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'About Us': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'about-us',
        name: { [defaultLang]: 'About Us' },
        sections: [
            createHeroSection(companyName, theme, 0, 'centered', defaultLang),
            createAboutSection(companyName, industry, theme, 0, 'image-right', defaultLang),
            createStorySection(companyName, theme, 0, defaultLang),
            createTeamSection(companyName, theme, 0, 'grid', defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'Services': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'services',
        name: { [defaultLang]: 'Services' },
        sections: [
            createHeroSection(companyName, theme, 0, 'left-aligned', defaultLang),
            createServicesSection(companyName, theme, 0, 'list-icon-left', defaultLang),
            createPricingSection(companyName, theme, 0, defaultLang),
            createClientsSection(companyName, theme, 0, defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'Portfolio': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'portfolio',
        name: { [defaultLang]: 'Portfolio' },
        sections: [
            createHeroSection(companyName, theme, 0, 'centered', defaultLang),
            createGallerySection(companyName, theme, 0, 'grid', defaultLang),
            createCTASection(companyName, theme, 0, defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'Contact': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'contact',
        name: { [defaultLang]: 'Contact' },
        sections: [
            createHeroSection(companyName, theme, 0, 'centered', defaultLang),
            createContactSection(companyName, theme, 0, 'address-left-form-right', defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'Blog': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
        id: 'blog',
        name: { [defaultLang]: 'Blog' },
        sections: [
            createHeroSection(companyName, theme, 0, 'centered', defaultLang),
            createBlogSection(companyName, theme, 0, 'grid', defaultLang),
            createCTASection(companyName, theme, 0, defaultLang),
            createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
    }),
    'Products': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
      id: 'products',
      name: { [defaultLang]: 'Products' },
      sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createProductsSection(companyName, theme, 0, defaultLang),
          createCTASection(companyName, theme, 0, defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
      ],
    }),
    'Pricing': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
      id: 'pricing',
      name: { [defaultLang]: 'Pricing' },
      sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createPricingSection(companyName, theme, 0, defaultLang),
          createFAQSection(companyName, theme, 0, defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
      ],
    }),
    'Gallery': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
      id: 'gallery',
      name: { [defaultLang]: 'Gallery' },
      sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createGallerySection(companyName, theme, 0, 'grid', defaultLang),
          createCTASection(companyName, theme, 0, defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
      ],
    }),
    'FAQ': (companyName: Record<string, string>, industry: Industry, theme: 'light' | 'dark', defaultLang: string, t: (key: string) => string): Page => ({
      id: 'faq',
      name: { [defaultLang]: 'FAQ' },
      sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createFAQSection(companyName, theme, 0, defaultLang),
          createCTASection(companyName, theme, 0, defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
      ],
    })
};

export const INDUSTRY_TEMPLATES: {
  [key in Industry]: {
    defaultThemeColor: string;
    template: (theme: 'light' | 'dark', companyName: Record<string, string>, defaultLang: string, t: (key: string) => string) => Page[];
  };
} = {
  'Design Agency': {
    defaultThemeColor: '#3B82F6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Design Agency', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Design Agency', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Design Agency', theme, defaultLang, t),
      PAGE_TEMPLATES.Portfolio(companyName, 'Design Agency', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Design Agency', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Charity': {
    defaultThemeColor: '#14B8A6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Charity', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Charity', theme, defaultLang, t),
      {
        id: generateId('donate'),
        name: { [defaultLang]: 'Donate' },
        sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createCTASection(companyName, theme, 1, defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
      },
      PAGE_TEMPLATES.Contact(companyName, 'Charity', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Hotel': {
    defaultThemeColor: '#F97316',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Hotel', theme, defaultLang, t),
      {
        id: generateId('rooms'),
        name: { [defaultLang]: 'Rooms & Suites' },
        sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createGallerySection(companyName, theme, 0, 'grid', defaultLang),
          createTestimonialsSection(companyName, theme, 0, 'grid', defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
      },
      {
        id: generateId('amenities'),
        name: { [defaultLang]: 'Amenities' },
        sections: [
          createHeroSection(companyName, theme, 0, 'left-aligned', defaultLang),
          createServicesSection(companyName, theme, 0, 'grid-icon-top', defaultLang),
          createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
      },
      PAGE_TEMPLATES.Contact(companyName, 'Hotel', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Business Services': {
    defaultThemeColor: '#A3E635',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Business Services', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Business Services', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Business Services', theme, defaultLang, t),
      PAGE_TEMPLATES.Pricing(companyName, 'Business Services', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Business Services', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Portfolio': {
    defaultThemeColor: '#8B5CF6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Portfolio', theme, defaultLang, t),
      PAGE_TEMPLATES.Portfolio(companyName, 'Portfolio', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Portfolio', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Portfolio', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Interior Designer': {
    defaultThemeColor: '#EC4899',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Interior Designer', theme, defaultLang, t),
      PAGE_TEMPLATES.Portfolio(companyName, 'Interior Designer', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Interior Designer', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Interior Designer', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Online Store': {
    defaultThemeColor: '#EAB308',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Online Store', theme, defaultLang, t),
      PAGE_TEMPLATES.Products(companyName, 'Online Store', theme, defaultLang, t), // Using Products for actual products page
      PAGE_TEMPLATES.Blog(companyName, 'Online Store', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Online Store', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Fashion': {
    defaultThemeColor: '#EF4444',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Fashion', theme, defaultLang, t),
      PAGE_TEMPLATES.Gallery(companyName, 'Fashion', theme, defaultLang, t), // Using Gallery for lookbooks
      PAGE_TEMPLATES.Blog(companyName, 'Fashion', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Fashion', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Furniture': {
    defaultThemeColor: '#A3E635',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Furniture', theme, defaultLang, t),
      PAGE_TEMPLATES.Products(companyName, 'Furniture', theme, defaultLang, t), // For actual furniture products
      PAGE_TEMPLATES.Gallery(companyName, 'Furniture', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Furniture', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Real Estate': {
    defaultThemeColor: '#3B82F6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Real Estate', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Real Estate', theme, defaultLang, t), // For property listings
      PAGE_TEMPLATES['About Us'](companyName, 'Real Estate', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Real Estate', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Construction': {
    defaultThemeColor: '#F97316',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Construction', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Construction', theme, defaultLang, t),
      PAGE_TEMPLATES.Gallery(companyName, 'Construction', theme, defaultLang, t), // For project showcase
      PAGE_TEMPLATES.Contact(companyName, 'Construction', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Marketing': {
    defaultThemeColor: '#8B5CF6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Marketing', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Marketing', theme, defaultLang, t),
      PAGE_TEMPLATES.Pricing(companyName, 'Marketing', theme, defaultLang, t),
      PAGE_TEMPLATES.Blog(companyName, 'Marketing', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Marketing', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Designer': {
    defaultThemeColor: '#EC4899',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Designer', theme, defaultLang, t),
      PAGE_TEMPLATES.Portfolio(companyName, 'Designer', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Designer', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Designer', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Photographer': {
    defaultThemeColor: '#EAB308',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Photographer', theme, defaultLang, t),
      PAGE_TEMPLATES.Gallery(companyName, 'Photographer', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Photographer', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Photographer', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Restaurant': {
    defaultThemeColor: '#EF4444',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Restaurant', theme, defaultLang, t),
      {
        id: generateId('menu'),
        name: { [defaultLang]: 'Menu' },
        sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createProductsSection(companyName, theme, 0, defaultLang), // Using products for menu items
          createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
      },
      PAGE_TEMPLATES['About Us'](companyName, 'Restaurant', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Restaurant', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Store': {
    defaultThemeColor: '#A3E635',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Store', theme, defaultLang, t),
      PAGE_TEMPLATES.Products(companyName, 'Store', theme, defaultLang, t),
      PAGE_TEMPLATES.FAQ(companyName, 'Store', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Store', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Logistics': {
    defaultThemeColor: '#3B82F6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Logistics', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Logistics', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Logistics', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Logistics', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Lawyer': {
    defaultThemeColor: '#F97316',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Lawyer', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Lawyer', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Lawyer', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Lawyer', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Medical': {
    defaultThemeColor: '#14B8A6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Medical', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Medical', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Medical', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Medical', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Technology': {
    defaultThemeColor: '#8B5CF6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Technology', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Technology', theme, defaultLang, t),
      PAGE_TEMPLATES.Products(companyName, 'Technology', theme, defaultLang, t),
      PAGE_TEMPLATES.Blog(companyName, 'Technology', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Technology', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Blog': {
    defaultThemeColor: '#EC4899',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Blog', theme, defaultLang, t),
      PAGE_TEMPLATES.Blog(companyName, 'Blog', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Blog', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Blog', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Events': {
    defaultThemeColor: '#EAB308',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Events', theme, defaultLang, t),
      {
        id: generateId('events-list'),
        name: { [defaultLang]: 'Upcoming Events' },
        sections: [
          createHeroSection(companyName, theme, 0, 'centered', defaultLang),
          createBlogSection(companyName, theme, 0, 'grid', defaultLang), // Reusing blog for events list
          createFooterSection(companyName, theme, 0, defaultLang, t),
        ],
      },
      PAGE_TEMPLATES.Contact(companyName, 'Events', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Child Care': {
    defaultThemeColor: '#A3E635',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Child Care', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Child Care', theme, defaultLang, t),
      PAGE_TEMPLATES['About Us'](companyName, 'Child Care', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Child Care', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Industrial': {
    defaultThemeColor: '#3B82F6',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Industrial', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Industrial', theme, defaultLang, t),
      PAGE_TEMPLATES.Gallery(companyName, 'Industrial', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Industrial', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
  'Security': {
    defaultThemeColor: '#F97316',
    template: (theme, companyName, defaultLang, t) => [
      PAGE_TEMPLATES.Home(companyName, 'Security', theme, defaultLang, t),
      PAGE_TEMPLATES.Services(companyName, 'Security', theme, defaultLang, t),
      PAGE_TEMPLATES.Pricing(companyName, 'Security', theme, defaultLang, t),
      PAGE_TEMPLATES.Contact(companyName, 'Security', theme, defaultLang, t),
    ].map(p => ({ ...p, id: p.id === 'home' ? 'home' : generateId(p.id), name: { [defaultLang]: p.name[defaultLang] || '' } })),
  },
};