---
sidebar_position: 2
title: 'CLI-Tool verwenden'
description: 'Anleitung zur Installation, Ausführung und Verwaltung von ABC User Feedback mit dem CLI-Tool.'
---

# CLI-Tool verwenden

Das ABC User Feedback CLI (`auf-cli`) ist ein Kommandozeilen-Interface-Tool, das die Installation, Ausführung und Verwaltung von ABC User Feedback vereinfacht. Dieses Dokument führt Sie durch die schnelle und einfache Einrichtung von ABC User Feedback mit dem CLI-Tool.

## Einführung in das CLI-Tool

`auf-cli` bietet die folgenden Hauptfunktionen:

- Automatische Einrichtung der erforderlichen Infrastruktur (MySQL, SMTP, OpenSearch)
- Vereinfachte Konfiguration von Umgebungsvariablen
- Automatisiertes Starten/Stoppen von API- und Web-Servern
- Bereinigung von Volume-Daten

Der größte Vorteil dieses Tools ist, dass es direkt über `npx` ausgeführt werden kann, ohne zusätzliche Abhängigkeiten zu installieren oder Repositories zu klonen, solange Node.js und Docker installiert sind.

## Voraussetzungen

Bevor Sie das CLI-Tool verwenden, müssen Sie die folgenden Anforderungen erfüllen:

- [Node.js v22 oder höher](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## Grundlegende Befehle

### Initialisierung

Führen Sie den folgenden Befehl aus, um die für ABC User Feedback erforderliche Infrastruktur einzurichten:

```bash
npx auf-cli init
```

Dieser Befehl führt die folgenden Aufgaben aus:

1. Erstellt eine `config.toml`-Datei für die Konfiguration von Umgebungsvariablen.
2. Falls eine `config.toml`-Datei bereits existiert, verwenden Sie die Option `--force`, um sie zu überschreiben.

Nach Abschluss der Initialisierung wird eine `config.toml`-Datei erstellt. Sie können diese Datei bearbeiten, um Umgebungsvariablen nach Bedarf anzupassen.

### Server starten

Führen Sie den folgenden Befehl aus, um die API- und Web-Server zu starten:

```bash
npx auf-cli start
```

Dieser Befehl führt die folgenden Aufgaben aus:

1. Liest Umgebungsvariablen aus der `config.toml`-Datei.
2. Generiert eine Docker Compose-Datei und startet die Dienste.
3. Startet die API- und Web-Server-Container zusammen mit der erforderlichen Infrastruktur (MySQL, SMTP, OpenSearch falls aktiviert).

Sobald der Server erfolgreich gestartet ist, können Sie auf die ABC User Feedback Web-Oberfläche zugreifen, indem Sie in Ihrem Webbrowser zu `http://localhost:3000` (oder der konfigurierten URL) navigieren. Das CLI zeigt die verfügbaren URLs an, einschließlich:

- Web-Oberflächen-URL
- API-URL
- MySQL-Verbindungsstring
- OpenSearch-URL (falls aktiviert)
- SMTP-Web-Oberfläche (bei Verwendung von smtp4dev)

### Server stoppen

Führen Sie den folgenden Befehl aus, um die API- und Web-Server zu stoppen:

```bash
npx auf-cli stop
```

Dieser Befehl stoppt die laufenden API- und Web-Server-Container zusammen mit den Infrastruktur-Containern. Alle in Volumes gespeicherten Daten bleiben erhalten.

### Volume-Bereinigung

Führen Sie den folgenden Befehl aus, um die während des Starts erstellten Docker-Volumes zu bereinigen:

```bash
npx auf-cli clean
```

Dieser Befehl stoppt alle Container und löscht Docker-Volumes für MySQL, SMTP, OpenSearch usw. **Warnung**: Diese Operation löscht alle Daten. Stellen Sie daher sicher, dass Sie Ihre Daten vorher sichern, falls ein Backup erforderlich ist.

Sie können auch die Option `--images` verwenden, um ungenutzte Docker-Images zu bereinigen:

```bash
npx auf-cli clean --images
```

## Konfigurationsdatei (config.toml)

Wenn Sie den `init`-Befehl ausführen, wird eine `config.toml`-Datei im aktuellen Verzeichnis erstellt. Diese Datei wird zur Konfiguration von Umgebungsvariablen für ABC User Feedback verwendet.

Hier ist ein Beispiel der `config.toml`-Datei:

```toml
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username=
# password=
# tls=
# ciper_spec=
# opportunitic_tls=

# [api.opensearch]
# enabled = true

[mysql]
port = 13306
```

Sie können diese Datei nach Bedarf bearbeiten, um Umgebungsvariablen anzupassen. Detaillierte Informationen zu Umgebungsvariablen finden Sie in der Dokumentation zur [Umgebungsvariablen-Konfiguration](./04-configuration.md).

## Erweiterte Verwendung

### Ports ändern

Standardmäßig verwendet der Web-Server Port 3000 und der API-Server Port 4000. Um diese zu ändern, modifizieren Sie die folgenden Einstellungen in der `config.toml`-Datei:

```toml
[web]
port = 8000  # Web-Server-Port ändern
api_base_url = "http://localhost:8080"  # API-URL muss ebenfalls geändert werden

[api]
port = 8080  # API-Server-Port ändern

[mysql]
port = 13307  # MySQL-Port bei Bedarf ändern
```

### Benutzerdefinierte Docker Compose-Datei

Das CLI-Tool generiert und verwendet intern eine Docker Compose-Datei. Um die generierte Docker Compose-Datei anzuzeigen, überprüfen Sie die `docker-compose.yml`-Datei im aktuellen Verzeichnis nach der Ausführung des `start`-Befehls.

Sie können diese Datei direkt modifizieren, um zusätzliche Konfigurationen anzuwenden, aber beachten Sie, dass Änderungen überschrieben werden können, wenn Sie den `auf-cli start`-Befehl erneut ausführen.

## Fehlerbehebung

### Häufige Probleme

1. **Docker-bezogene Fehler**:

   - Stellen Sie sicher, dass Docker läuft.
   - Überprüfen Sie, ob Sie Berechtigungen zum Ausführen von Docker-Befehlen haben.

2. **Port-Konflikte**:

   - Überprüfen Sie, ob die Ports 3000, 4000, 13306, 9200, 5080 usw. von anderen Anwendungen verwendet werden.
   - Ändern Sie die Port-Einstellungen in der `config.toml`-Datei.

3. **Speichermangel**:
   - Erhöhen Sie den Docker zugewiesenen Speicher.
   - OpenSearch benötigt mindestens 2GB Speicher.

## Einschränkungen

Das CLI-Tool eignet sich für die Verwendung in Entwicklungs- und Testumgebungen. Für Produktionsumgebungen sollten Sie folgende Punkte beachten:

1. Richten Sie Umgebungsvariablen direkt ein und verwalten Sie sie für erhöhte Sicherheit.
2. Verwenden Sie Orchestrierungstools wie Kubernetes oder Docker Swarm für hohe Verfügbarkeit und Skalierbarkeit.
3. Implementieren Sie Datenpersistenz- und Backup-Strategien.

## Nächste Schritte

Wenn Sie ABC User Feedback erfolgreich mit dem CLI-Tool installiert haben, fahren Sie mit dem [Tutorial](../03-tutorial.md) fort, um das System zu konfigurieren und Benutzer hinzuzufügen.

Für detaillierte API- und Web-Server-Konfigurationsoptionen lesen Sie die Dokumentation zur [Umgebungsvariablen-Konfiguration](./04-configuration.md).
