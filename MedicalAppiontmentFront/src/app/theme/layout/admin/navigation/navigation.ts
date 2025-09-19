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

  {
    id: 'reports-management',
    title: 'Reports & Analytics',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'patient-reports',
        title: 'Patient Reports',
        type: 'item',
        url: '/reports/patients',
        icon: 'feather icon-bar-chart-2'
      },
      {
        id: 'doctor-reports',
        title: 'Doctor Reports',
        type: 'item',
        url: '/reports/doctors',
        icon: 'feather icon-trending-up'
      },
      {
        id: 'appointment-reports',
        title: 'Appointment Reports',
        type: 'item',
        url: '/reports/appointments',
        icon: 'feather icon-pie-chart'
      },
      {
        id: 'revenue-reports',
        title: 'Revenue Reports',
        type: 'item',
        url: '/reports/revenue',
        icon: 'feather icon-dollar-sign'
      }
    ]
  },

  {
    id: 'administration',
    title: 'Administration',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'user-management',
        title: 'User Management',
        type: 'collapse',
        icon: 'feather icon-users',
        children: [
          {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/admin/users',
            icon: 'feather icon-user'
          },
          {
            id: 'roles',
            title: 'Roles',
            type: 'item',
            url: '/admin/roles',
            icon: 'feather icon-shield'
          },
          {
            id: 'permissions',
            title: 'Permissions',
            type: 'item',
            url: '/admin/permissions',
            icon: 'feather icon-lock'
          }
        ]
      },
      {
        id: 'system-settings',
        title: 'System Settings',
        type: 'collapse',
        icon: 'feather icon-settings',
        children: [
          {
            id: 'general-settings',
            title: 'General Settings',
            type: 'item',
            url: '/admin/settings',
            icon: 'feather icon-sliders'
          },
          {
            id: 'email-settings',
            title: 'Email Settings',
            type: 'item',
            url: '/admin/email-settings',
            icon: 'feather icon-mail'
          },
          {
            id: 'notification-settings',
            title: 'Notification Settings',
            type: 'item',
            url: '/admin/notification-settings',
            icon: 'feather icon-bell'
          }
        ]
      },
      {
        id: 'backup-restore',
        title: 'Backup & Restore',
        type: 'collapse',
        icon: 'feather icon-database',
        children: [
          {
            id: 'database-backup',
            title: 'Database Backup',
            type: 'item',
            url: '/admin/backup',
            icon: 'feather icon-download'
          },
          {
            id: 'restore-data',
            title: 'Restore Data',
            type: 'item',
            url: '/admin/restore',
            icon: 'feather icon-upload'
          }
        ]
      }
    ]
  },

  {
    id: 'settings-component',
    title: 'Legacy Settings',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'userManager',
        title: 'User Manager',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'business',
            title: 'Business',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'user',
            title: 'User',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'role',
            title: 'Role',
            type: 'item',
            url: '/component/badges'
          },  
          {
            id: 'businessPermission',
            title: 'Business Permission',
            type: 'item',
            url: '/component/tabs-pills'
          },        
          {
            id: 'menuPermission',
            title: 'Menu Permission',
            type: 'item',
            url: '/component/collapse'
          }     
          
        ]
      }
    ]
  },

  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },
  {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Sign up',
        type: 'item',
        url: '/auth/signup',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Sign in',
        type: 'item',
        url: '/auth/signin',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },
  {
    id: 'forms & tables',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms',
        title: 'Basic Forms',
        type: 'item',
        url: '/forms',
        classes: 'nav-item',
        icon: 'feather icon-file-text'
      },
      {
        id: 'tables',
        title: 'tables',
        type: 'item',
        url: '/tables',
        classes: 'nav-item',
        icon: 'feather icon-server'
      }
    ]
  },
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }
];
