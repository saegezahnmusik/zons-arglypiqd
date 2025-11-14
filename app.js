// ========================================
// POI KONFIGURATION
// ========================================
// Hier können Sie Ihre POIs definieren
// Koordinaten, Namen, Beschreibungen und Bild-Pfade

const POIS = [
    {
        id: 1,
        name: "Brandenburger Tor",
        description: "Historisches Wahrzeichen Berlins",
        lat: 52.5163,
        lon: 13.3777,
        // Bild-Konfiguration für AR
        // HINWEIS: Fügen Sie hier Ihre eigenen Bilder ein!
        // Beispiel: imagePath: "ar-models/brandenburger-tor.jpg"
        imagePath: "https://via.placeholder.com/512/0066FF/FFFFFF?text=Brandenburg+Gate",
        scale: 10,              // Skalierung des Bildes in AR
        rotation: 0,            // Rotation in Grad (0-360)
        opacity: 0.9            // Transparenz (0.0 - 1.0)
    },
    {
        id: 2,
        name: "Eiffelturm",
        description: "Pariser Wahrzeichen und Aussichtsturm",
        lat: 48.8584,
        lon: 2.2945,
        imagePath: "https://via.placeholder.com/512/FF6600/FFFFFF?text=Eiffel+Tower",
        scale: 10,
        rotation: 0,
        opacity: 0.9
    },
    {
        id: 3,
        name: "Freiheitsstatue",
        description: "Symbol der Freiheit in New York",
        lat: 40.6892,
        lon: -74.0445,
        imagePath: "https://via.placeholder.com/512/00CC66/FFFFFF?text=Statue+of+Liberty",
        scale: 10,
        rotation: 0,
        opacity: 0.9
    },
    // Weitere POIs hier hinzufügen...
    // WICHTIG: Ersetzen Sie die Platzhalter-URLs durch Ihre eigenen Bilder!
    // Entweder:
    // 1. Lokale Bilder: imagePath: "ar-models/mein-bild.jpg"
    // 2. Online Bilder: imagePath: "https://example.com/bild.jpg"
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
// GLOBALE VARIABLEN
// ========================================

let map;
let markers = [];
let currentPOI = null;
let userPosition = null;
let arScene = null;
let arCamera = null;
let watchId = null;

// View States
const VIEW_STATE = {
    MAP: 'map',
    AR: 'ar'
};
let currentView = VIEW_STATE.MAP;

// ========================================
// INITIALISIERUNG
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== AR Map POI Viewer Starting ===');
    console.log('DOMContentLoaded event fired');

    try {
        initMap();
        console.log('✓ Map initialized');

        addPOIMarkers();
        console.log('✓ POI markers added');

        setupEventListeners();
        console.log('✓ Event listeners set up');

        requestLocationPermission();
        console.log('✓ Location permission requested');

        console.log('=== Initialization complete ===');
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Fehler beim Initialisieren der Anwendung: ' + error.message);
    }
});

// ========================================
// KARTEN-FUNKTIONEN
// ========================================

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

    // Distanz berechnen und anzeigen
    if (userPosition) {
        const distance = calculateDistance(
            userPosition.lat,
            userPosition.lon,
            poi.lat,
            poi.lon
        );
        document.getElementById('distance-info').textContent =
            `Entfernung: ${distance.toFixed(2)} km`;
    } else {
        document.getElementById('distance-info').textContent =
            'GPS-Position wird ermittelt...';
    }

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

// ========================================
// AR-FUNKTIONEN
// ========================================

// AR-Ansicht initialisieren
function initARView() {
    console.log('initARView called');

    if (currentView === VIEW_STATE.AR) {
        console.log('AR View already active');
        return;
    }

    if (!currentPOI) {
        console.log('No POI selected');
        return;
    }

    console.log('Starting AR View for POI:', currentPOI.name);
    showLoading('AR wird initialisiert...');

    // Views wechseln
    currentView = VIEW_STATE.AR;
    document.getElementById('map-container').classList.add('hidden');
    document.getElementById('ar-container').classList.remove('hidden');

    // AR Scene Referenz
    arScene = document.getElementById('ar-scene');
    console.log('AR Scene element:', arScene);

    // Warte auf A-Frame Initialisierung
    if (arScene.hasLoaded) {
        console.log('A-Frame already loaded, setting up AR scene');
        setupARScene();
    } else {
        console.log('Waiting for A-Frame to load...');
        arScene.addEventListener('loaded', function() {
            console.log('A-Frame loaded event fired');
            setupARScene();
        });

        // Timeout falls A-Frame nicht lädt
        setTimeout(() => {
            if (!arScene.hasLoaded) {
                console.warn('A-Frame loading timeout - forcing setup');
                setupARScene();
            }
        }, 5000);
    }
}

// AR Scene konfigurieren
function setupARScene() {
    console.log('setupARScene called');
    hideLoading();

    // Status aktualisieren
    updateARStatus('AR aktiv - Schauen Sie sich um!');

    // Kamera-Berechtigung anfordern
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        console.log('Requesting camera permission...');
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                console.log('Camera permission granted');
                stream.getTracks().forEach(track => track.stop()); // Stop stream immediately

                // Alle POIs als AR Entities hinzufügen
                addAREntities();

                // GPS Tracking starten
                startGPSTracking();
            })
            .catch(error => {
                console.error('Camera permission denied:', error);
                alert('Kamera-Zugriff erforderlich für AR. Bitte erteilen Sie die Berechtigung.');
                exitARView();
            });
    } else {
        console.log('getUserMedia not supported, proceeding anyway');
        // Alle POIs als AR Entities hinzufügen
        addAREntities();

        // GPS Tracking starten
        startGPSTracking();
    }
}

// AR Entities für alle POIs hinzufügen
function addAREntities() {
    console.log('addAREntities called');
    const entitiesContainer = document.getElementById('poi-entities');

    if (!entitiesContainer) {
        console.error('POI entities container not found!');
        return;
    }

    // Clear existing entities
    entitiesContainer.innerHTML = '';
    console.log('Adding', POIS.length, 'POIs to AR scene');

    POIS.forEach((poi, index) => {
        console.log(`Adding POI ${index + 1}:`, poi.name, 'at', poi.lat, poi.lon);

        // Erstelle eine Plane für das Bild
        const entity = document.createElement('a-entity');

        // GPS Position setzen
        entity.setAttribute('gps-projected-entity-place', `latitude: ${poi.lat}; longitude: ${poi.lon}`);

        // Plane mit Bild erstellen
        const plane = document.createElement('a-plane');
        plane.setAttribute('src', poi.imagePath);
        plane.setAttribute('width', poi.scale);
        plane.setAttribute('height', poi.scale);
        plane.setAttribute('rotation', `0 ${poi.rotation} 0`);
        plane.setAttribute('material', `opacity: ${poi.opacity}; transparent: true; side: double`);

        // Text Label hinzufügen
        const text = document.createElement('a-text');
        text.setAttribute('value', poi.name);
        text.setAttribute('align', 'center');
        text.setAttribute('color', '#FFF');
        text.setAttribute('width', poi.scale * 2);
        text.setAttribute('position', `0 ${poi.scale/2 + 1} 0`);
        text.setAttribute('background', '#000');
        text.setAttribute('opacity', 0.7);

        entity.appendChild(plane);
        entity.appendChild(text);
        entitiesContainer.appendChild(entity);

        console.log(`POI ${poi.name} entity added to scene`);
    });

    console.log(`✓ ${POIS.length} AR Entities hinzugefügt`);
}

// GPS Tracking starten
function startGPSTracking() {
    if (watchId !== null) return; // Bereits aktiv

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            userPosition = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                accuracy: position.coords.accuracy
            };

            updateGPSStatus(
                `GPS: ${userPosition.lat.toFixed(6)}, ${userPosition.lon.toFixed(6)}\n` +
                `Genauigkeit: ${userPosition.accuracy.toFixed(1)}m`
            );
        },
        (error) => {
            console.error('GPS Error:', error);
            updateGPSStatus(`GPS Fehler: ${error.message}`);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000
        }
    );
}

// GPS Tracking stoppen
function stopGPSTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

// AR-Ansicht verlassen
function exitARView() {
    console.log('exitARView called');

    if (currentView !== VIEW_STATE.AR) {
        console.log('Not in AR view, nothing to do');
        return;
    }

    console.log('Exiting AR view');
    stopGPSTracking();

    // Views wechseln
    currentView = VIEW_STATE.MAP;
    document.getElementById('ar-container').classList.add('hidden');
    document.getElementById('map-container').classList.remove('hidden');

    // AR Scene pausieren
    if (arScene) {
        arScene.pause();
        console.log('AR scene paused');
    }

    console.log('✓ Returned to map view');
}

// ========================================
// EVENT LISTENERS
// ========================================

function setupEventListeners() {
    console.log('Setting up event listeners');

    // Close Button
    const closeButton = document.getElementById('close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closePOIInfo);
        console.log('Close button listener added');
    }

    // AR Button
    const arButton = document.getElementById('ar-button');
    if (arButton) {
        arButton.addEventListener('click', function() {
            console.log('AR Button clicked!');
            if (!currentPOI) {
                console.warn('No POI selected');
                alert('Bitte wählen Sie einen POI aus.');
                return;
            }

            console.log('Closing POI info and starting AR for:', currentPOI.name);
            closePOIInfo();

            // Kleine Verzögerung um UI-Transition zu erlauben
            setTimeout(() => {
                initARView();
            }, 100);
        });
        console.log('AR button listener added');
    } else {
        console.error('AR button not found!');
    }

    // Back to Map Button
    const backButton = document.getElementById('back-to-map');
    if (backButton) {
        backButton.addEventListener('click', exitARView);
        console.log('Back to map button listener added');
    }

    console.log('✓ All event listeners set up');
}

// ========================================
// GPS & PERMISSIONS
// ========================================

function requestLocationPermission() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userPosition = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };

                console.log('GPS Position erhalten:', userPosition);

                // Karte zur User-Position zentrieren
                map.setView([userPosition.lat, userPosition.lon], 12);

                // User Marker hinzufügen
                L.marker([userPosition.lat, userPosition.lon], {
                    icon: L.divIcon({
                        className: 'user-marker',
                        html: '<div style="background-color: #00C853; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px;"></div>',
                        iconSize: [20, 20]
                    })
                }).addTo(map).bindPopup('Ihr Standort');
            },
            (error) => {
                console.warn('GPS Fehler:', error);
                alert('GPS-Zugriff verweigert. AR-Funktionen sind eingeschränkt.');
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        alert('Ihr Gerät unterstützt keine Geolocation.');
    }
}

// ========================================
// UI UPDATES
// ========================================

function showLoading(text = 'Lädt...') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function updateARStatus(text) {
    document.getElementById('ar-status').textContent = text;
}

function updateGPSStatus(text) {
    document.getElementById('gps-status').textContent = text;
}

// ========================================
// UTILITY FUNKTIONEN
// ========================================

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

// Nähere POIs finden (optional für spätere Features)
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

// Export für eventuelle Module (optional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        POIS,
        findNearbyPOIs,
        calculateDistance
    };
}
