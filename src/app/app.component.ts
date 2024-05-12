import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';
import { Observable, Subscriber } from 'rxjs';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeafletModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private trucks: string[] = ['truck1', 'truck2', 'truck3'];
  private map: any;
  constructor(private chatService:ChatService){}

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 18,
    center: L.latLng(24.0941352, 32.9010034),
  };

  ngOnInit(): void {
   
    this.loadMap(); 
    this.chatService.createChatConnection(852);
  }
  title = 'maps-test';
  lat = '24.0941352';
  lng = '32.9010034';
  apiKey = 'AIzaSyBDECD243cwC75JX2bpcB6iNtJJk_w2ywE';

  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
    }).addTo(this.map);

    this.getCurrentPosition().subscribe((position: any) => {
      this.map.flyTo([position.latitude, position.longitude], 18);
      const icon = L.icon({
        iconUrl: '../favicon.ico',
        shadowUrl: '../favicon.ico',
        popupAnchor: [18, 0],
      });
      this.trucks.forEach((tr, index) => {
        const icon = L.icon({
          iconUrl: '../favicon.ico',
          shadowUrl: '../favicon.ico',
          popupAnchor: [18, 0],
        });
        const marker = L.marker(
          [position.latitude + 1 * index, position.longitude + 1 * index],
          {
            icon,
          }
        ).bindPopup(tr);
        marker.addTo(this.map);
      });
    });
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          //observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  updatePositions() {}
}
