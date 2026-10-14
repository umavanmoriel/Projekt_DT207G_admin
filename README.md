# "Vaviorka" Restaurang Admin – Administrationsgränssnitt

Detta repository innehåller koden för ett administrationsgränssnitt till ett fiktivt restaurangföretag. Gränssnittet används av personal för att hantera restaurangens meny, bordsbokningar och kontaktmeddelanden från gäster.

Gränssnittet är en del av ett projektarbete i kursen Backend-baserad utveckling (DT207G) vid Mittuniversitetet.

## Länk

Videodemonstration

**Inloggningsuppgifter för admin:**
- Användarnamn: `admin`
- Lösenord: `adminadmin`

## Tekniker

- **HTML5** – struktur och semantik
- **CSS3** – styling och responsiv design
- **JavaScript (Vanilla)** – dynamik och API-anrop
- **Fetch API** – kommunikation med backend
- **localStorage** – lagring av JWT-token
- **Google Fonts** – Inter och Cormorant Garamond

## Funktioner

Administrationsgränssnittet innehåller följande funktioner:

- **Inloggning** med användarnamn och lösenord
- **Hantera meny** – lägg till, ändra och radera rätter
- **Hantera bordsbokningar** – visa, acceptera, avböj och ångra bokningar
- **Visa kontaktmeddelanden** – läsa meddelanden från gäster
- **Utloggning** – rensar JWT-token och skickar användaren till inloggningssidan

## Krav

- En fungerande REST-webbtjänst (backend) måste köras parallellt
- Backend-repot finns på: https://github.com/umavanmoriel/Projekt_DT207G_backend.git
- Webbläsare med stöd för ES6 (Chrome, Firefox, Edge, Safari)

## Installation och användning

1. Klona ner källkodsfilerna:
   ```bash
   git clone https://github.com/umavanmoriel/Projekt_DT207G_admin.git
   ```

2. Se till att backend-servern körs på `http://localhost:3000`

3. Öppna `pages/login.html` i webbläsaren

4. Logga in med - Användarnamn: `admin` - Lösenord: `adminadmin`

## Sidor

| Fil | Beskrivning | Skyddad |
|-----|-------------|---------|
| `login.html` | Inloggningssida för personal | Nej |
| `admin.html` | Hantera meny (lägg till, ändra, radera rätter) | Ja |
| `bookings.html` | Visa och hantera bordsbokningar | Ja |
| `messages.html` | Visa kontaktmeddelanden från gäster | Ja |

### Autentisering

| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| POST | `/api/login` | Logga in och få JWT-token |

### Rätter

| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| GET | `/api/dishes` | Hämta alla rätter |
| POST | `/api/dishes` | Lägg till en ny rätt |
| PUT | `/api/dishes/:id` | Uppdatera en rätt |
| DELETE | `/api/dishes/:id` | Radera en rätt |

### Bokningar

| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| GET | `/api/bookings` | Hämta alla bokningar |
| PUT | `/api/bookings/:id` | Uppdatera status (pending/confirmed/cancelled) |
| DELETE | `/api/bookings/:id` | Radera en bokning |

### Meddelanden

| Metod | Ändpunkt | Beskrivning |
|-------|----------|-------------|
| GET | `/api/messages` | Hämta alla meddelanden |

## Testning

Gränssnittet har testats i följande webbläsare:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

HTML och CSS har validerats via W3C:s valideringstjänster.


