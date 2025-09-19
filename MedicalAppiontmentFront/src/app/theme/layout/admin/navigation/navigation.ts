export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/analytics',
        icon: 'feather icon-home'
      }
    ]
  },

  {
    id: 'medical-management',
    title: 'Medical Management',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'patient-management',
        title: 'Patient Management',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
          {
            id: 'patient-list',
            title: 'Patient List',
            type: 'item',
            url: '/patientList',
            icon: 'feather icon-list'
          },
          {
            id: 'add-patient',
            title: 'Add Patient',
            type: 'item',
            url: '/patient-form',
            icon: 'feather icon-user-plus'
          }
        ]
      },
      {
        id: 'doctor-management',
        title: 'Doctor Management',
        type: 'collapse',
        icon: 'feather icon-user-check',
        children: [
          {
            id: 'doctor-list',
            title: 'Doctor List',
            type: 'item',
            url: '/doctorList',
            icon: 'feather icon-list'
          },
          {
            id: 'add-doctor',
            title: 'Add Doctor',
            type: 'item',
            url: '/doctor-form',
            icon: 'feather icon-user-plus'
          }
        ]
      },
      {
        id: 'appointment-management',
        title: 'Appointment Management',
        type: 'collapse',
        icon: 'feather icon-calendar',
        children: [
          {
            id: 'appointments',
            title: 'Appointments',
            type: 'item',
            url: '/appointments',
            icon: 'feather icon-calendar'
          },
          {
            id: 'schedule-appointment',
            title: 'Schedule Appointment',
            type: 'item',
            url: '/appointment-form',
            icon: 'feather icon-plus-circle'
          }
        ]
      },
      {
        id: 'prescription-management',
        title: 'Prescription Management',
        type: 'collapse',
        icon: 'feather icon-file-text',
        children: [
          {
            id: 'prescriptions',
            title: 'Prescriptions',
            type: 'item',
            url: '/prescriptions',
            icon: 'feather icon-file-text'
          },
          {
            id: 'create-prescription',
            title: 'Create Prescription',
            type: 'item',
            url: '/prescription-form',
            icon: 'feather icon-plus'
          }
        ]
      },
      {
        id: 'medicine-management',
        title: 'Medicine Management',
        type: 'collapse',
        icon: 'feather icon-package',
        children: [
          {
            id: 'medicines',
            title: 'Medicines',
            type: 'item',
            url: '/medicines',
            icon: 'feather icon-package'
          },
          {
            id: 'add-medicine',
            title: 'Add Medicine',
            type: 'item',
            url: '/medicine-form',
            icon: 'feather icon-plus'
          }
        ]
      }
    ]
  },

];
