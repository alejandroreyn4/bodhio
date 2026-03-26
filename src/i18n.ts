export type Language = 'it' | 'en' | 'es';

export const translations = {
  it: {
    // Menu
    help: 'Aiuto',
    helpSub: 'Istruzioni e benefici',
    mission: 'Missione',
    missionSub: 'La nostra filosofia',
    contacts: 'Contatti',
    contactsSub: 'Supporto e feedback',
    insegnamenti: 'Insegnamenti',
    insegnamentiSub: 'Articoli e meditazione',
    backToTeachings: 'Torna agli insegnamenti',
    mostRecent: 'Più recenti',
    oldest: 'Meno recenti',
    login: 'Accedi',
    loginSub: 'Sincronizza i tuoi dati',
    profile: 'Profilo',
    profileSub: 'Gestisci il tuo account',
    language: 'Lingua',
    
    // Main Page
    week: 'Settimana',
    month: 'Mese',
    year: 'Anno',
    minutes: 'Minuti',
    min: 'min',
    sessions: 'Sessioni',
    streak: 'Streak',
    today: 'Oggi',
    start: 'Inizia',
    pause: 'Pausa',
    resume: 'Riprendi',
    stop: 'Fine',
    sessionDuration: 'Durata sessione',
    ambientSound: 'Suono ambiente',
    totalMinutes: 'Minuti Totali',
    
    // Settings
    settings: 'Impostazioni',
    theme: 'Tema',
    dark: 'Scuro',
    light: 'Chiaro',
    session: 'Sessione',
    sound: 'Suono',
    endBell: 'Campana finale',
    startDelay: 'Ritardo iniziale',
    soundFeedback: 'Feedback sonoro',
    vibration: 'Vibrazione',
    startSound: 'Suono inizio',
    endSound: 'Suono fine',
    save: 'Salva',
    cancel: 'Annulla',
    unsavedChanges: 'Modifiche non salvate',
    unsavedChangesDesc: 'Hai delle modifiche non salvate. Vuoi uscire senza salvare?',
    stay: 'Rimani',
    exit: 'Esci senza salvare',
    ringColor: 'Colore anello',
    chartColor: 'Colore grafico',
    active: 'Attivo',
    inactive: 'Disattivo',
    
    // Notifications
    notifications: 'Notifiche',
    reminderTime: 'Orario promemoria',
    enableNotifications: 'Attiva notifiche',
    notificationTitle: 'Tempo di meditare',
    notificationBody: 'Hai raggiunto il tuo obiettivo oggi? Prenditi un momento per te.',
    notificationPermissionDenied: 'Permesso notifiche negato',
    
    // Help Page
    howToUse: 'Come usare Bodhio',
    step1: 'Scegli la durata della sessione trascinando il cursore o usando i tasti rapidi.',
    step2: 'Seleziona un suono ambientale dalla libreria per favorire l\'immersione.',
    step3: 'Premi il cerchio centrale per iniziare. Segui il ritmo visivo per il tuo respiro.',
    step4: 'Al termine, riceverai un feedback sonoro e potrai consultare le tue statistiche.',
    benefits: 'I benefici della meditazione',
    benefit1Title: 'Riduzione dello stress',
    benefit1Desc: 'Aiuta a calmare il sistema nervoso e a gestire meglio le tensioni quotidiane.',
    benefit2Title: 'Focus e Chiarezza',
    benefit2Desc: 'Migliora la capacità di concentrazione e la presenza mentale nel lavoro e nello studio.',
    benefit3Title: 'Equilibrio Emotivo',
    benefit3Desc: 'Sviluppa una maggiore consapevolezza delle proprie emozioni, riducendo la reattività.',
    quote: '"La meditazione non è un modo per far tacere la mente, ma un modo per trovare la calma nel rumore."',
    
    // Mission Page
    missionTitle: 'Missione',
    missionP1: 'Questo progetto nasce da un’esigenza personale: dopo una lunga ricerca, non sono riuscito a trovare un’app di meditazione che fosse davvero accessibile, libera e priva dei soliti abbonamenti.',
    missionP2: 'La meditazione, oggi più che mai, non dovrebbe essere un lusso o qualcosa di bloccato dietro un pagamento ricorrente. È uno strumento fondamentale, qualcosa di necessario per ritrovare equilibrio, presenza e chiarezza nella vita quotidiana.',
    missionP3: 'Per questo ho deciso di creare un’app diversa. Un luogo semplice, essenziale, dove chiunque possa meditare liberamente, senza limiti e senza barriere.',
    missionP4: 'Credo in un modello aperto e sostenibile: l’app resterà gratuita per tutti. Per chi desidera supportare il progetto, l’unico modo per farlo è attraverso una donazione volontaria.',
    missionP5: 'Questo spazio esiste grazie a un’idea semplice: rendere la meditazione accessibile a chiunque, ovunque.',
    missionP6: 'Se hai suggerimenti o idee per migliorare la piattaforma, trovi i contatti nella sezione della pagina dedicata, questo spazio cresce anche grazie a te.',
    donations: 'Donazioni',

    // Admin Panel
    adminPanel: 'Pannello Admin',
    totalUsers: 'Utenti Totali',
    totalSessions: 'Sessioni Totali',
    user: 'Utente',
    email: 'Email',
    registered: 'Registrato',
    
    // Completion Screen
    sessionCompleted: 'Sessione completata',
    meditatedFor: 'HAI MEDITATO PER',
    again: 'Di nuovo',
    overview: 'Panoramica',
    
    // Mood Tracking
    howDoYouFeel: 'Come ti senti?',
    veryStressed: 'Molto stressato',
    slightlyStressed: 'Un po\' stressato',
    neutral: 'Neutrale',
    relaxed: 'Rilassato',
    veryCalm: 'Molto calmo',
    addNotePlaceholder: 'Vuoi aggiungere una nota?',
    moodSaved: 'Stato d\'animo salvato',
    emotionalState: 'Stato emotivo',
    moodOverTime: 'Andamento del tuo umore',
    avgMood: 'Media',
    dailyMood: 'Umore giornaliero',
    sessionsCount: 'Sessioni',
    weightedAvg: 'Media pesata',
    noMoodData: 'Nessun dato',
    moodDetails: 'Dettagli umore',
    close: 'Chiudi',
    
    // Reset Modal
    resetOverview: 'Azzera panoramica',
    resetConfirm: 'Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.',
    resetYes: 'Sì, azzera tutto',
    
    // Contacts Page
    contactsTitle: 'Contatti',
    contactsDesc: 'Aggiungi qui email o form di contatto...',
    
    // Support Page
    supportTitle: 'Supporta il progetto',
    supportP1: 'Se trovi valore in questa applicazione e desideri contribuire alla sua crescita e mantenimento, puoi farlo attraverso una donazione libera.',
    supportP2: 'Ogni contributo, piccolo o grande, aiuta a mantenere il progetto gratuito e privo di pubblicità per tutti.',
    supportButton: 'Supporta su PayPal',
    
    // Breathing Phases
    inhale: 'Inspira',
    hold: 'Trattieni',
    exhale: 'Espira',
    rest: 'Pausa',
    
    // Auth
    fullName: 'Nome completo',
    password: 'Password',
    register: 'Registrati',
    continueWithGoogle: 'Continua con Google',
    alreadyHaveAccount: 'Hai già un account?',
    dontHaveAccount: 'Non hai un account?',
    loginHere: 'Accedi qui',
    registerHere: 'Registrati qui',
    logout: 'Esci',
    or: 'Oppure',

    // Overview
    totalTime: 'Tempo Totale',
    goal: 'Obiettivo',
    minutesToday: 'minuti oggi',
    avgSession: 'Media Sessione',
    minPerSession: 'minuti/sessione',
    consecutiveDays: 'giorni consecutivi',
    calendar: 'Calendario',
    meditatedDays: 'giorni meditati',
    quickStats: 'Statistiche rapide',
    longestSession: 'Sessione più lunga',
    weeklyAverage: 'Media settimanale',
    ifYouContinue: 'SE CONTINUI COSÌ',
    youWillMeditate: 'Mediterai',
    hoursThisYear: 'ore quest\'anno',
    progression: 'Progressione',
    meditatedMinutes: 'minuti meditati',
    achievementsTitle: 'Traguardi',
    days: ['D', 'L', 'M', 'M', 'G', 'V', 'S'],
    months: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    weeks: ['S1', 'S2', 'S3', 'S4'],

    // Player
    listening: 'Ascolto',
    noTrack: 'Nessun brano',
    myPlaylist: 'La mia playlist',
    favorites: 'Preferiti',
    noFavorites: 'Nessun preferito',

    // Audio Errors
    audioError: 'Errore audio',
    audioLoadError: 'Impossibile caricare alcuni file audio. Verifica la tua connessione.',
    tapToEnableAudio: 'Tocca lo schermo per attivare l\'audio.',
    browserAudioError: 'Errore audio. Verifica le impostazioni del browser.',
    sounds: {
      none: 'Silenzio',
      bell1: 'Campana 1',
      bell2: 'Campana 2',
      bell3: 'Campana 3',
      bell4: 'Campana 4',
      bell5: 'Campana 5'
    },
    categories: {
      tempio: 'Tempio',
      natura: 'Natura',
      meditazione: 'Meditazione'
    },
    articleCategories: {
      all: 'Tutti',
      consapevolezza: 'Consapevolezza',
      respirazione: 'Respirazione',
      mindfulness: 'Mindfulness',
      abitudini: 'Abitudini',
      meditazioneGuidata: 'Meditazione Guidata'
    },
    tracks: {
      temple: 'Canti nel Tempio',
      calmrain: 'Pioggia Calma',
      monks: 'Monaci Tibetani',
      birds: 'Mattina con Uccelli',
      river: 'Fiume',
      windchimes: 'Campane Tibetane'
    },
    achievements: {
      seme: { title: 'Seme del Bodhi', desc: 'Completa la tua 1ª sessione' },
      costanza: { title: 'Costanza Zen', desc: '7 giorni consecutivi' },
      oceano: { title: 'Oceano di Calma', desc: '500 minuti totali' },
      silenzio: { title: 'Silenzio Profondo', desc: 'Sessione da 30+ minuti' },
      lunare: { title: 'Meditazione Lunare', desc: 'Sessione dopo le 22:00' },
      maestro: { title: 'Maestro del Risveglio', desc: '50 sessioni totali' }
    }
  },
  en: {
    // Menu
    help: 'Help',
    helpSub: 'Instructions and benefits',
    mission: 'Mission',
    missionSub: 'Our philosophy',
    contacts: 'Contacts',
    contactsSub: 'Support and feedback',
    insegnamenti: 'Teachings',
    insegnamentiSub: 'Articles and meditation',
    backToTeachings: 'Back to teachings',
    mostRecent: 'Most recent',
    oldest: 'Oldest',
    login: 'Login',
    loginSub: 'Sync your data',
    profile: 'Profile',
    profileSub: 'Manage your account',
    language: 'Language',
    
    // Main Page
    week: 'Week',
    month: 'Month',
    year: 'Year',
    minutes: 'Minutes',
    min: 'min',
    sessions: 'Sessions',
    streak: 'Streak',
    today: 'Today',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    sessionDuration: 'Session duration',
    ambientSound: 'Ambient sound',
    totalMinutes: 'Total Minutes',
    
    // Settings
    settings: 'Settings',
    theme: 'Theme',
    dark: 'Dark',
    light: 'Light',
    session: 'Session',
    sound: 'Sound',
    endBell: 'End bell',
    startDelay: 'Start delay',
    soundFeedback: 'Sound feedback',
    vibration: 'Vibration',
    startSound: 'Start sound',
    endSound: 'End sound',
    save: 'Save',
    cancel: 'Cancel',
    unsavedChanges: 'Unsaved changes',
    unsavedChangesDesc: 'You have unsaved changes. Do you want to exit without saving?',
    stay: 'Stay',
    exit: 'Exit without saving',
    ringColor: 'Ring color',
    chartColor: 'Chart color',
    active: 'Active',
    inactive: 'Inactive',
    
    // Notifications
    notifications: 'Notifications',
    reminderTime: 'Reminder time',
    enableNotifications: 'Enable notifications',
    notificationTitle: 'Time to meditate',
    notificationBody: 'Have you reached your goal today? Take a moment for yourself.',
    notificationPermissionDenied: 'Notification permission denied',
    
    // Help Page
    howToUse: 'How to use Bodhio',
    step1: 'Choose the session duration by dragging the slider or using the quick keys.',
    step2: 'Select an ambient sound from the library to enhance immersion.',
    step3: 'Press the central circle to start. Follow the visual rhythm for your breathing.',
    step4: 'At the end, you will receive sound feedback and can check your statistics.',
    benefits: 'The benefits of meditation',
    benefit1Title: 'Stress Reduction',
    benefit1Desc: 'Helps calm the nervous system and better manage daily tensions.',
    benefit2Title: 'Focus and Clarity',
    benefit2Desc: 'Improves concentration and mental presence in work and study.',
    benefit3Title: 'Emotional Balance',
    benefit3Desc: 'Develops greater awareness of your emotions, reducing reactivity.',
    quote: '"Meditation is not a way of making the mind quiet, but a way of finding the quiet in the noise."',
    
    // Mission Page
    missionTitle: 'Mission',
    missionP1: 'This project was born from a personal need: after a long search, I couldn\'t find a meditation app that was truly accessible, free, and without the usual subscriptions.',
    missionP2: 'Meditation, now more than ever, should not be a luxury or something locked behind a recurring payment. It is a fundamental tool, something necessary to find balance, presence, and clarity in daily life.',
    missionP3: 'That\'s why I decided to create a different app. A simple, essential place where anyone can meditate freely, without limits and without barriers.',
    missionP4: 'I believe in an open and sustainable model: the app will remain free for everyone. For those who wish to support the project, the only way to do so is through a voluntary donation.',
    missionP5: 'This space exists thanks to a simple idea: making meditation accessible to anyone, anywhere.',
    missionP6: 'If you have suggestions or ideas to improve the platform, you can find the contacts in the dedicated page section, this space grows also thanks to you.',
    donations: 'Donations',

    // Admin Panel
    adminPanel: 'Admin Panel',
    totalUsers: 'Total Users',
    totalSessions: 'Total Sessions',
    user: 'User',
    email: 'Email',
    registered: 'Registered',
    
    // Completion Screen
    sessionCompleted: 'Session completed',
    meditatedFor: 'YOU MEDITATED FOR',
    again: 'Again',
    overview: 'Overview',
    
    // Mood Tracking
    howDoYouFeel: 'How do you feel?',
    veryStressed: 'Very stressed',
    slightlyStressed: 'Slightly stressed',
    neutral: 'Neutral',
    relaxed: 'Relaxed',
    veryCalm: 'Very calm',
    addNotePlaceholder: 'Want to add a note?',
    moodSaved: 'Mood saved',
    emotionalState: 'Emotional state',
    moodOverTime: 'Mood trend',
    avgMood: 'Average',
    dailyMood: 'Daily mood',
    sessionsCount: 'Sessions',
    weightedAvg: 'Weighted average',
    noMoodData: 'No data',
    moodDetails: 'Mood details',
    close: 'Close',
    
    // Reset Modal
    resetOverview: 'Reset overview',
    resetConfirm: 'Are you sure you want to delete all data? This action cannot be undone.',
    resetYes: 'Yes, reset everything',
    
    // Contacts Page
    contactsTitle: 'Contacts',
    contactsDesc: 'Add email or contact form here...',
    
    // Support Page
    supportTitle: 'Support the project',
    supportP1: 'If you find value in this application and want to contribute to its growth and maintenance, you can do so through a free donation.',
    supportP2: 'Every contribution, small or large, helps keep the project free and ad-free for everyone.',
    supportButton: 'Support on PayPal',
    
    // Breathing Phases
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
    rest: 'Rest',
    
    // Auth
    fullName: 'Full name',
    password: 'Password',
    register: 'Register',
    continueWithGoogle: 'Continue with Google',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: 'Don\'t have an account?',
    loginHere: 'Login here',
    registerHere: 'Register here',
    logout: 'Logout',
    or: 'Or',

    // Overview
    totalTime: 'Total Time',
    goal: 'Goal',
    minutesToday: 'minutes today',
    avgSession: 'Avg Session',
    minPerSession: 'minutes/session',
    consecutiveDays: 'consecutive days',
    calendar: 'Calendar',
    meditatedDays: 'meditated days',
    quickStats: 'Quick stats',
    longestSession: 'Longest session',
    weeklyAverage: 'Weekly average',
    ifYouContinue: 'IF YOU CONTINUE LIKE THIS',
    youWillMeditate: 'You will meditate',
    hoursThisYear: 'hours this year',
    progression: 'Progression',
    meditatedMinutes: 'meditated minutes',
    achievementsTitle: 'Achievements',
    days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weeks: ['W1', 'W2', 'W3', 'W4'],

    // Player
    listening: 'Listening',
    noTrack: 'No track',
    myPlaylist: 'My playlist',
    favorites: 'Favorites',
    noFavorites: 'No favorites',

    // Audio Errors
    audioError: 'Audio error',
    audioLoadError: 'Unable to load some audio files. Check your connection.',
    tapToEnableAudio: 'Tap the screen to enable audio.',
    browserAudioError: 'Audio error. Check your browser settings.',
    sounds: {
      none: 'Silence',
      bell1: 'Bell 1',
      bell2: 'Bell 2',
      bell3: 'Bell 3',
      bell4: 'Bell 4',
      bell5: 'Bell 5'
    },
    categories: {
      tempio: 'Temple',
      natura: 'Nature',
      meditazione: 'Meditation'
    },
    articleCategories: {
      all: 'All',
      consapevolezza: 'Awareness',
      respirazione: 'Breathing',
      mindfulness: 'Mindfulness',
      abitudini: 'Habits',
      meditazioneGuidata: 'Guided Meditation'
    },
    tracks: {
      temple: 'Temple Chanting',
      calmrain: 'Calm Rain',
      monks: 'Tibetan Monks',
      birds: 'Morning Birds',
      river: 'River',
      windchimes: 'Tibetan Bells'
    },
    achievements: {
      seme: { title: 'Bodhi Seed', desc: 'Complete your 1st session' },
      costanza: { title: 'Zen Consistency', desc: '7 consecutive days' },
      oceano: { title: 'Ocean of Calm', desc: '500 total minutes' },
      silenzio: { title: 'Deep Silence', desc: '30+ minute session' },
      lunare: { title: 'Lunar Meditation', desc: 'Session after 10:00 PM' },
      maestro: { title: 'Master of Awakening', desc: '50 total sessions' }
    }
  },
  es: {
    // Menu
    help: 'Ayuda',
    helpSub: 'Instrucciones y beneficios',
    mission: 'Misión',
    missionSub: 'Nuestra filosofía',
    contacts: 'Contactos',
    contactsSub: 'Soporte y feedback',
    insegnamenti: 'Enseñanzas',
    insegnamentiSub: 'Artículos y meditación',
    backToTeachings: 'Volver a las enseñanzas',
    mostRecent: 'Más recientes',
    oldest: 'Más antiguos',
    login: 'Acceder',
    loginSub: 'Sincroniza tus datos',
    profile: 'Perfil',
    profileSub: 'Gestiona tu cuenta',
    language: 'Idioma',
    
    // Main Page
    week: 'Semana',
    month: 'Mes',
    year: 'Año',
    minutes: 'Minutos',
    min: 'min',
    sessions: 'Sesiones',
    streak: 'Racha',
    today: 'Hoy',
    start: 'Empezar',
    pause: 'Pausa',
    resume: 'Reanudar',
    stop: 'Parar',
    sessionDuration: 'Duración de la sesión',
    ambientSound: 'Sonido ambiente',
    totalMinutes: 'Minutos Totales',
    
    // Settings
    settings: 'Ajustes',
    theme: 'Tema',
    dark: 'Oscuro',
    light: 'Claro',
    session: 'Sesión',
    sound: 'Sonido',
    endBell: 'Campana final',
    startDelay: 'Retraso inicial',
    soundFeedback: 'Feedback de sonido',
    vibration: 'Vibración',
    startSound: 'Sonido inicio',
    endSound: 'Sonido fin',
    save: 'Guardar',
    cancel: 'Cancelar',
    unsavedChanges: 'Cambios no guardados',
    unsavedChangesDesc: 'Tienes cambios sin guardar. ¿Quieres salir sin guardar?',
    stay: 'Permanecer',
    exit: 'Salir sin guardar',
    ringColor: 'Color del anillo',
    chartColor: 'Color del gráfico',
    active: 'Activo',
    inactive: 'Inactivo',
    
    // Notifications
    notifications: 'Notificaciones',
    reminderTime: 'Hora de recordatorio',
    enableNotifications: 'Activar notificaciones',
    notificationTitle: 'Tiempo de meditar',
    notificationBody: '¿Has alcanzado tu objetivo hoy? Tómate un momento para ti.',
    notificationPermissionDenied: 'Permiso de notificaciones denegado',
    
    // Help Page
    howToUse: 'Cómo usar Bodhio',
    step1: 'Elige la duración de la sesión arrastrando el cursor o usando las teclas rápidas.',
    step2: 'Selecciona un sonido ambiental de la biblioteca para mejorar la inmersión.',
    step3: 'Presiona el círculo central para empezar. Sigue el ritmo visual para tu respiración.',
    step4: 'Al terminar, recibirás un feedback sonoro y podrás consultar tus estadísticas.',
    benefits: 'Los beneficios de la meditación',
    benefit1Title: 'Reducción del estrés',
    benefit1Desc: 'Ayuda a calmar el sistema nervioso y a gestionar mejor las tensiones diarias.',
    benefit2Title: 'Enfoque y Claridad',
    benefit2Desc: 'Mejora la capacidad de concentración y la presencia mental en el trabajo y el estudio.',
    benefit3Title: 'Equilibrio Emocional',
    benefit3Desc: 'Desarrolla una mayor conciencia de tus emociones, reduciendo la reactividad.',
    quote: '"La meditación no es una forma de acallar la mente, sino una forma de encontrar la calma en el ruido."',
    
    // Mission Page
    missionTitle: 'Misión',
    missionP1: 'Este proyecto nace de una necesidad personal: después de una larga búsqueda, no pude encontrar una aplicación de meditación que fuera realmente accesible, gratuita y sin las suscripciones habituales.',
    missionP2: 'La meditación, ahora más que nunca, no debería ser un lujo o algo bloqueado tras un pago recurrente. Es una herramienta fundamental, algo necesario para encontrar equilibrio, presencia y claridad en la vida diaria.',
    missionP3: 'Por eso decidí crear una aplicación diferente. Un lugar sencillo, esencial, donde cualquiera pueda meditar libremente, sin límites y sin barreras.',
    missionP4: 'Creo en un modelo abierto y sostenible: la aplicación seguirá siendo gratuita para todos. Para quienes deseen apoyar el proyecto, la única forma de hacerlo es a través de una donación voluntaria.',
    missionP5: 'Este espacio existe gracias a una idea sencilla: hacer que la meditación sea accesible para cualquier persona, en cualquier lugar.',
    missionP6: 'Si tienes sugerencias o ideas para mejorar la plataforma, puedes encontrar los contactos en la sección dedicada de la página, este espacio crece también gracias a ti.',
    donations: 'Donaciones',

    // Admin Panel
    adminPanel: 'Panel de Administración',
    totalUsers: 'Usuarios Totales',
    totalSessions: 'Sesiones Totales',
    user: 'Usuario',
    email: 'Correo electrónico',
    registered: 'Registrado',
    
    // Completion Screen
    sessionCompleted: 'Sesión completada',
    meditatedFor: 'HAS MEDITADO POR',
    again: 'De nuevo',
    overview: 'Resumen',
    
    // Mood Tracking
    howDoYouFeel: '¿Cómo te sientes?',
    veryStressed: 'Muy estresado',
    slightlyStressed: 'Un poco estresado',
    neutral: 'Neutral',
    relaxed: 'Relajado',
    veryCalm: 'Muy tranquilo',
    addNotePlaceholder: '¿Quieres añadir una nota?',
    moodSaved: 'Estado de ánimo guardado',
    emotionalState: 'Estado emocional',
    moodOverTime: 'Tendencia del estado de ánimo',
    avgMood: 'Promedio',
    dailyMood: 'Estado de ánimo diario',
    sessionsCount: 'Sesiones',
    weightedAvg: 'Promedio ponderado',
    noMoodData: 'Sin datos',
    moodDetails: 'Detalles del ánimo',
    close: 'Cerrar',
    
    // Reset Modal
    resetOverview: 'Reiniciar resumen',
    resetConfirm: '¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.',
    resetYes: 'Sí, reiniciar todo',
    
    // Contacts Page
    contactsTitle: 'Contactos',
    contactsDesc: 'Añade aquí el correo o formulario de contacto...',
    
    // Support Page
    supportTitle: 'Apoya el proyecto',
    supportP1: 'Si encuentras valor en esta aplicación y deseas contribuir a su crecimiento y mantenimiento, puedes hacerlo a través de una donación libre.',
    supportP2: 'Cada contribución, pequeña o grande, ayuda a mantener el proyecto gratuito y sin publicidad para todos.',
    supportButton: 'Apoyar en PayPal',
    
    // Breathing Phases
    inhale: 'Inhala',
    hold: 'Mantén',
    exhale: 'Exhala',
    rest: 'Pausa',
    
    // Auth
    fullName: 'Nombre completo',
    password: 'Contraseña',
    register: 'Registrarse',
    continueWithGoogle: 'Continuar con Google',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    loginHere: 'Accede aquí',
    registerHere: 'Regístrate aquí',
    logout: 'Cerrar sesión',
    or: 'O',

    // Overview
    totalTime: 'Tiempo Total',
    goal: 'Objetivo',
    minutesToday: 'minutos hoy',
    avgSession: 'Sesión Media',
    minPerSession: 'minutos/sesión',
    consecutiveDays: 'días consecutivos',
    calendar: 'Calendario',
    meditatedDays: 'días meditados',
    quickStats: 'Estadísticas rápidas',
    longestSession: 'Sesión más larga',
    weeklyAverage: 'Media semanal',
    ifYouContinue: 'SI CONTINÚAS ASÍ',
    youWillMeditate: 'Meditarás',
    hoursThisYear: 'horas este año',
    progression: 'Progresión',
    meditatedMinutes: 'minutos meditados',
    achievementsTitle: 'Logros',
    days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    months: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    weeks: ['S1', 'S2', 'S3', 'S4'],

    // Player
    listening: 'Escuchando',
    noTrack: 'Sin pista',
    myPlaylist: 'Mi lista',
    favorites: 'Favoritos',
    noFavorites: 'Sin favoritos',

    // Audio Errors
    audioError: 'Error de audio',
    audioLoadError: 'No se pudieron cargar algunos archivos de audio. Comprueba tu conexión.',
    tapToEnableAudio: 'Toca la pantalla para activar el audio.',
    browserAudioError: 'Error de audio. Comprueba los ajustes de tu navegador.',
    sounds: {
      none: 'Silencio',
      bell1: 'Campana 1',
      bell2: 'Campana 2',
      bell3: 'Campana 3',
      bell4: 'Campana 4',
      bell5: 'Campana 5'
    },
    categories: {
      tempio: 'Templo',
      natura: 'Naturaleza',
      meditazione: 'Meditación'
    },
    articleCategories: {
      all: 'Todos',
      consapevolezza: 'Conciencia',
      respirazione: 'Respiración',
      mindfulness: 'Mindfulness',
      abitudini: 'Hábitos',
      meditazioneGuidata: 'Meditación Guiada'
    },
    tracks: {
      temple: 'Cantos en el Templo',
      calmrain: 'Lluvia Calma',
      monks: 'Monjes Tibetanos',
      birds: 'Mañana con Pájaros',
      river: 'Río',
      windchimes: 'Campanas Tibetanas'
    },
    achievements: {
      seme: { title: 'Semilla de Bodhi', desc: 'Completa tu 1ª sesión' },
      costanza: { title: 'Constancia Zen', desc: '7 días consecutivos' },
      oceano: { title: 'Océano de Calma', desc: '500 minutos totales' },
      silenzio: { title: 'Silencio Profondo', desc: 'Sesión de 30+ minutos' },
      lunare: { title: 'Meditación Lunar', desc: 'Sesión después de las 22:00' },
      maestro: { title: 'Maestro del Despertar', desc: '50 sesiones totales' }
    }
  },
};
