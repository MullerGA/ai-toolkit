import type { ConversationState } from '@/types/memory'

export const conversationStates: ConversationState[] = [
  // Message 1
  {
    timelinePoint: {
      id: '1',
      label: 'Voyage Paris',
      active: true
    },
    contextWindow: {
      active: ['Voyage Paris'],
      recent: []
    },
    memoryStack: {
      high: ['Destination Paris'],
      medium: [],
      low: []
    },
    messages: [
      {
        id: '1',
        content: 'Je voudrais planifier un voyage à Paris.',
        sender: 'human'
      },
      {
        id: '2',
        content: 'Je peux vous aider à planifier votre voyage à Paris. Pour commencer, pouvez-vous me préciser la durée et le nombre de voyageurs ?',
        sender: 'assistant'
      }
    ]
  },

  // Message 2
  {
    timelinePoint: {
      id: '2',
      label: '2 pers. juillet',
      active: false
    },
    contextWindow: {
      active: ['Voyage Paris', '2 personnes juillet'],
      recent: []
    },
    memoryStack: {
      high: ['Destination Paris', 'Période juillet', 'Nombre: 2 personnes'],
      medium: ['Haute/moyenne saison'],
      low: []
    },
    messages: [
      {
        id: '3',
        content: 'Pour deux personnes, en juillet.',
        sender: 'human'
      },
      {
        id: '4',
        content: 'Merci. Pour juillet, j\'ai noté pour 2 personnes. Avez-vous des dates précises ? Les tarifs varient entre haute saison (14 juillet) et moyenne saison.',
        sender: 'assistant'
      }
    ]
  },

  // Message 3
  {
    timelinePoint: {
      id: '3',
      label: 'Hôtels?',
      active: false
    },
    contextWindow: {
      active: ['2 personnes juillet', 'hôtels'],
      recent: []
    },
    memoryStack: {
      high: ['Recherche hôtels'],
      medium: ['Destination Paris', 'Période juillet', 'Nombre: 2 personnes'],
      low: []
    },
    messages: [
      {
        id: '5',
        content: 'Quels sont les hôtels disponibles ?',
        sender: 'human'
      },
      {
        id: '6',
        content: 'Pour 2 personnes en juillet à Paris, voici les options d\'hôtels :\n- Hôtel Central Paris : 180€/nuit\n- Résidence Marais : 220€/nuit\n- Suite Seine : 250€/nuit\nSouhaitez-vous des filtres particuliers ?',
        sender: 'assistant'
      }
    ]
  },

  // Message 4
  {
    timelinePoint: {
      id: '4',
      label: 'Transport?',
      active: false
    },
    contextWindow: {
      active: ['transport'],
      recent: ['hôtels']
    },
    memoryStack: {
      high: ['Options transport'],
      medium: ['Destination Paris', 'Période juillet', 'Nombre: 2 personnes'],
      low: ['Options hôtels']
    },
    messages: [
      {
        id: '7',
        content: 'En fait, parlons d\'abord du transport. Quels sont les vols disponibles ?',
        sender: 'human'
      },
      {
        id: '8',
        content: 'Pour Paris en juillet, j\'ai plusieurs vols :\n- Air France : 300€/pers, départ 10h\n- EasyJet : 180€/pers, départ 6h\n- Lufthansa : 280€/pers, départ 14h\nLes prix sont par personne, donc à multiplier par 2.',
        sender: 'assistant'
      }
    ]
  },

  // Message 5
  {
    timelinePoint: {
      id: '5',
      label: 'Hôtels CDG',
      active: false
    },
    contextWindow: {
      active: ['transport', 'hôtels aéroport'],
      recent: []
    },
    memoryStack: {
      high: ['Hôtels aéroport', 'Transport'],
      medium: ['Destination Paris', 'Période juillet', 'Nombre: 2 personnes'],
      low: ['Hôtels centre-ville']
    },
    messages: [
      {
        id: '9',
        content: 'Une fois le vol choisi, revenons aux hôtels près de l\'aéroport.',
        sender: 'human'
      },
      {
        id: '10',
        content: 'Si nous considérons l\'aéroport Charles de Gaulle, voici les hôtels disponibles :\n- Novotel Aéroport : 160€/nuit\n- Pullman CDG : 200€/nuit\nCes prix sont plus avantageux que ceux du centre-ville vus précédemment.',
        sender: 'assistant'
      }
    ]
  },

  // Message 6
  {
    timelinePoint: {
      id: '6',
      label: 'Résumé',
      active: false
    },
    contextWindow: {
      active: ['résumé complet', 'tous détails'],
      recent: []
    },
    memoryStack: {
      high: ['Synthèse complète'],
      medium: ['Transport', 'Hébergement', 'Dates'],
      low: ['Détails prix']
    },
    messages: [
      {
        id: '11',
        content: 'Pouvez-vous me faire un résumé complet du voyage prévu jusqu\'ici ?',
        sender: 'human'
      },
      {
        id: '12',
        content: 'Bien sûr, voici le récapitulatif :\n- Voyage à Paris en juillet pour 2 personnes\n- Options vols : 180-300€/personne\n- Options hôtels centre-ville : 180-250€/nuit\n- Options hôtels aéroport : 160-200€/nuit\nNous n\'avons pas encore fixé les dates précises ni fait de réservations.',
        sender: 'assistant'
      }
    ]
  },

  // Message 7
  {
    timelinePoint: {
      id: '7',
      label: 'Activités',
      active: false
    },
    contextWindow: {
      active: ['activités'],
      recent: ['synthèse']
    },
    memoryStack: {
      high: ['Activités'],
      medium: ['Transport', 'Hébergement'],
      low: ['Détails précédents']
    },
    messages: [
      {
        id: '13',
        content: 'Pour les activités sur place, y a-t-il des visites guidées ?',
        sender: 'human'
      },
      {
        id: '14',
        content: 'Oui, plusieurs options de visites guidées à Paris :\n- Tour Eiffel + Seine : 50€/pers\n- Louvre express : 45€/pers\n- Paris historique : 35€/pers\nCes visites sont disponibles en juillet, mais je recommande de réserver tôt.',
        sender: 'assistant'
      }
    ]
  },

  // Message 8
  {
    timelinePoint: {
      id: '8',
      label: 'Budget',
      active: false
    },
    contextWindow: {
      active: ['budget total', 'tous services'],
      recent: []
    },
    memoryStack: {
      high: ['Tous les coûts'],
      medium: ['Détails par catégorie'],
      low: ['Options non retenues']
    },
    messages: [
      {
        id: '15',
        content: 'Quel serait le budget total incluant vol, hôtel et activités ?',
        sender: 'human'
      },
      {
        id: '16',
        content: 'Pour 2 personnes, estimation pour 3 jours :\n- Vols : ~360-600€ total\n- Hôtel : ~480-600€ (3 nuits)\n- Activités : ~140-200€ total\nBudget total estimé : 980-1400€\nNote : Ces prix sont pour juillet, hors 14 juillet.',
        sender: 'assistant'
      }
    ]
  }
] 