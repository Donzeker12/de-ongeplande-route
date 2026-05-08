# 🌿 De Ongeplande Route

**Geen plan. Wel verhalen.**

Een warm, menselijk platform voor familie-uitjes met een krachtig maar simpel CMS systeem. Dit is geen gewone blog - het's een digitaal reisdagboek waar jullie echte ervaringen centraal staan.

## ✨ Wat maakt dit bijzonder?

- **Menselijk & Persoonlijk** - Jullie verhalen staan voorop
- **Ontdekkaartjes** - Unieke dieren, plekken en weetjes bij elk uitje
- **Rustige Interface** - Overzichtelijk, niet schreeuwerig
- **Krachtig CMS** - Volledig admin systeem met TipTap editor
- **Mobiel Vriendelijk** - Responsive design voor alle apparaten
- **Veilig** - Laravel Breeze authenticatie met admin middleware

## 🎯 CMS Functionaliteit

### ✅ Wat er nu is:
- ✅ **Admin Dashboard** - Overzicht van alle content
- ✅ **Uitjes Beheer** - Create, Read, Update, Delete
- ✅ **Rich Text Editor** - TipTap editor met formatting opties
- ✅ **Media Upload** - URL-based afbeeldingen
- ✅ **Categorie Systeem** - Filter op type uitje
- ✅ **Ontdekkingen** - Gekoppeld aan uitjes
- ✅ **Mobiel Responsive** - Werkt perfect op telefoon en tablet

### 🔐 Toegang

Het CMS is alleen toegankelijk voor admin gebruikers:

**Admin Login Gegevens:**
- Email: `admin@deongeplande-route.nl`
- Wachtwoord: `password`

Of:
- Email: `admin2@deongeplande-route.nl`  
- Wachtwoord: `password`

⚠️ **BELANGRIJK**: Verander deze wachtwoorden direct na eerste login!

### 📍 Admin URLs
- Dashboard: `/admin/dashboard`
- Uitjes overzicht: `/admin/outings`
- Nieuw uitje: `/admin/outings/create`
- Uitje bewerken: `/admin/outings/{id}/edit`

## 🚀 Aan de slag

### Vereisten

- PHP 8.2+
- MySQL/MariaDB (XAMPP)
- Node.js 18+
- Composer

### Installatie

1. **Database aanmaken** (als je dit nog niet hebt gedaan):
```bash
C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE de_ongeplande_route"
```

2. **Dependencies installeren**:
```bash
composer install
npm install
```

3. **Environment setup**:
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database migreren en seeden**:
```bash
php artisan migrate:fresh --seed
```

5. **Assets builden**:
```bash
npm run build
# Of voor development met hot reload:
npm run dev
```

6. **Server starten**:
```bash
php artisan serve
```

Bezoek nu: http://localhost:8000

## 📁 Structuur

### Backend (Laravel)

- **Models**: `app/Models/`
  - `Outing.php` - Uitjes (de kern)
  - `Discovery.php` - Ontdekkaartjes
  - `SocialSnippet.php` - Social media content

- **Controllers**: `app/Http/Controllers/`
  - `HomeController.php` - Homepage met laatste uitjes
  - `OutingController.php` - Detail pagina van een uitje

- **Database**: `database/`
  - Migrations met alle tabellen
  - Seeders met demo data (Artis, Rommelmarkt Nijmegen, etc.)

### Frontend (React + Inertia + TypeScript)

- **Pages**: `resources/js/pages/`
  - `Home.tsx` - Homepage met hero, uitjes grid, ontdekkingen
  - `Outing/Show.tsx` - Detail pagina van een uitje

- **Types**: `resources/js/types/`
  - Type definitions voor Outing, Discovery, etc.

## 🎨 Design Principes

### Kleuren
- **Primair**: `#3a3834` (warm donker)
- **Achtergrond**: `#f5f3f0` (zacht beige)
- **Accent**: `#d9d5cc` (natuurlijk grijs)

### Fonts
- **Serif** (Titels): Lora
- **Sans** (Body): Inter

### Sfeer
- Rustig en overzichtelijk
- Natuurlijke, warme tinten
- Grote, luchtige foto's
- Geen schreeuwende elementen

## 📝 Content Toevoegen

### Via Tinker (Development)

```bash
php artisan tinker
```

```php
// Nieuw uitje aanmaken
$outing = Outing::create([
    'title' => 'Speeltuin Het Bos',
    'story' => 'Vandaag ontdekten we per ongeluk deze geweldige speeltuin...',
    'city' => 'Utrecht',
    'price_info' => 'Gratis',
    'category' => 'Speeltuin',
    'is_free' => true,
    'featured_image' => 'url-naar-foto',
    'published_at' => now(),
]);

// Ontdekking toevoegen
$outing->discoveries()->create([
    'title' => 'Reuzeglijbaan',
    'type' => 'plek',
    'description' => 'Een glijbaan van 15 meter hoog!',
]);
```

### Later: Admin Panel

Je kunt later een admin panel toevoegen met:
```bash
# Bijvoorbeeld met Laravel Nova of Filament
composer require filament/filament
```

## 🎯 Volgende Stappen

### 🔒 Beveiliging (DIRECT DOEN!)
- [ ] Wijzig admin wachtwoorden via profile settings
- [ ] Disable registratie (routes/auth.php - comment uit register routes)
- [ ] Backup systeem opzetten

### Must Have
- [x] Admin panel voor content beheer ✅
- [x] Rich text editor ✅
- [ ] Foto upload functionaliteit (nu URLs)
- [ ] Ontdekkingen CRUD in admin
- [ ] Zoekfunctie voor uitjes
- [ ] Filter op categorie (Gratis, Dierentuin, etc.)

### Nice to Have
- [ ] Media library (eigen foto's uploaden)
- [ ] Bulk acties in admin
- [ ] Draft/Published status toggle
- [ ] Social media integratie
- [ ] Comments sectie
- [ ] Favorieten systeem
- [ ] Route planner (kaart met alle uitjes)
- [ ] Newsletter signup

### Content
- [ ] Over Ons pagina
- [ ] Contact pagina
- [ ] Privacy policy

## 🛠️ Development

### Handige  Commands

```bash
# Database reset met nieuwe data
php artisan migrate:fresh --seed

# Code formatting
vendor/bin/pint

# Tests draaien
php artisan test

# Cache clearen
php artisan cache:clear
php artisan view:clear
php artisan config:clear

# Assets builden en watchen
npm run dev

# Production build
npm run build
```

### TypeScript Types Genereren

Wayfinder genereert automatisch TypeScript functies voor je routes:
```bash
npm run build  # Types worden automatisch gegenereerd
```

## 📱 Social Media Workflow

De `SocialSnippet` model is voorbereid voor je social media strategie:

1. **Schrijf het uitje** - Focus op het verhaal
2. **Voeg ontdekkingen toe** - De kleine momenten
3. **Genereer social content** - Korte hooks en captions
4. **Post naar TikTok/Instagram** - Met link naar je site

Altijd eindigen met: **"Geen plan. Wel verhalen."**

## � Beveiliging

### Admin Toegang
Het systeem gebruikt middleware om admin routes te beschermen:
- `auth` - Gebruiker moet ingelogd zijn
- `verified` - Email moet geverifieerd zijn  
- `admin` - Gebruiker moet admin rechten hebben

### Wachtwoord Wijzigen
1. Log in als admin
2. Ga naar Profile (rechtsboven)
3. Update je wachtwoord
4. Save changes

### Registratie Uitschakelen
Om te voorkomen dat anderen zich registreren:

1. Open `routes/auth.php`
2. Comment uit (of verwijder):
```php
// Route::get('register', [RegisteredUserController::class, 'create'])
//     ->name('register');
// Route::post('register', [RegisteredUserController::class, 'store']);
```

## 📝 Content Toevoegen via het CMS

### Nieuw Uitje Maken

1. **Log in** op `/login`
2. Ga naar **Admin Dashboard** (`/admin/dashboard`)
3. Klik op **"+ Nieuw Uitje"**
4. Vul alle velden in:
   - **Titel** (verplicht)
   - **Verhaal** (verplicht) - Gebruik de rich text editor
   - **Foto's** - Voeg URLs toe van je foto's
   - **Locatie info** - Stad, adres, prijs
   - **Categorie** - Dierentuin, Gratis, etc.
   - **Sfeer** - rustig, gezellig, etc.
5. Klik op **"Uitje Opslaan"**

### Uitje Bewerken

1. Ga naar **"Uitjes Beheren"** in het admin dashboard
2. Klik op **"Bewerk"** bij het gewenste uitje
3. Wijzig de informatie
4. Klik op **"Wijzigingen Opslaan"**

### Tips
- De **slug** wordt automatisch gegenereerd uit de titel
- **Aanbevolen** uitjes verschijnen in de speciale sectie op de homepage
- **Gratis** uitjes krijgen een speciaal label
- Gebruik de **Rich Text Editor** voor mooie opmaak in verhalen



### Database connectie error
Controleer je `.env` bestand:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=de_ongeplande_route
DB_USERNAME=root
DB_PASSWORD=
```

### Assets niet zichtbaar
```bash
npm run build
php artisan config:clear
```

### XAMPP MySQL start niet
- Check of poort 3306 vrij is
- Herstart XAMPP als admin

## ❤️ De Filosofie

Dit platform draait niet om perfectie of commercie.

Het draait om:
- **Echte momenten**
- **Eerlijke verhalen**
- **Samen ontdekken**

Geen plan maken.
Gewoon rijden.
En de verhalen delen.

Veel plezier met bouwen! 🌿

---

**Gebouwd met**: 
- Laravel 12 (Backend Framework)
- Laravel Breeze (Authenticatie)
- Inertia.js v2 (React Server-Side Rendering)
- React 19 (Frontend Framework)
- TypeScript (Type Safety)
- Tailwind CSS v4 (Styling)
- TipTap (Rich Text Editor)
- MySQL (Database)

**CMS Functionaliteit:**
- ✅ Volledig Admin Dashboard
- ✅ CRUD voor Uitjes
- ✅ Rich Text Editor met TipTap
- ✅ Responsive Design (Desktop & Mobiel)
- ✅ Beveiligde Admin Routes
- ✅ Media Management (URLs)

## 🎨 Screenshots

### Publieke Website
- Homepage met hero en uitjes grid
- Categorie navigatie
- Ontdekkingen sectie
- Detail pagina's met verhalen

### Admin CMS
- `/admin/dashboard` - Overzichtelijk dashboard
- `/admin/outings` - Uitjes overzicht met acties
- `/admin/outings/create` - Nieuw uitje formulier met TipTap editor
- `/admin/outings/{id}/edit` - Bewerk bestaande uitjes

---

**🌿 Veel plezier met jullie familie-reisdagboek!**

*"Geen plan maken. Gewoon rijden. En de verhalen delen."*
