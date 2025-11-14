# Beispielbilder für AR POIs

Dieser Ordner enthält die Bilder für Ihre AR POIs.

## 📸 Eigene Bilder hinzufügen:

1. **Legen Sie Ihre Bilder hier ab:**
   - Kopieren Sie JPG oder PNG Dateien in diesen Ordner
   - Empfohlene Auflösung: 1024x1024 oder 2048x2048 px

2. **Aktualisieren Sie app.js:**
   ```javascript
   imagePath: "ar-models/mein-bild.jpg"
   ```

## 🎨 Bildanforderungen:

- **Format**: JPG, PNG
- **Größe**: 512x512 bis 2048x2048 px (quadratisch empfohlen)
- **Dateigröße**: < 5 MB pro Bild
- **Transparenz**: PNG mit Alpha-Kanal wird unterstützt

## 💡 Beispiel:

```
ar-models/
├── berlin-monument.jpg
├── paris-tower.jpg
└── newyork-statue.jpg
```

Dann in `app.js`:
```javascript
{
    name: "Berlin Monument",
    imagePath: "ar-models/berlin-monument.jpg",
    // ... weitere Parameter
}
```

## 🌐 Online-Bilder verwenden:

Sie können auch direkt auf Online-Bilder verlinken:
```javascript
imagePath: "https://example.com/bild.jpg"
```

**Hinweis**: Achten Sie auf CORS-Header bei externen Bildern!
