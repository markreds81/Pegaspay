# Pegaspay

**Pegaspay** è una piattaforma API-based per la gestione dei pagamenti tra utenti, sviluppata come progetto di tesi per il corso di laurea in Informatica per le Aziende Digitali presso l'Università Telematica Pegaso.

Il sistema consente agli utenti di ricaricare il proprio conto tramite codici prepagati, trasferire denaro tra conti personali e richiedere il prelievo dei fondi tramite bonifico bancario. L'architettura si basa su microservizi containerizzati, con autenticazione gestita da Keycloak.

---

## 🚀 Funzionalità principali

- 🔐 Autenticazione utente con Keycloak
- 💳 Ricarica conto con codici riscattabili
- 🔄 Trasferimento fondi tra utenti
- 🏦 Richiesta di prelievo tramite bonifico
- 📈 Dashboard utente con storico movimenti
- ⚙️ API RESTful documentate (Swagger/OpenAPI)

---

## 🧱 Architettura

```
Frontend (React) ←→ Backend API (Spring Boot)
                          ↑
               PostgreSQL + Keycloak
                          ↑
                 Docker Compose
```

---

## 🧪 Tecnologie utilizzate

| Componente     | Stack                         |
|----------------|-------------------------------|
| Frontend       | React, TypeScript, Vite       |
| Backend        | Spring Boot, Java 17+, JPA    |
| Autenticazione | Keycloak                      |
| Database       | PostgreSQL                    |
| Orchestrazione | Docker + Docker Compose       |
| Documentazione | Swagger/OpenAPI               |

---

## 📦 Struttura del progetto

```
pegaspay/
├── backend/            # Microservizi Spring Boot
├── frontend/           # Interfaccia React
├── docker-compose.yml  # Orchestrazione ambiente
└── README.md
```

---

## ▶️ Avvio del progetto

### Requisiti
- Docker e Docker Compose
- JDK 17+
- Node.js 18+

### Avvio ambiente completo
```bash
docker compose up --build
```

### Accesso Keycloak (default)
- URL: http://localhost:8080
- Admin: `admin`
- Password: `admin`

### Avvio frontend in sviluppo
```bash
cd frontend
npm install
npm run dev
```

### Avvio backend in sviluppo
```bash
cd backend
./gradlew bootRun
```

---

## 📝 Stato del progetto

🔧 In sviluppo — progetto realizzato per la tesi di laurea.  
Contiene funzionalità base ma architettura estensibile.

---

## 👨‍🎓 Autore

Marco Rossi  
Studente del corso di laurea in Informatica per le Aziende Digitali  
[Università Telematica Pegaso](https://www.unipegaso.it)

---

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT.
