import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { RendezVousService } from './rendezvous.service';
import { RendezVousItem } from './rendezvous.model';

@Component({
  selector: 'app-rendezvous',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './rendezvous.html',
  styleUrl: './rendezvous.css'
})
export class RendezVousComponent implements OnInit {
  private rendezVousService = inject(RendezVousService);
  private platformId = inject(PLATFORM_ID);
  private ctr = inject(ChangeDetectorRef);

  rendezVousList: RendezVousItem[] = [];
  upcomingAppointments: RendezVousItem[] = [];

  isLoading = true;
  errorMessage = '';
  isDialogOpen = false;
  selectedEvent: RendezVousItem | null = null;

  newAppointment = {
    clientId: null as number | null,
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    notes: '',
    status: 'PLANIFIE',
    affaireId: null as number | null
  };

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour'
    },
    selectable: true,
    editable: false,
    events: [],
    select: (arg) => this.handleDateSelect(arg),
    eventClick: (arg) => this.handleEventClick(arg),
    height: 650
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadData();
    } else {
      this.isLoading = false;
      this.ctr.detectChanges();
    }
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.rendezVousService.getAll().subscribe({
      next: (data) => {
        this.rendezVousList = data;
        this.calendarOptions = {
          ...this.calendarOptions,
          events: this.mapToCalendarEvents(data)
        };
        this.loadUpcoming();
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les rendez-vous.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  loadUpcoming(): void {
    this.rendezVousService.getUpcoming().subscribe({
      next: (data) => {
        this.upcomingAppointments = data;
        this.isLoading = false;
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de charger les prochains rendez-vous.';
        this.isLoading = false;
        this.ctr.detectChanges();
      }
    });
  }

  mapToCalendarEvents(data: RendezVousItem[]) {
  return data.map((item) => {
    let backgroundColor = '#6b7280';

    if (item.type === 'Consultation') backgroundColor = '#3b82f6';
    if (item.type === 'Signature') backgroundColor = '#10b981';
    if (item.type === 'Audience') backgroundColor = '#f59e0b';
    if (item.type === 'Suivi') backgroundColor = '#8b5cf6';

    return {
      id: String(item.id),
      title: item.title || `${item.type} - ${item.client}`,
      start: `${item.date}T${item.startTime}`,
      end: `${item.date}T${item.endTime}`,
      backgroundColor,
      borderColor: backgroundColor,
      textColor: '#ffffff',
      extendedProps: {
        rendezVous: item
      }
    };
  });

}

  handleDateSelect(selectInfo: DateSelectArg): void {
    const selectedDate = selectInfo.startStr.slice(0, 10);

    this.newAppointment = {
      clientId: null,
      type: '',
      date: selectedDate,
      startTime: '',
      endTime: '',
      location: '',
      notes: '',
      status: 'PLANIFIE',
      affaireId: null
    };

    this.isDialogOpen = true;
  }

  handleEventClick(clickInfo: EventClickArg): void {
    this.selectedEvent = clickInfo.event.extendedProps['rendezVous'] as RendezVousItem;
    this.ctr.detectChanges();
  }

  openCreateDialog(): void {
    this.isDialogOpen = true;
    this.ctr.detectChanges();
  }

  closeDialog(): void {
    this.isDialogOpen = false;
    this.resetForm();
    this.ctr.detectChanges();
  }

  closeDetails(): void {
    this.selectedEvent = null;
    this.ctr.detectChanges();
  }

  createAppointment(): void {
    if (
      !this.newAppointment.clientId ||
      !this.newAppointment.type ||
      !this.newAppointment.date ||
      !this.newAppointment.startTime ||
      !this.newAppointment.endTime
    ) {
      this.errorMessage = 'Veuillez remplir les champs obligatoires.';
      this.ctr.detectChanges();
      return;
    }

    this.rendezVousService.create(this.newAppointment).subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
        this.ctr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de créer le rendez-vous.';
        this.ctr.detectChanges();
      }
    });
  }

  deleteAppointment(id: number): void {
    this.rendezVousService.delete(id).subscribe({
      next: () => {
        this.selectedEvent = null;
        this.loadData();
        this.ctr.detectChanges();

      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Impossible de supprimer le rendez-vous.';
        this.ctr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.newAppointment = {
      clientId: null,
      type: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      notes: '',
      status: 'PLANIFIE',
      affaireId: null
    };
  }
}