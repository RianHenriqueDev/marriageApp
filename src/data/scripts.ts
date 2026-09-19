export interface ScriptLine {
  id: string;
  gender: "M" | "F" | "ALL";
  title: string;
  initialMessage: string;
  choiceA: string; // Resposta empolgada do jogador
  choiceB: string; // Resposta irônica/duvidosa
  reactionA: string; // Reação dos noivos para choiceA
  reactionB: string; // Reação dos noivos para choiceB
  taunts: string[]; // Frases de esquiva do botão recusar
  acceptedMessage: string;
  declinedMessage: string;
}

// 15 Roteiros Masculinos + 15 Roteiros Femininos (30 Roteiros Únicos)
const M_SCRIPTS: Omit<ScriptLine, "gender">[] = [
  {
    id: "m_01",
    title: "Missão: Chopp Gelado",
    initialMessage: "Irmão! Você realmente achou que escaparia desse dia histórico? O chopp artesanal já tá na temperatura ideal!",
    choiceA: "Já tô com a caneca na mão!",
    choiceB: "Vai ter chopp puro malte mesmo?",
    reactionA: "Sabia que podia contar com você, guerreiro! A pista tá prometendo!",
    reactionB: "Aqui não tem economia não, meu parceiro! Só o melhor pro nosso esquadrão!",
    taunts: [
      "Opa, errou o botão! O verde tá bem ali do lado 👀",
      "Como assim recusar? Nem vem, a gravata já tem seu nome!",
      "Se você faltar, quem vai dar trabalho no open bar?",
      "Sistema corrompido: A opção 'Não vou' foi desabilitada para você!",
      "A noiva já avisou: falta só dá direito a processo extrajudicial! 😂",
    ],
    acceptedMessage: "AÍ SIM! Sabia que não ia nos deixar na mão. Prepara o terno que 12/12/2026 vai ser lendário!",
    declinedMessage: "Poxa meu parceiro... vamos sentir sua falta na festa! Mas o convite fica no coração.",
  },
  {
    id: "m_02",
    title: "Guerreiro no Altar",
    initialMessage: "Grande guerreiro! Chegou o momento em que até os mais bravos se curvam ao altar. Você é peça fundamental nessa comemoração!",
    choiceA: "Missão dada é missão cumprida!",
    choiceB: "Quem diria você casando, hein?!",
    reactionA: "Assim que se fala! Soldado leal não abandona o comandante!",
    reactionB: "Pois é, rapaz! O jogo virou, mas a amizade é eterna!",
    taunts: [
      "Clique errado detectado! Calibrando mira...",
      "Recusar comida e bebida de graça? Você tá passando bem?",
      "O botão vermelho tá com defeito de fábrica, clica no verde!",
      "Aviso: Recusar este convite reduz seus pontos de amizade em 99%!",
      "Nem o VAR anula essa presença sua, irmão!",
    ],
    acceptedMessage: "Presença confirmada com louvor! O noivo agradece o reforço moral.",
    declinedMessage: "Uma baixa dolorosa no pelotão... sentiremos sua falta!",
  },
  {
    id: "m_03",
    title: "Terno de Gala & Boteco",
    initialMessage: "Meu amigo, tira a poeira do terno ou aluga um maneiro, porque 12/12/2026 a resenha vai até o sol raiar!",
    choiceA: "Vou mais elegante que o noivo!",
    choiceB: "Pode ir de tênis confortável?",
    reactionA: "Opa, não abuse da ousadia! Mas vem com estilo que o flash tá garantido!",
    reactionB: "Tênis liberado na pista de dança, o que importa é não ficar parado!",
    taunts: [
      "Tentou recusar? O terno já tá reservado no seu CPF!",
      "Errou feio, errou rude! O botão certo é o verde!",
      "Recusa não autorizada pelo Game Master!",
    ],
    acceptedMessage: "CONFIRMADO! O time dos elegantes acaba de ganhar um reforço de peso.",
    declinedMessage: "Poxa... uma grande perda pra nossa resenha. Sentiremos sua falta!",
  },
  {
    id: "m_04",
    title: "Operação Aliança",
    initialMessage: "Atenção recruta! Você foi convocado para a Operação Aliança em Ribeirão Preto. Falta sem justificativa militar dá cadeia!",
    choiceA: "Apresentando-se para o serviço!",
    choiceB: "Qual é o plano tático da comida?",
    reactionA: "Excelente! Pelotão pronto para o brinde mais importante da década!",
    reactionB: "O buffet tá estratégico: salgadinhos infinitos e churrasco de primeira!",
    taunts: [
      "Tentativa de deserção bloqueada pelo sistema!",
      "O capitão não autorizou seu recuo!",
      "Volte pro front, o botão verde te espera!",
    ],
    acceptedMessage: "RECRUTA CONFIRMADO! Sua presença tá carimbada no relatório oficial.",
    declinedMessage: "Baixa confirmada... Sentiremos sua falta no fronte!",
  },
  {
    id: "m_05",
    title: "Churrasco & Gravata",
    initialMessage: "Fala meu caro! Nada de compromisso inventado no dia 12/12. Sua vaga na mesa VIP tá guardada!",
    choiceA: "Pode colocar meu nome no topo!",
    choiceB: "Vai ter sobremesa reforçada?",
    reactionA: "É disso que eu tô falando! Homem de palavra!",
    reactionB: "Bolo, docinhos e mesa de brigadeiro gourmet à vontade!",
    taunts: [
      "Cuidado: clicar em recusar cancela seu rodízio de comida!",
      "O botão fugiu porque sabe que você quer ir sim!",
      "Não aceito atestado médico nem de viagem!",
    ],
    acceptedMessage: "PRESENÇA VIP CONFIRMADA! Nos vemos às 10:30h com energia total!",
    declinedMessage: "Que pena meu amigo! Agradecemos o carinho.",
  },
  {
    id: "m_06",
    title: "O Golpe da Gravata",
    initialMessage: "Irmão, prepare o bolso e o coração! Vai rolar passagem de gravata e você tem cota de honra!",
    choiceA: "Já separei a contribuição!",
    choiceB: "Aceita Pix e criptomoeda?",
    reactionA: "Isso que é padrinho/amigo de ouro! Você é o cara!",
    reactionB: "Aceitamos Pix, cartão e abraço apertado!",
    taunts: ["Errou! Tente o botão do Sim!", "A gravata já tá te esperando!"],
    acceptedMessage: "BOM DEMAIS! Garantia de risada alta e memórias pra vida inteira!",
    declinedMessage: "Sentiremos muito a sua falta meu parceiro!",
  },
  {
    id: "m_07",
    title: "Fim da Vida de Solteiro",
    initialMessage: "O último dos românticos finalmente foi laçado! Preciso do meu melhor parceiro do lado pra dar testemunho!",
    choiceA: "Eu vou pra aplaudir de pé!",
    choiceB: "Ainda dá tempo de correr? Brincadeira!",
    reactionA: "Valeu demais! Sua energia faz toda a diferença pra nós!",
    reactionB: "Nem pense nisso, Jeniffer é o amor da minha vida! Só alegria!",
    taunts: ["Opção desativada pelo noivo!", "Nem vem com essa!"],
    acceptedMessage: "CONFIRMADO! Vai ser emocionante ter você conosco!",
    declinedMessage: "Uma pena, amigo! Mas obrigado pelo carinho.",
  },
  {
    id: "m_08",
    title: "Mestre Cervejeiro",
    initialMessage: "Homem de bom gosto! Encomendei uma seleção especial de bebidas pensando em quem entende do assunto.",
    choiceA: "Serei o sommelier oficial da festa!",
    choiceB: "Tem bebida sem álcool também?",
    reactionA: "Sabia! Já deixei a torneira reservada no seu nome!",
    reactionB: "Claro! Sucos especiais, drinks sem álcool e refrigerantes trincando!",
    taunts: ["O botão vermelho tá amaldiçoado!", "Clica no verde meu nobre!"],
    acceptedMessage: "VALIDADO! O setor de alegria ganhou seu comandante.",
    declinedMessage: "Uma pena não poder brindar junto! Sentiremos falta.",
  },
  {
    id: "m_09",
    title: "O Padrinho de Ouro",
    initialMessage: "Meu irmão de caminhada! Esse dia só tem sentido se você estiver lá compartilhando esse altar com a gente.",
    choiceA: "Tô junto até o fim do mundo!",
    choiceB: "Já tô treinando o discurso!",
    reactionA: "Tamo junto pra sempre! Dia histórico!",
    reactionB: "Só não vale me fazer chorar antes dos votos!",
    taunts: ["Botão de recusa indisponível para lendas!", "Sem chance de você faltar!"],
    acceptedMessage: "CONFIRMADÍSSIMO! Irmandade selada no altar.",
    declinedMessage: "Coração aperta, mas sabemos que estará em pensamento!",
  },
  {
    id: "m_10",
    title: "Liga dos Campeões",
    initialMessage: "Escalação oficial dos noivos convocada! Você tá no time titular camisa 10.",
    choiceA: "Entro em campo pra vencer!",
    choiceB: "Quem é o capitão do time?",
    reactionA: "Golaço! Vai ser goleada de amor e diversão!",
    reactionB: "A noiva apita o jogo, claro! Mas o time joga junto!",
    taunts: ["Cartão vermelho pra quem recusar!", "Impedimento! Clica no verde!"],
    acceptedMessage: "TITULAR CONFIRMADO! Bota o uniforme de gala e vem.",
    declinedMessage: "Desfalque de peso no campeonato...",
  },
  {
    id: "m_11",
    title: "Expedição Ribeirão Preto",
    initialMessage: "A rota para o 1º Cartório de Ribeirão Preto já tá traçada no GPS. Só falta confirmar o piloto!",
    choiceA: "Tanque cheio e rumo à festa!",
    choiceB: "Rua Visconde de Inhaúma, né?",
    reactionA: "Aí sim! Viagem com destino certo pra felicidade!",
    reactionB: "Exatamente, nº 1315, facinho de achar e pertinho de tudo!",
    taunts: ["Recalculando rota... escolha Sim!", "Desvio não permitido!"],
    acceptedMessage: "CHECK-IN FEITO! Estrada limpa e coração ansioso pra te ver.",
    declinedMessage: "Sentiremos falta da sua companhia na viagem!",
  },
  {
    id: "m_12",
    title: "Boss Battle do Amor",
    initialMessage: "Nível final desbloqueado: Cerimônia Matrimonial! Precisamos de um guerreiro de alto nível na nossa party.",
    choiceA: "Equipado com poções de animação!",
    choiceB: "Qual o loot desse evento?",
    reactionA: "Perfeito! A barra de HP da festa nunca vai cair!",
    reactionB: "Loot lendário: docinhos, risadas e lembranças épicas!",
    taunts: ["Você não pode fugir dessa batalha!", "Comando Run falhou!"],
    acceptedMessage: "QUEST ACEITA COM SUCESSO! EXP +9999 para a nossa amizade!",
    declinedMessage: "Que pena, nobre herói! Sentiremos sua ausência na raid.",
  },
  {
    id: "m_13",
    title: "Dança dos Famosos",
    initialMessage: "Atenção: o DJ já tá avisado que a sua presença na pista de dança é patrimônio cultural da festa!",
    choiceA: "Vou ensinar passinhos novos!",
    choiceB: "Danço mal, mas danço feliz!",
    reactionA: "Quero ver segurar o groove! Vai ser épico!",
    reactionB: "É dessa animação sincera que a gente precisa!",
    taunts: ["O botão vermelho tem dois pés esquerdos!", "Vem dançar, clica no SIM!"],
    acceptedMessage: "CONFIRMADO! O ritmo da comemoração tá garantido.",
    declinedMessage: "A pista vai sentir sua falta meu amigo!",
  },
  {
    id: "m_14",
    title: "Cavalheiro da Távola",
    initialMessage: "Saudações, nobre lorde! Sua honra e amizade iluminam o reino de Rian & Jeniffer neste grande dia.",
    choiceA: "Pela honra e pela celebração!",
    choiceB: "Levarei meus melhores votos!",
    reactionA: "O reino se alegra com a sua bravura e carinho!",
    reactionB: "Sua bênção é valiosa demais para nós!",
    taunts: ["O dragão da recusa foi derrotado!", "Ceda ao chamado do rei!"],
    acceptedMessage: "SAUDAÇÃO REAL! Sua cadeira na távola tá garantida.",
    declinedMessage: "O reino lamenta sua ausência com grande respeito.",
  },
  {
    id: "m_15",
    title: "O Grande Brinde",
    initialMessage: "Amigo de fé! Já separei as taças pra gente brindar esse novo capítulo. Você não pode faltar!",
    choiceA: "Tim-tim! Um brinde ao amor de vocês!",
    choiceB: "Vai ter discurso emocionante?",
    reactionA: "Que assim seja! Que venha muita luz e alegria pra todos nós!",
    reactionB: "Vai ter lágrima e muita risada com certeza!",
    taunts: ["Não derrube a taça! Clica no SIM!", "Brinde recusado não dá sorte!"],
    acceptedMessage: "BRINDE CONFIRMADO! 12/12/2026 será inesquecível.",
    declinedMessage: "Sentiremos falta do seu abraço nesse dia especial.",
  },
];

const F_SCRIPTS: Omit<ScriptLine, "gender">[] = [
  {
    id: "f_01",
    title: "Amiga do Coração",
    initialMessage: "Amiga do céu! O grande dia está chegando e nós NÃO poderíamos viver esse sonho sem você do nosso lado!",
    choiceA: "Já tô escolhendo o vestido!",
    choiceB: "Promete que não vai me fazer chorar?",
    reactionA: "Você vai arrasar demais! Prepara o salto que vamos dançar muito!",
    reactionB: "Amiga, eu já tô chorando só de pensar! Leva lencinho à prova d'água!",
    taunts: [
      "Amiga??? Você tentou clicar em 'Não'? Fingi que não vi!",
      "O vestido lindo que você vai comprar não merece ficar no armário!",
      "Se você não for, quem vai cantar com a noiva até ficar rouca?",
      "Alerta de amizade: recusar convite pode cancelar fofocas semanais!",
      "Ops, botão de 'Recusar' escorregou! Clica no SIM logo mulher!",
    ],
    acceptedMessage: "EBAAA! Que alegria sem fim! Pode separar o sapato confortável porque vamos comemorar até o amanhecer!",
    declinedMessage: "Ai amiga, que pena... nosso coração fica apertadinho, mas te mandaremos muitas fotos!",
  },
  {
    id: "f_02",
    title: "Mesa dos Docinhos VIP",
    initialMessage: "Mulher maravilhosa! Nosso grande dia só estará completo com o seu brilho, sua risada contagiante e seu carinho!",
    choiceA: "Tô pronta pra celebrar!",
    choiceB: "Me diz que vai ter bem-casado!",
    reactionA: "Você traz uma luz incrível pras nossas vidas! Que venha o dia 12!",
    reactionB: "Vai ter bem-casado fofinho, brigadeiro de pistache e muito mais!",
    taunts: [
      "Menina, nem vem com essa de 'Não vou'!",
      "O buffet de docinhos gourmet já foi encomendado pensando em você!",
      "Não aceitamos atestado de cabelereiro nem preguiça!",
      "Esse botão 'Não' é meramente ilustrativo, nem gasta energia nele!",
    ],
    acceptedMessage: "PRESENÇA VIP CONFIRMADA! Nos vemos em 12/12/2026 para celebrar o amor!",
    declinedMessage: "Sentiremos muito sua falta, amiga querida!",
  },
  {
    id: "f_03",
    title: "Madrinha dos Sonhos",
    initialMessage: "Você acompanhou nossa história desde o comecinho e não teria graça nenhuma casar sem você pertinho da gente!",
    choiceA: "Acompanhei e aprovei cada capítulo!",
    choiceB: "Quem diria que esse casalzão ia casar!",
    reactionA: "Você é testemunha desse milagre do amor! Amamos você!",
    reactionB: "Deus caprichou demais no nosso encontro! Vem com tudo!",
    taunts: ["Nem tenta fugir, você é peça de família!", "O botão vermelho escorregou de novo!"],
    acceptedMessage: "QUE AMOR! Presença garantida no coração e na cerimônia!",
    declinedMessage: "Coração doeu aqui, amiga... Mas guardamos seu carinho!",
  },
  {
    id: "f_04",
    title: "Produção de Diva",
    initialMessage: "Mulher, cancela qualquer compromisso porque 12/12/2026 é dia de produção de gala e muita foto no feed!",
    choiceA: "Já reservei meu maquiador!",
    choiceB: "Vai ter cantinho instagramável?",
    reactionA: "Maravilhosa! Vamos ficar perfeitas nas fotos do casamento!",
    reactionB: "Vai ter cenário florido, iluminação de cinema e poses infinitas!",
    taunts: ["Não desperdice esse look incrível!", "O botão SIM tá te chamando!"],
    acceptedMessage: "DIVA CONFIRMADA! Prepare os flashes e a alegria!",
    declinedMessage: "Uma baixa na lista das mais elegantes... sentimos sua falta!",
  },
  {
    id: "f_05",
    title: "O Buquê da Sorte",
    initialMessage: "Amiga! Já vou avisando que na hora de jogar o buquê eu vou mirar na sua direção com precisão a laser!",
    choiceA: "Tô pronta pra agarrar no ar!",
    choiceB: "Deixa eu dar um passo pra trás então haha!",
    reactionA: "Haha, a próxima é você com certeza! Já entra na fila!",
    reactionB: "Nada disso! A sorte vai te alcançar quer você queira ou não!",
    taunts: ["Recusar dá 7 anos sem buquê!", "Clica no verde amiga linda!"],
    acceptedMessage: "CONFIRMADA! Que alegria ter você nesse momento mágico.",
    declinedMessage: "Ah amiga... sentiremos tanto a sua falta!",
  },
  {
    id: "f_06",
    title: "Música & Emoção",
    initialMessage: "Menina, já prepara a playlist no coração porque o casamento vai ter trilha sonora de chorar de emoção!",
    choiceA: "Vou levar pacote família de lencinho!",
    choiceB: "Quem vai entrar cantando?",
    reactionA: "Sensata! O choro de felicidade vai rolar solto com certeza!",
    reactionB: "Surpresa mágica que preparamos com todo o carinho!",
    taunts: ["Lágrimas só de alegria, recusa não!", "Vem cantar com a noiva!"],
    acceptedMessage: "CONFIRMADÍSSIMA! O abraço mais apertado te espera.",
    declinedMessage: "Uma pena não te ver lá... Sentiremos sua falta!",
  },
  {
    id: "f_07",
    title: "Amor & Cumplicidade",
    initialMessage: "Sua amizade é daquelas raras e preciosas. Ver você testemunhando o nosso 'Sim' vai ser indescritível.",
    choiceA: "Não perderia por nada nesse mundo!",
    choiceB: "Estou tão feliz por vocês dois!",
    reactionA: "Que lindo ler isso! Você aquece nossos corações!",
    reactionB: "A felicidade se multiplica quando compartilhada com gente do bem!",
    taunts: ["Botão de recusa indisponível por excesso de carinho!", "Clica no Sim!"],
    acceptedMessage: "PRESENÇA ABENÇOADA! Nos vemos no grande dia!",
    declinedMessage: "Agradecemos muito pelo carinho sincero, amiga!",
  },
  {
    id: "f_08",
    title: "Operação Sandália Rasteira",
    initialMessage: "Dica de ouro: vai de salto lindo na cerimônia, mas leva a rasteirinha na bolsa pra se acabar na pista!",
    choiceA: "Estratégia infalível de festa!",
    choiceB: "Danço de salto até o fim!",
    reactionA: "Mulher prevenida vale por duas! A pista vai ferver!",
    reactionB: "Guerreira master! Quero ver essa energia no salão!",
    taunts: ["O botão vermelho tá descalço e cansado!", "Vem dançar no verde!"],
    acceptedMessage: "CONFIRMADO COM SUCESSO! A animação tá garantida.",
    declinedMessage: "Que pena amiga! Sentiremos sua energia linda.",
  },
  {
    id: "f_09",
    title: "Família & Coração",
    initialMessage: "Você é muito mais que uma amiga querida, é parte da história da nossa família. Sua presença é essencial!",
    choiceA: "Contem comigo para o que der e vier!",
    choiceB: "Tô orgulhosa demais de vocês!",
    reactionA: "Amizade pra vida toda! Um presente de Deus!",
    reactionB: "Obrigada por cada palavra de apoio até aqui!",
    taunts: ["Família não recusa convite sagrado!", "Clica no SIM logo!"],
    acceptedMessage: "AMOR CONFIRMADO! Nos vemos em 12/12/2026.",
    declinedMessage: "Sentiremos muito a sua falta nesse momento.",
  },
  {
    id: "f_10",
    title: "Feiticeira da Alegria",
    initialMessage: "Alerta mágico: sua presença traz +100 de carisma e luz para a nossa comemoração matrimonial!",
    choiceA: "Poção de felicidade pronta!",
    choiceB: "Vocês que são mágicos juntos!",
    reactionA: "Com esse buff a nossa festa vai ser inesquecível!",
    reactionB: "Obrigada, sua fofa! O amor transborda por aqui!",
    taunts: ["Magia de esquiva ativada! O botão fugiu!", "Aceite a quest mágica!"],
    acceptedMessage: "PRESENÇA MÁGICA CONFIRMADA! Nível máximo de amor!",
    declinedMessage: "Faltará uma fada madrinha na festa... Te amamos!",
  },
  {
    id: "f_11",
    title: "Manhã de Sol em Ribeirão",
    initialMessage: "Sábado ensolarado, 10:30h, pessoas queridas e o casamento de Rian & Jeniffer. Perfeição pura!",
    choiceA: "Cenário perfeito pra celebrar!",
    choiceB: "Já anotei tudo no calendário!",
    reactionA: "Vai ser um dia de cinema! Deus preparou cada detalhe.",
    reactionB: "Coloca alarme e vem linda que o cartório nos espera!",
    taunts: ["Não atrase e não recuse!", "O botão verde é o caminho da luz!"],
    acceptedMessage: "PRESENÇA ILUMINADA CONFIRMADA! Nos vemos às 10:30h!",
    declinedMessage: "Uma pena não estar conosco nessa manhã especial.",
  },
  {
    id: "f_12",
    title: "Amor Verdadeiro",
    initialMessage: "Depois de tantas conversas e orações, o grande dia chegou! Obrigada por sempre torcer pelo nosso amor.",
    choiceA: "Sempre soube que era pra sempre!",
    choiceB: "Meu coração se enche de alegria!",
    reactionA: "Suas palavras nos emocionam! Valeu por acreditar conosco!",
    reactionB: "A nossa também transborda de gratidão a você!",
    taunts: ["Não recuse esse abraço que te espera!", "Clica no SIM com carinho!"],
    acceptedMessage: "BÊNÇÃO CONFIRMADA! Seu lugar de honra tá reservado.",
    declinedMessage: "Obrigado de coração por todo carinho sempre!",
  },
  {
    id: "f_13",
    title: "Canto dos Pássaros",
    initialMessage: "Querida amiga, queremos celebrar esse amor puro e leve com quem faz nossa vida mais doce!",
    choiceA: "Comemorar o amor é a melhor coisa da vida!",
    choiceB: "Estarei lá na primeira fila!",
    reactionA: "Com você por perto, tudo fica ainda mais leve e bonito!",
    reactionB: "Vou adorar olhar pro lado e ver seu sorriso!",
    taunts: ["O botão vermelho tá sem melodia!", "Vem cantar no botão verde!"],
    acceptedMessage: "CONFIRMADÍSSIMA! Que alegria te ter conosco!",
    declinedMessage: "Sentiremos falta da sua doçura na nossa celebração.",
  },
  {
    id: "f_14",
    title: "Brilho no Olhar",
    initialMessage: "A noiva tá ansiosa e precisa de todo apoio das amigas mais fiéis pra segurar a emoção!",
    choiceA: "Tô a postos pra cuidar da noiva!",
    choiceB: "Respira fundo que vai ser lindo!",
    reactionA: "Menina, que alívio ter você! Você é um anjo!",
    reactionB: "Tô respirando e contando os minutos pro dia 12!",
    taunts: ["A noiva vetou qualquer recusa!", "Socorro, clica no SIM!"],
    acceptedMessage: "APOIO EMOCIONAL E AMOR CONFIRMADOS! Te amamos!",
    declinedMessage: "Sentiremos saudade de você nesse dia marcante.",
  },
  {
    id: "f_15",
    title: "Eternamente Amigas",
    initialMessage: "Anos de amizade nos trouxeram até aqui. Compartilhar esse casamento com você é um sonho realizado!",
    choiceA: "Amigas pra sempre, na alegria e no altar!",
    choiceB: "Que momento único nas nossas vidas!",
    reactionA: "Pra sempre mesmo! Que dia inesquecível vai ser!",
    reactionB: "Único, sagrado e cheio de afeto sincero!",
    taunts: ["Amizade eterna não clica em não!", "O verde é o botão do amor!"],
    acceptedMessage: "PRESENÇA ETERNA CONFIRMADA! Até 12/12/2026!",
    declinedMessage: "Nosso coração fica com saudades, amiga!",
  },
];

export const SCRIPTS: Record<string, ScriptLine> = {};

M_SCRIPTS.forEach((s) => {
  SCRIPTS[s.id] = { ...s, gender: "M" };
});

F_SCRIPTS.forEach((s) => {
  SCRIPTS[s.id] = { ...s, gender: "F" };
});

// Script Geral Default
SCRIPTS.default = {
  id: "default",
  gender: "ALL",
  title: "Aventuras do Matrimônio",
  initialMessage: "Você é muito especial para nós e é uma honra ter você celebrando o nosso amor em 12 de Dezembro de 2026!",
  choiceA: "Estarei presente com certeza!",
  choiceB: "Que honra receber esse convite!",
  reactionA: "Maravilha! Sua presença torna esse momento completo!",
  reactionB: "A honra é toda nossa em ter você ao nosso lado!",
  taunts: [
    "Opa! Acho que seu dedo escorregou no botão errado!",
    "Tem certeza? Vai ter muita comida boa, música e momentos inesquecíveis!",
    "O botão de recusar parece meio fujão hoje, hein?",
    "Vamos lá, clica no verde! A gente quer muito te ver!",
  ],
  acceptedMessage: "Que felicidade! Sua presença torna esse momento ainda mais inesquecível.",
  declinedMessage: "Compreendemos e agradecemos muito pelo carinho. Sentiremos sua falta!",
};

export function getScriptForGuest(scriptId?: string | null, gender?: "M" | "F"): ScriptLine {
  if (scriptId && SCRIPTS[scriptId]) {
    return SCRIPTS[scriptId];
  }
  if (gender === "M") {
    return SCRIPTS.m_01;
  }
  if (gender === "F") {
    return SCRIPTS.f_01;
  }
  return SCRIPTS.default;
}

// Algoritmo que escolhe um roteiro que ainda não foi usado ou com menor frequência
export function pickUniqueScript(gender: "M" | "F", usedScriptIds: string[]): string {
  const pool = gender === "M" ? M_SCRIPTS : F_SCRIPTS;
  const unused = pool.filter((s) => !usedScriptIds.includes(s.id));

  if (unused.length > 0) {
    const randomIndex = Math.floor(Math.random() * unused.length);
    return unused[randomIndex].id;
  }

  // Se todos os 15 já foram usados, escolhe aleatoriamente do pool para balancear
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex].id;
}
