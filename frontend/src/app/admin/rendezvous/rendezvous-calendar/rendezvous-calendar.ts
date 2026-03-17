import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { RendezVousService } from '../rendezvous.service';
import { RendezVous } from '../rendezvous.model';

@Component({
  selector: 'app-rendezvous-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './rendezvous-calendar.html',
  styleUrl: './rendezvous-calendar.css'
})
export class RendezVousCalendarComponent implements OnInit {

  private service = inject(RendezVousService)

  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialView: 'dayGridMonth',

    locale: 'fr',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    selectable: true,

    dateClick: this.handleDateClick.bind(this),

    eventClick: this.handleEventClick.bind(this),

    events: []
  }

  ngOnInit(): void {
    this.loadEvents()
  }

  loadEvents() {

    this.service.getAll().subscribe({

      next: (data: RendezVous[]) => {

        this.calendarOptions.events = data.map(rdv => ({

          id: rdv.id,

          title: rdv.lieu,

          start: rdv.date + 'T' + rdv.heure,

          color: '#bfa14a'

        }))

      },

      error: (err: unknown) => console.error(err)

    })

  }

  handleDateClick(info: any) {

    const lieu = prompt("Lieu du rendez-vous")

    if (!lieu) return

    const rdv: RendezVous = {

      date: info.dateStr,

      heure: "09:00",

      lieu: lieu,

      note: ""

    }

    this.service.create(rdv).subscribe({

      next: () => this.loadEvents(),

      error: (err: unknown) => console.error(err)

    })

  }

  handleEventClick(info: any) {

    const confirmDelete = confirm(
      "Supprimer ce rendez-vous ?"
    )

    if (!confirmDelete) return

    const id = info.event.id

    this.service.delete(id).subscribe({

      next: () => this.loadEvents(),

      error: (err: unknown) => console.error(err)

    })

  }

}