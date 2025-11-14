# AR Map POI Viewer

Eine GPS-basierte Web-AR-Anwendung, die Points of Interest (POIs) auf einer OpenStreetMap-Karte anzeigt und diese an vordefinierten GPS-Positionen in Augmented Reality platziert.

## 🎯 Features

- **OpenStreetMap Integration**: Interaktive Karte mit Leaflet.js
- **POI Marker**: Anzeige von Points of Interest auf der Karte
- **Geolocated AR**: GPS-basierte AR mit AR.js - Objekte erscheinen automatisch an ihren realen GPS-Koordinaten
- **Echtzeit GPS Tracking**: Kontinuierliche Positionsüberwachung während der AR-Sitzung
- **Responsive Design**: Optimiert für mobile Browser (iOS Safari, Android Chrome)
- **Konfigurierbar**: Einfache Anpassung von POIs, Position, Rotation und Transparenz im Source Code

## 📋 Voraussetzungen

- Smartphone mit GPS und Kompass (iPhone, Android)
- Moderner Browser (iOS Safari 11+, Android Chrome 81+)
- Kamera- und GPS-Berechtigungen
- Bilder (JPG/PNG) oder USDZ-Dateien für jeden POI
- HTTPS-Verbindung (erforderlich für Geolocation und Kamera-Zugriff)

## 🚀 Installation

1. Projekt klonen oder herunterladen
2. Bilder (JPG/PNG) in den Ordner `ar-models/` legen
3. POIs in der Datei `app.js` konfigurieren
4. Auf einem HTTPS-Webserver hosten (erforderlich für GPS & Kamera)

### Hosting-Optionen:

**Empfohlen (mit HTTPS):**
- GitHub Pages (automatisch HTTPS)
- Netlify (automatisch HTTPS)
- Vercel (automatisch HTTPS)

**Lokaler Test mit HTTPS:**

```bash
# Mit Python 3 und OpenSSL:
# 1. SSL Zertifikat erstellen (einmalig)
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

# 2. HTTPS Server starten
python3 -m http.server 8000

# 3. Dann Tunnel-Service verwenden (z.B. ngrok)
npx ngrok http 8000
```

**Für Produktion:**
- Deploy auf GitHub Pages, Netlify oder ähnlichem Service
- Dann auf dem Smartphone im Browser öffnen

## ⚙️ Konfiguration

### POIs hinzufügen/bearbeiten

Öffnen Sie `app.js` und bearbeiten Sie das `POIS` Array:

```javascript
const POIS = [
    {
        id: 1,
        name: "Mein POI Name",
        description: "Beschreibung des POIs",
        lat: 52.5163,                      // Breitengrad (GPS-Koordinate)
        lon: 13.3777,                      // Längengrad (GPS-Koordinate)
        imagePath: "ar-models/bild.jpg",   // Pfad zum Bild
        scale: 10,                         // Größe in AR (Meter)
        rotation: 0,                       // Rotation in Grad (0-360)
        opacity: 0.9                       // Transparenz (0.0 - 1.0)
    },
    // Weitere POIs...
];
```

**Parameter-Erklärung:**
- `lat`, `lon`: GPS-Koordinaten, wo das Bild in AR erscheinen soll
- `imagePath`: Pfad zum Bild (JPG, PNG) - wird als Plane in AR angezeigt
- `scale`: Größe des Bildes in Metern (z.B. 10 = 10x10 Meter)
- `rotation`: Y-Achsen Rotation in Grad (0° = Norden)
- `opacity`: Transparenz des Bildes (0.0 = unsichtbar, 1.0 = undurchsichtig)

### Karten-Einstellungen anpassen

```javascript
const MAP_CONFIG = {
    initialView: {
        lat: 51.1657,    // Initiale Breite
        lon: 10.4515,    // Initiale Länge
        zoom: 6          // Zoom-Level (1-18)
    },
    minZoom: 3,
    maxZoom: 18
};
```

## 📁 Projektstruktur

```
zons-arglypiqd/
├── index.html          # Haupt-HTML mit Leaflet und AR.js Integration
├── style.css           # Styling für Karte und AR-Ansicht
├── app.js              # JavaScript: POI-Konfiguration, Karte, GPS-AR-Logik
├── ar-models/          # Bilder/Assets für AR-Objekte
│   ├── .gitkeep
│   ├── brandenburger-tor.jpg
│   ├── eiffelturm.jpg
│   └── ...
└── README.md           # Diese Datei
```

## 🌍 Wie Geolocated AR funktioniert

### GPS-basierte Platzierung

Die Anwendung verwendet **AR.js** mit **A-Frame** für GPS-basiertes AR:

1. **GPS-Position erfassen**: Die App ermittelt Ihre aktuelle GPS-Position
2. **POI-Koordinaten**: Jeder POI hat vordefinierte GPS-Koordinaten (lat/lon)
3. **Automatische Platzierung**: AR-Objekte erscheinen automatisch an ihren GPS-Koordinaten
4. **Echtzeit-Tracking**: Während Sie sich bewegen, aktualisiert sich die AR-Ansicht

### Wichtige Hinweise:

- **Genauigkeit**: GPS-Genauigkeit beträgt typisch 5-20 Meter
- **Best Practices**:
  - Verwenden Sie die App im Freien für bessere GPS-Signale
  - Halten Sie das Gerät stabil für besseres Tracking
  - Kalibrieren Sie den Kompass bei Bedarf
- **Reichweite**: AR-Objekte sind sichtbar bis ca. 1-2 km Entfernung

### Bilder vorbereiten:

**Empfohlene Bildformate:**
- JPG oder PNG
- Auflösung: 1024x1024 oder 2048x2048 px
- Transparenz: PNG mit Alpha-Kanal für durchsichtige Bereiche

**Bild-Orientierung:**
- Bilder werden als vertikale Planes (Ebenen) im 3D-Raum platziert
- `rotation` Parameter steuert die Ausrichtung (0° = Norden)
- `scale` Parameter definiert die Größe in Metern

## 📱 Verwendung

### Schritt-für-Schritt Anleitung:

1. **Webseite öffnen** auf Ihrem Smartphone (HTTPS erforderlich)
2. **Berechtigungen erteilen**:
   - GPS-Zugriff erlauben
   - Kamera-Zugriff erlauben (für AR)
3. **Karte erkunden**:
   - Ihre aktuelle Position wird als grüner Punkt angezeigt
   - POI-Marker sind als blaue Pins sichtbar
   - Antippen für Details und Distanz-Anzeige
4. **AR starten**:
   - Wählen Sie einen POI aus
   - Drücken Sie "In AR ansehen"
5. **AR-Ansicht**:
   - **Physisch zum POI bewegen**: Die AR-Objekte erscheinen nur an ihren GPS-Koordinaten
   - **Kamera bewegen**: Schauen Sie sich um, um POIs zu finden
   - **GPS-Status**: Oben rechts sehen Sie Ihre aktuelle Position
   - **Zurück zur Karte**: Button oben links

### Tipps für beste Ergebnisse:

- 🌤️ **Im Freien verwenden** für bessere GPS-Genauigkeit
- 🧭 **Kompass kalibrieren** durch Bewegen des Geräts in einer 8-Form
- 📍 **In der Nähe eines POI sein** (< 100m) für beste Sichtbarkeit
- 🔋 **Batterie beachten** - GPS und AR verbrauchen Energie

## 🛠️ Anpassungen

### Marker-Design ändern

In `app.js` im `addPOIMarkers()` function:

```javascript
const customIcon = L.divIcon({
    className: 'poi-marker',
    iconSize: [40, 40],
    html: `<div style="background-color: #FF0000;">...</div>`
});
```

### UI-Farben anpassen

In `style.css`:

```css
.ar-button {
    background: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
}

.poi-marker {
    background-color: #YOUR_MARKER_COLOR;
}
```

## 🔍 Fehlerbehebung

### AR-Kamera startet nicht

- ✅ **HTTPS verwenden**: Kamera-Zugriff erfordert HTTPS
- ✅ **Berechtigungen**: Kamera-Zugriff in Browser-Einstellungen erlauben
- ✅ **Browser-Support**: Verwenden Sie iOS Safari 11+ oder Android Chrome 81+
- ✅ **Andere Apps schließen**: Kamera darf nicht von anderer App verwendet werden

### GPS funktioniert nicht / ungenau

- ✅ **GPS-Berechtigung**: Standort-Zugriff in Browser erlauben
- ✅ **Im Freien**: GPS-Signal ist in Gebäuden schwach
- ✅ **Kompass kalibrieren**: Gerät in 8-Form bewegen
- ✅ **Warten**: GPS benötigt 30-60 Sekunden für genaue Position

### AR-Objekte nicht sichtbar

- ✅ **Distanz prüfen**: Zu weit vom POI entfernt (>1km)
- ✅ **Kamera bewegen**: Um sich schauen - Objekt könnte hinter Ihnen sein
- ✅ **GPS-Genauigkeit**: Warten bis GPS < 20m Genauigkeit hat
- ✅ **Bildpfad prüfen**: Überprüfen Sie `imagePath` in `app.js`

### POIs werden auf Karte nicht angezeigt

- ✅ **Koordinaten**: Lat/Lon korrekt? (lat: -90 bis 90, lon: -180 bis 180)
- ✅ **Browser Console**: F12 öffnen und Fehlermeldungen prüfen
- ✅ **Zoom**: Karten-Zoom anpassen

### Bilder laden nicht

- ✅ **Dateipfad**: Pfad in `app.js` korrekt? (relativ zum HTML)
- ✅ **Datei existiert**: Prüfen Sie `ar-models/` Ordner
- ✅ **CORS**: Bei externen Bildern CORS-Header beachten
- ✅ **Dateiformat**: JPG oder PNG verwenden

## 📚 Weiterführende Ressourcen

- [AR.js Dokumentation](https://ar-js-org.github.io/AR.js-Docs/)
- [A-Frame Dokumentation](https://aframe.io/docs/)
- [Leaflet.js Dokumentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [AR.js Location-Based Tutorial](https://ar-js-org.github.io/AR.js-Docs/location-based/)
- [Geolocation API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)

## 🎯 Use Cases

Diese AR Map Anwendung eignet sich für:

- **Tourismus**: Historische Informationen an Sehenswürdigkeiten
- **Stadtführungen**: Virtuelle Touren mit GPS-basierten Inhalten
- **Bildung**: Interaktive Lernstationen an spezifischen Orten
- **Events**: Schnitzeljagden, Geocaching-artige Spiele
- **Museen**: Outdoor-Ausstellungen mit AR-Erweiterungen
- **Immobilien**: Visualisierung geplanter Gebäude am Standort

## 📄 Lizenz

Frei verwendbar für private und kommerzielle Projekte.

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

---

**GPS-basiertes Web-AR mit AR.js & A-Frame**