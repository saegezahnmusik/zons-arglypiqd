# AR Map POI Viewer

Eine einfache Web-Anwendung für iOS Safari, die Points of Interest (POIs) auf einer OpenStreetMap-Karte anzeigt und AR-Ansichten über AR Quick Look ermöglicht.

## 🎯 Features

- **OpenStreetMap Integration**: Interaktive Karte mit Leaflet.js
- **POI Marker**: Anzeige von Points of Interest auf der Karte
- **AR Quick Look**: Native iOS Safari AR-Integration mit USDZ-Dateien
- **Responsive Design**: Optimiert für iOS Safari Browser
- **Konfigurierbar**: Einfache Anpassung von POIs im Source Code

## 📋 Voraussetzungen

- iOS Gerät (iPhone/iPad) mit iOS 12 oder höher
- Safari Browser
- USDZ-Dateien für jeden POI

## 🚀 Installation

1. Projekt klonen oder herunterladen
2. USDZ-Dateien in den Ordner `ar-models/` legen
3. POIs in der Datei `app.js` konfigurieren
4. Auf einem Webserver hosten (z.B. GitHub Pages, Netlify, oder lokaler Server)

### Lokaler Test:

```bash
# Mit Python 3:
python3 -m http.server 8000

# Mit Node.js (http-server):
npx http-server
```

Dann im iOS Safari Browser die URL öffnen (z.B. `http://localhost:8000`)

## ⚙️ Konfiguration

### POIs hinzufügen/bearbeiten

Öffnen Sie `app.js` und bearbeiten Sie das `POIS` Array:

```javascript
const POIS = [
    {
        id: 1,
        name: "Mein POI Name",
        description: "Beschreibung des POIs",
        lat: 52.5163,           // Breitengrad
        lon: 13.3777,           // Längengrad
        usdzPath: "ar-models/mein-modell.usdz"  // Pfad zur USDZ-Datei
    },
    // Weitere POIs...
];
```

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
├── index.html          # Haupt-HTML-Datei
├── style.css           # Styling und Layout
├── app.js              # JavaScript Logik und POI-Konfiguration
├── ar-models/          # USDZ-Dateien Ordner
│   ├── .gitkeep
│   ├── brandenburger-tor.usdz
│   ├── eiffelturm.usdz
│   └── ...
└── README.md           # Diese Datei
```

## 🎨 USDZ-Dateien erstellen

### Parameter in USDZ-Dateien

Ihre USDZ-Dateien sollten bereits folgende Parameter enthalten:

- **Position**: Abstand zur Kamera (z-Achse)
- **Rotation**: Ausrichtung des Objekts (x, y, z Rotation)
- **Transparenz**: Opacity/Alpha-Wert für das Material

### Empfohlene Tools zum Erstellen/Bearbeiten:

1. **Reality Converter** (macOS) - Apple's offizielles Tool
2. **Blender** mit USD Export Plugin
3. **Cinema 4D** mit USD Export
4. **Maya** mit USD Export

### Beispiel USDZ-Struktur:

```python
# Beispiel: Python USD-Erstellung
from pxr import Usd, UsdGeom, Gf

# Stage erstellen
stage = Usd.Stage.CreateNew('beispiel.usdz')

# Plane für Bild erstellen
plane = UsdGeom.Mesh.Define(stage, '/Plane')

# Position setzen (2 Meter vor der Kamera)
xformable = UsdGeom.Xformable(plane)
xformable.AddTranslateOp().Set(Gf.Vec3f(0, 0, -2))

# Rotation setzen (0°, 0°, 0°)
xformable.AddRotateXYZOp().Set(Gf.Vec3f(0, 0, 0))

# Material mit Transparenz hinzufügen
# (Transparenz: 0.0 = durchsichtig, 1.0 = undurchsichtig)
material = UsdShade.Material.Define(stage, '/Material')
# ... Material-Setup mit opacity = 0.8
```

## 📱 Verwendung

1. **Webseite öffnen** in iOS Safari
2. **Karte erkunden** und POI-Marker finden
3. **POI-Marker antippen** um Details zu sehen
4. **"In AR ansehen" Button** drücken
5. **AR Quick Look** öffnet sich automatisch
6. **Platzieren** und **Betrachten** Sie das AR-Objekt

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

### AR funktioniert nicht

- ✅ Stellen Sie sicher, dass Sie iOS Safari verwenden
- ✅ iOS 12 oder höher erforderlich
- ✅ USDZ-Dateien müssen korrekt formatiert sein
- ✅ Überprüfen Sie die Dateipfade in `app.js`

### POIs werden nicht angezeigt

- ✅ Koordinaten überprüfen (lat/lon)
- ✅ Browser Console auf Fehler prüfen
- ✅ Zoom-Level anpassen

### USDZ-Dateien laden nicht

- ✅ Dateipfade in `app.js` überprüfen
- ✅ USDZ-Dateien müssen im `ar-models/` Ordner liegen
- ✅ Webserver muss USDZ MIME-Type unterstützen: `model/vnd.usdz+zip`

## 📚 Weiterführende Ressourcen

- [Apple AR Quick Look Dokumentation](https://developer.apple.com/augmented-reality/quick-look/)
- [Leaflet.js Dokumentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [USD/USDZ Format](https://graphics.pixar.com/usd/docs/index.html)
- [Reality Converter](https://developer.apple.com/augmented-reality/tools/)

## 📄 Lizenz

Frei verwendbar für private und kommerzielle Projekte.

## 🤝 Beitragen

Verbesserungsvorschläge und Pull Requests sind willkommen!

---

**Entwickelt für iOS Safari AR Quick Look**