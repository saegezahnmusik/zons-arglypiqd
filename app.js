// ========================================
// POI KONFIGURATION
// ========================================
// Hier können Sie Ihre POIs definieren
// Koordinaten, Namen, Beschreibungen und USDZ-Datei-Pfade

const POIS = [
    {
        id: 1,
        name: "Brandenburger Tor",
        description: "Historisches Wahrzeichen Berlins",
        lat: 52.5163,
        lon: 13.3777,
        usdzPath: "ar-models/brandenburger-tor.usdz"
    },
    {
        id: 2,
        name: "Eiffelturm",
        description: "Pariser Wahrzeichen und Aussichtsturm",
        lat: 48.8584,
        lon: 2.2945,
        usdzPath: "ar-models/eiffelturm.usdz"
    },
    {
        id: 3,
        name: "Freiheitsstatue",
        description: "Symbol der Freiheit in New York",
        lat: 40.6892,
        lon: -74.0445,
        usdzPath: "ar-models/freiheitsstatue.usdz"
    },
    // Weitere POIs hier hinzufügen...
];

// ========================================
// KARTEN KONFIGURATION
// ========================================

const MAP_CONFIG = {
    // Initiale Karten-Ansicht (Zentrum von Deutschland)
    initialView: {
        lat: 51.1657,
        lon: 10.4515,
        zoom: 6
    },
    // Max und Min Zoom Level
    minZoom: 3,
    maxZoom: 18
};

// ========================================
// ANWENDUNGS-LOGIK
// ========================================

let map;
let markers = [];
let currentPOI = null;

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    addPOIMarkers();
    setupEventListeners();
    checkARSupport();
});

// Karte initialisieren
function initMap() {
    map = L.map('map', {
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom
    }).setView(
        [MAP_CONFIG.initialView.lat, MAP_CONFIG.initialView.lon],
        MAP_CONFIG.initialView.zoom
    );

    // OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
}

// POI Marker zur Karte hinzufügen
function addPOIMarkers() {
    POIS.forEach(poi => {
        // Custom Icon für POI
        const customIcon = L.divIcon({
            className: 'poi-marker',
            iconSize: [40, 40],
            html: `<div style="background-color: #007AFF; border: 3px solid white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
                    <span style="font-size: 20px;">📍</span>
                   </div>`
        });

        // Marker erstellen
        const marker = L.marker([poi.lat, poi.lon], {
            icon: customIcon,
            title: poi.name
        }).addTo(map);

        // Popup
        marker.bindPopup(`
            <div style="text-align: center;">
                <strong style="font-size: 16px; color: #333;">${poi.name}</strong><br>
                <span style="font-size: 12px; color: #666;">${poi.description}</span>
            </div>
        `);

        // Click Event
        marker.on('click', function() {
            showPOIInfo(poi);
        });

        markers.push({ marker, poi });
    });
}

// POI Info Panel anzeigen
function showPOIInfo(poi) {
    currentPOI = poi;

    document.getElementById('poi-name').textContent = poi.name;
    document.getElementById('poi-description').textContent = poi.description;

    // AR Button Link setzen
    const arButton = document.getElementById('ar-button');
    arButton.href = poi.usdzPath;

    // Info Panel anzeigen
    document.getElementById('info-panel').classList.remove('hidden');

    // Karte zu POI zentrieren
    map.setView([poi.lat, poi.lon], 15, {
        animate: true,
        duration: 1
    });
}

// Info Panel schließen
function closePOIInfo() {
    document.getElementById('info-panel').classList.add('hidden');
    currentPOI = null;
}

// Event Listeners einrichten
function setupEventListeners() {
    // Close Button
    document.getElementById('close-button').addEventListener('click', closePOIInfo);

    // AR Button - zeigt Loading Indicator
    document.getElementById('ar-button').addEventListener('click', function(e) {
        // Überprüfen, ob auf iOS Safari
        if (!isIOSSafari()) {
            e.preventDefault();
            alert('AR Quick Look wird nur auf iOS Safari unterstützt.');
            return;
        }

        // Loading Indicator anzeigen
        showLoading();

        // Loading nach 2 Sekunden ausblenden (AR wird geöffnet)
        setTimeout(() => {
            hideLoading();
        }, 2000);
    });
}

// Loading Indicator anzeigen
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

// Loading Indicator ausblenden
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// iOS Safari Detection
function isIOSSafari() {
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua);
    const webkit = /WebKit/.test(ua);
    const iOSSafari = iOS && webkit && !/CriOS|FxiOS|OPiOS|mercury/.test(ua);
    return iOSSafari;
}

// AR Support überprüfen
function checkARSupport() {
    if (!isIOSSafari()) {
        console.warn('Diese Anwendung funktioniert am besten auf iOS Safari mit AR Quick Look Support.');
    } else {
        console.log('AR Quick Look wird unterstützt!');
    }
}

// Utility: Nähere POIs finden (optional für spätere Features)
function findNearbyPOIs(lat, lon, radiusKm = 50) {
    return POIS.filter(poi => {
        const distance = calculateDistance(lat, lon, poi.lat, poi.lon);
        return distance <= radiusKm;
    }).sort((a, b) => {
        const distA = calculateDistance(lat, lon, a.lat, a.lon);
        const distB = calculateDistance(lat, lon, b.lat, b.lon);
        return distA - distB;
    });
}

// Distanz zwischen zwei Koordinaten berechnen (Haversine Formel)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Erdradius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(value) {
    return value * Math.PI / 180;
}

// Export für eventuelle Module (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POIS,
        findNearbyPOIs,
        calculateDistance
    };
}
