const TOPIC_CATALOG = [
  {
    id: "daily-life",
    label: "Daily Life",
    topics: [
      {
        id: "morning-routine",
        label: "Morning Routine",
        description: "hábitos, tempo e produtividade",
        vocabulary: [
          { word: "wake up", meaning: "acordar", example: "I wake up at 6:30 on weekdays." },
          { word: "commute", meaning: "deslocamento casa-trabalho", example: "My commute takes about 40 minutes." },
          { word: "get ready", meaning: "se arrumar", example: "I get ready quickly before work." }
        ],
        pronunciationTips: ["wake /weik/", "ready /redi/", "commute /kemiut/"],
        rolePlays: [
          "Você explica sua rotina para um novo colega estrangeiro.",
          "Você ajuda um turista a organizar uma manhã produtiva na cidade."
        ]
      },
      {
        id: "shopping",
        label: "Shopping",
        description: "compras, preços e atendimento",
        vocabulary: [
          { word: "receipt", meaning: "nota fiscal", example: "Could I have the receipt, please?" },
          { word: "on sale", meaning: "em promoção", example: "This jacket is on sale today." },
          { word: "try on", meaning: "experimentar roupa", example: "Can I try on this shirt?" }
        ],
        pronunciationTips: ["receipt /risit/", "sale /seil/", "size /saiz/"],
        rolePlays: [
          "Você é cliente e pede troca de produto no balcão.",
          "Você é atendente e sugere opções para o cliente."
        ]
      }
    ]
  },
  {
    id: "work",
    label: "Work & Career",
    topics: [
      {
        id: "job-interview",
        label: "Job Interview",
        description: "entrevista, experiência e objetivos",
        vocabulary: [
          { word: "strengths", meaning: "pontos fortes", example: "My strengths are communication and problem-solving." },
          { word: "deadline", meaning: "prazo final", example: "I always meet deadlines." },
          { word: "teamwork", meaning: "trabalho em equipe", example: "Teamwork is essential in my role." }
        ],
        pronunciationTips: ["strength /strengf/", "deadline /dedlain/", "career /kerier/"],
        rolePlays: [
          "Você responde perguntas de uma entrevista de emprego.",
          "Você é recrutador e faz perguntas comportamentais."
        ]
      },
      {
        id: "meetings",
        label: "Meetings",
        description: "reuniões, alinhamento e decisão",
        vocabulary: [
          { word: "agenda", meaning: "pauta", example: "Let's review today's agenda." },
          { word: "action items", meaning: "itens de ação", example: "Can we define action items?" },
          { word: "follow up", meaning: "dar continuidade", example: "I'll follow up tomorrow." }
        ],
        pronunciationTips: ["agenda /adjenda/", "follow up /falo ap/", "align /alain/"],
        rolePlays: [
          "Você lidera uma reunião de status do projeto.",
          "Você participa da reunião e pede esclarecimentos."
        ]
      }
    ]
  },
  {
    id: "travel",
    label: "Travel & Culture",
    topics: [
      {
        id: "airport",
        label: "Airport",
        description: "check-in, embarque e conexão",
        vocabulary: [
          { word: "boarding pass", meaning: "cartão de embarque", example: "Where can I print my boarding pass?" },
          { word: "luggage", meaning: "bagagem", example: "My luggage is overweight." },
          { word: "departure gate", meaning: "portão de embarque", example: "What time does the gate open?" }
        ],
        pronunciationTips: ["boarding /bording/", "luggage /lagadj/", "gate /gueit/"],
        rolePlays: [
          "Você pede ajuda no balcão porque perdeu a conexão.",
          "Você trabalha no aeroporto e orienta passageiros."
        ]
      },
      {
        id: "hotel",
        label: "Hotel",
        description: "reserva, check-in e solicitações",
        vocabulary: [
          { word: "reservation", meaning: "reserva", example: "I have a reservation under Silva." },
          { word: "single room", meaning: "quarto individual", example: "Do you have a single room available?" },
          { word: "checkout", meaning: "saída do hotel", example: "What time is checkout?" }
        ],
        pronunciationTips: ["reservation /rezervexan/", "available /aveilabol/", "checkout /tchekaut/"],
        rolePlays: [
          "Você faz check-in e solicita quarto silencioso.",
          "Você é recepcionista e resolve um problema de reserva."
        ]
      }
    ]
  },
  {
    id: "technology",
    label: "Technology",
    topics: [
      {
        id: "social-media",
        label: "Social Media",
        description: "uso, impacto e hábitos digitais",
        vocabulary: [
          { word: "feed", meaning: "feed de conteúdo", example: "My feed is full of short videos." },
          { word: "scroll", meaning: "rolar a tela", example: "I scroll for too long at night." },
          { word: "privacy", meaning: "privacidade", example: "Privacy settings are important." }
        ],
        pronunciationTips: ["privacy /praivasi/", "scroll /skroul/", "screen time /skrin taim/"],
        rolePlays: [
          "Você debate tempo de tela com um amigo.",
          "Você apresenta regras de uso digital para adolescentes."
        ]
      },
      {
        id: "ai-tools",
        label: "AI Tools",
        description: "produtividade, ética e automação",
        vocabulary: [
          { word: "prompt", meaning: "comando para IA", example: "A clear prompt gives better results." },
          { word: "bias", meaning: "viés", example: "AI systems may show bias." },
          { word: "automation", meaning: "automação", example: "Automation saves time in repetitive tasks." }
        ],
        pronunciationTips: ["bias /baias/", "automation /otomeixon/", "tool /tuul/"],
        rolePlays: [
          "Você convence seu time a testar uma ferramenta de IA.",
          "Você discute riscos éticos da IA com um colega."
        ]
      }
    ]
  },
  {
    id: "health",
    label: "Health & Wellness",
    topics: [
      {
        id: "exercise",
        label: "Exercise",
        description: "treino, energia e rotina",
        vocabulary: [
          { word: "workout", meaning: "treino", example: "I do a short workout every morning." },
          { word: "stretch", meaning: "alongar", example: "Don't forget to stretch after running." },
          { word: "stamina", meaning: "resistência", example: "My stamina improved a lot." }
        ],
        pronunciationTips: ["workout /uerkaut/", "stretch /stretch/", "stamina /stamina/"],
        rolePlays: [
          "Você pede recomendações de treino para iniciantes.",
          "Você orienta um colega sobre treino e recuperação."
        ]
      },
      {
        id: "doctor-visit",
        label: "Doctor Visit",
        description: "sintomas, consulta e orientações",
        vocabulary: [
          { word: "symptom", meaning: "sintoma", example: "My main symptom is a sore throat." },
          { word: "prescription", meaning: "receita médica", example: "Could you explain this prescription?" },
          { word: "appointment", meaning: "consulta agendada", example: "I need to book an appointment." }
        ],
        pronunciationTips: ["symptom /simptom/", "throat /throut/", "appointment /apointment/"],
        rolePlays: [
          "Você descreve sintomas ao médico em inglês.",
          "Você é médico e orienta o paciente com clareza."
        ]
      }
    ]
  },
  {
    id: "culture",
    label: "Culture & Leisure",
    topics: [
      {
        id: "movies",
        label: "Movies",
        description: "gêneros, críticas e recomendações",
        vocabulary: [
          { word: "plot", meaning: "enredo", example: "The plot is simple but emotional." },
          { word: "cast", meaning: "elenco", example: "The cast did a fantastic job." },
          { word: "soundtrack", meaning: "trilha sonora", example: "The soundtrack is unforgettable." }
        ],
        pronunciationTips: ["plot /plot/", "genre /janra/", "cast /kast/"],
        rolePlays: [
          "Você recomenda um filme para alguém com gosto diferente.",
          "Você debate se o final do filme foi bom ou ruim."
        ]
      },
      {
        id: "music",
        label: "Music",
        description: "estilos, letras e experiências",
        vocabulary: [
          { word: "lyrics", meaning: "letras da música", example: "I focus on the lyrics to learn English." },
          { word: "beat", meaning: "batida", example: "The beat makes the song catchy." },
          { word: "live concert", meaning: "show ao vivo", example: "I went to a live concert last month." }
        ],
        pronunciationTips: ["lyrics /liriks/", "beat /biit/", "concert /konsert/"],
        rolePlays: [
          "Você compra ingresso para um show em inglês.",
          "Você entrevista um amigo sobre artista favorito."
        ]
      }
    ]
  }
];
