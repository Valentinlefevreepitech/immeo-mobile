import type { ResidentRole } from '@/stores/roleStore';

export type NotificationIcon = 'incident' | 'ag' | 'annonce' | 'document';

export interface MockNotification {
  id: string;
  icon: NotificationIcon;
  title: string;
  subtitle: string;
  time: string;
  unread?: boolean;
  route?: '/incident-detail' | '/ag' | '/documents';
}

export interface NotificationSection {
  id: string;
  label: string;
  items: MockNotification[];
}

export function getNotifications(role: ResidentRole): NotificationSection[] {
  return [
    {
      id: 'today',
      label: "Aujourd'hui",
      items: [
        {
          id: 'incident-intervention',
          icon: 'incident',
          title: 'Votre incident passe en intervention',
          subtitle: 'Fuite robinet cuisine · plombier planifié le 19 mars',
          time: 'Il y a 2 h',
          unread: true,
          route: '/incident-detail',
        },
        {
          id: 'convocation-ag',
          icon: 'ag',
          title: 'Convocation AG disponible',
          subtitle: 'AG du 15 avril · ordre du jour et annexes',
          time: 'Il y a 5 h',
          unread: true,
          route: '/ag',
        },
      ],
    },
    {
      id: 'week',
      label: 'Cette semaine',
      items: [
        {
          id: 'annonce-syndic',
          icon: 'annonce',
          title: 'Nouvelle annonce du syndic',
          subtitle: 'Collecte des encombrants samedi 21 mars',
          time: 'Mar.',
        },
        {
          id: 'document-dispo',
          icon: 'document',
          title:
            role === 'locataire'
              ? 'Quittance de février disponible'
              : 'Appel de fonds T2 disponible',
          subtitle: 'Disponible dans vos documents',
          time: 'Lun.',
          route: '/documents',
        },
      ],
    },
  ];
}
