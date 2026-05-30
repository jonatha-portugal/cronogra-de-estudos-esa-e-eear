export type Topic = {
  text: string;
  tag: 'AMBOS' | 'EEAR' | 'ESA';
};

export type Module = {
  title: string;
  desc: string;
  topics: Topic[];
};

export type Subject = {
  id: string;
  icon: string;
  title: string;
  description: string;
  modules: Module[];
};

export const syllabusData: Record<string, Subject> = {
  matematica: {
    id: 'matematica',
    icon: '➗',
    title: 'Matemática',
    description: 'Trilha unificada de Matemática. Organizada desde as bases aritméticas e algébricas, avançando pela geometria plana e espacial, até os tópicos analíticos e avançados exigidos por ambas as bancas.',
    modules: [
      {
        title: 'Módulo 1: Fundamentos Numéricos e Conjuntos',
        desc: 'A base necessária antes de avançar para álgebra.',
        topics: [
          { text: 'Noções de Conjuntos (representação, subconjuntos, união, interseção, diferença)', tag: 'AMBOS' },
          { text: 'Conjunto dos Números Naturais e Inteiros (operações, primos, fatoração, MMC, MDC)', tag: 'AMBOS' },
          { text: 'Conjunto dos Números Racionais e Reais (operações, intervalos)', tag: 'AMBOS' },
          { text: 'Razões e Proporções, Grandezas proporcionais', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 2: Álgebra Básica e Funções I',
        desc: 'Introdução ao pensamento algébrico e análise gráfica.',
        topics: [
          { text: 'Conceito de Função (domínio, imagem, relação)', tag: 'AMBOS' },
          { text: 'Tipos de Funções (injetora, sobrejetora, bijetora, par, ímpar, composta, inversa)', tag: 'AMBOS' },
          { text: 'Função do 1º Grau / Linear / Afim (gráficos, raízes, estudo do sinal)', tag: 'AMBOS' },
          { text: 'Função do 2º Grau / Quadrática (máximos/mínimos, raízes, vértices)', tag: 'AMBOS' },
          { text: 'Resolução de Equações e Inequações (produto e quociente)', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 3: Álgebra II (Exponencial e Logaritmo)',
        desc: 'Funções transcendentes elementares.',
        topics: [
          { text: 'Função Modular (definição, gráfico, equações e inequações)', tag: 'AMBOS' },
          { text: 'Função Exponencial (propriedades, gráfico, equações)', tag: 'AMBOS' },
          { text: 'Logaritmos (definição e propriedades operatórias)', tag: 'AMBOS' },
          { text: 'Função Logarítmica (gráficos, equações e inequações)', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 4: Geometria Plana',
        desc: 'Estudo das formas no plano (2D).',
        topics: [
          { text: 'Ângulos (definição e propriedades), Paralelismo e Perpendicularidade', tag: 'AMBOS' },
          { text: 'Triângulos (condições, classificação, congruência, semelhança, pontos notáveis)', tag: 'AMBOS' },
          { text: 'Relações Métricas nos Triângulos (Teorema de Pitágoras)', tag: 'AMBOS' },
          { text: 'Polígonos e Quadriláteros Notáveis', tag: 'AMBOS' },
          { text: 'Circunferência e Círculo (ângulos, tangência, comprimento)', tag: 'AMBOS' },
          { text: 'Cálculo de Perímetro e Área de figuras planas', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 5: Trigonometria',
        desc: 'Relação entre ângulos e medidas.',
        topics: [
          { text: 'Razões Trigonométricas no triângulo retângulo', tag: 'AMBOS' },
          { text: 'Arcos, Ângulos (graus/radianos) e Ciclo Trigonométrico', tag: 'AMBOS' },
          { text: 'Funções Trigonométricas e Identidades Fundamentais', tag: 'AMBOS' },
          { text: 'Fórmulas de adição, subtração, arco duplo e metade', tag: 'AMBOS' },
          { text: 'Leis dos Senos e Cossenos (resolução de triângulos quaisquer)', tag: 'AMBOS' },
          { text: 'Equações e Inequações Trigonométricas', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 6: Geometria Espacial',
        desc: 'Estudo das formas no espaço (3D).',
        topics: [
          { text: 'Geometria de Posição (posições relativas entre retas e planos, projeção)', tag: 'ESA' },
          { text: 'Poliedros (conceitos e propriedades)', tag: 'AMBOS' },
          { text: 'Prismas e Pirâmides (áreas e volumes)', tag: 'AMBOS' },
          { text: 'Corpos Redondos: Cilindro, Cone e Esfera (áreas e volumes)', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 7: Geometria Analítica',
        desc: 'União da álgebra com a geometria no plano cartesiano.',
        topics: [
          { text: 'Estudo do Ponto (distância, ponto médio, alinhamento)', tag: 'AMBOS' },
          { text: 'Estudo da Reta (equações, posições relativas, distância ponto-reta)', tag: 'AMBOS' },
          { text: 'Estudo da Circunferência (equações, posições relativas)', tag: 'AMBOS' },
          { text: 'Cônicas: Elipse, Hipérbole e Parábola', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 8: Matrizes, Sistemas e Sequências',
        desc: 'Organização de dados e progressões.',
        topics: [
          { text: 'Sequências Numéricas e Progressões (PA e PG)', tag: 'AMBOS' },
          { text: 'Matrizes (operações, matriz inversa)', tag: 'AMBOS' },
          { text: 'Determinantes (definição e propriedades)', tag: 'AMBOS' },
          { text: 'Sistemas Lineares', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 9: Análise Combinatória, Probabilidade e Estatística',
        desc: 'Contagem e análise de dados.',
        topics: [
          { text: 'Análise Combinatória (PFC, Fatorial, Arranjos, Combinações, Permutações)', tag: 'AMBOS' },
          { text: 'Probabilidade (conceitos, condicional, união de eventos)', tag: 'AMBOS' },
          { text: 'Binômio de Newton', tag: 'ESA' },
          { text: 'Estatística (gráficos, tabelas, médias, moda, mediana)', tag: 'AMBOS' },
          { text: 'Noções de Lógica (proposições, conectivos)', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 10: Álgebra Avançada',
        desc: 'Tópicos finais de nível médio.',
        topics: [
          { text: 'Números Complexos (operações, plano de Argand-Gauss, forma trigonométrica)', tag: 'AMBOS' },
          { text: 'Polinômios (identidade, operações, Teorema do Resto, Briot-Ruffini)', tag: 'AMBOS' },
          { text: 'Equações Polinomiais (Teorema fundamental, relações de Girard)', tag: 'AMBOS' },
        ]
      }
    ]
  },
  portugues: {
    id: 'portugues',
    icon: '📖',
    title: 'Língua Portuguesa & Literatura',
    description: 'Estruturação do estudo do idioma, partindo das unidades sonoras (Fonética), passando pela estrutura das palavras (Morfologia) e formação de frases (Sintaxe), até chegar à interpretação de textos e à Literatura (cobrada na ESA).',
    modules: [
      {
        title: 'Módulo 1: Compreensão e Interpretação Textual',
        desc: 'Habilidade base para toda a prova.',
        topics: [
          { text: 'Leitura, interpretação e análise de textos (literários e não literários)', tag: 'AMBOS' },
          { text: 'Tipologia textual e Gêneros textuais', tag: 'AMBOS' },
          { text: 'Teoria da linguagem (língua, discurso, estilo, níveis de linguagem)', tag: 'ESA' },
          { text: 'Funções da linguagem', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 2: Fonética e Ortografia',
        desc: 'Os sons e a escrita correta.',
        topics: [
          { text: 'Fonética (sílabas, encontros vocálicos/consonantais, tonicidade)', tag: 'AMBOS' },
          { text: 'Separação silábica', tag: 'AMBOS' },
          { text: 'Ortografia oficial e Acentuação gráfica', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 3: Morfologia (A Palavra)',
        desc: 'Estrutura, formação e classes.',
        topics: [
          { text: 'Estrutura e processos de formação de palavras', tag: 'AMBOS' },
          { text: 'Substantivo e Adjetivo (classificação e flexão)', tag: 'AMBOS' },
          { text: 'Pronomes (classificação e emprego)', tag: 'AMBOS' },
          { text: 'Verbos (flexão, classification, conjugação, tempos simples e compostos)', tag: 'AMBOS' },
          { text: 'Advérbios, Conjunções, Preposições', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 4: Sintaxe I (A Oração)',
        desc: 'Relação entre as palavras na frase.',
        topics: [
          { text: 'Frase, Oração e Período', tag: 'AMBOS' },
          { text: 'Termos essenciais, integrantes e acessórios da oração', tag: 'AMBOS' },
          { text: 'Período Composto: Coordenação e Subordinação', tag: 'AMBOS' },
          { text: 'Orações Reduzidas e Desenvolvidas', tag: 'AMBOS' },
          { text: 'Sintaxe de Colocação Pronominal', tag: 'AMBOS' },
          { text: 'Pontuação', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 5: Sintaxe II e Semântica',
        desc: 'Concordância, Regência e Sentido.',
        topics: [
          { text: 'Concordância Verbal e Nominal', tag: 'AMBOS' },
          { text: 'Regência Verbal e Nominal', tag: 'AMBOS' },
          { text: 'Uso da Crase', tag: 'AMBOS' },
          { text: 'Significado das palavras (Sinônimos, Antônimos, Parônimos, Homônimos)', tag: 'ESA' },
          { text: 'Estilística: Figuras de linguagem', tag: 'AMBOS' },
          { text: 'Tipos de discurso (Direto, Indireto, Indireto Livre)', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 6: Redação',
        desc: 'Produção textual cobrada nas provas.',
        topics: [
          { text: 'Coesão e Coerência textual (mecanismos de coesão, paralelismo)', tag: 'AMBOS' },
          { text: 'Texto Dissertativo-Argumentativo (estrutura, tese, argumentos)', tag: 'AMBOS' },
          { text: 'Denotação e Conotação', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 7: Literatura Brasileira',
        desc: 'Tópico exclusivo do concurso da ESA.',
        topics: [
          { text: 'Introdução à literatura: A arte literária e os gêneros', tag: 'ESA' },
          { text: 'Noções de versificação (estrutura, rima, estrofe)', tag: 'ESA' },
          { text: 'Quinhentismo e Barroco', tag: 'ESA' },
          { text: 'Arcadismo e Romantismo', tag: 'ESA' },
          { text: 'Realismo, Naturalismo e Parnasianismo', tag: 'ESA' },
          { text: 'Simbolismo, Pré-Modernismo e Modernismo', tag: 'ESA' },
        ]
      }
    ]
  },
  ingles: {
    id: 'ingles',
    icon: '🇺🇸',
    title: 'Língua Inglesa',
    description: 'Trilha compilada englobando o nível básico (ESA e EEAR-demais especialidades) e o nível intermediário (EEAR-BCT). A progressão vai da estrutura básica do substantivo até as orações complexas.',
    modules: [
      {
        title: 'Módulo 1: Fundamentos Gramaticais',
        desc: 'Elementos básicos da frase em inglês.',
        topics: [
          { text: 'Substantivos (Nouns): gênero, singular/plural, contáveis/incontáveis', tag: 'AMBOS' },
          { text: 'Caso Genitivo (Possessivo com \'s e of)', tag: 'AMBOS' },
          { text: 'Artigos Definidos e Indefinidos (The, a, an)', tag: 'AMBOS' },
          { text: 'Pronomes Pessoais (Sujeito e Objeto)', tag: 'AMBOS' },
          { text: 'Pronomes e Adjetivos Demonstrativos (this, that, etc)', tag: 'AMBOS' },
          { text: 'Pronomes e Adjetivos Possessivos (my, mine, etc)', tag: 'AMBOS' },
          { text: 'Quantificadores (Quantifiers)', tag: 'AMBOS' },
          { text: 'Numerais', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 2: Qualificadores e Modificadores',
        desc: 'Enriquecendo o vocabulário.',
        topics: [
          { text: 'Adjetivos: posição, graus de comparação', tag: 'AMBOS' },
          { text: 'Adjetivos formados por gerúndio e particípio', tag: 'EEAR' },
          { text: 'Sinônimos e antônimos', tag: 'ESA' },
          { text: 'Advérbios: formação, tipos, uso e graus de comparação', tag: 'AMBOS' },
          { text: 'Preposições (tempo, lugar, movimento)', tag: 'AMBOS' },
          { text: 'Conjunções', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 3: Tempos Verbais Simples e Contínuos',
        desc: 'Ações no presente, passado e futuro.',
        topics: [
          { text: 'Verbos Regulares e Irregulares', tag: 'AMBOS' },
          { text: 'Simple Present (Presente Simples)', tag: 'AMBOS' },
          { text: 'Present Continuous / Progressive', tag: 'AMBOS' },
          { text: 'Simple Past (Passado Simples)', tag: 'AMBOS' },
          { text: 'Past Continuous / Progressive', tag: 'AMBOS' },
          { text: 'Future (Simple com Will e Immediate com Going to)', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 4: Estruturas Verbais Intermediárias',
        desc: 'Perfeitos, modais e outras formas.',
        topics: [
          { text: 'Present Perfect', tag: 'AMBOS' },
          { text: 'Perfect Tenses (Past Perfect, Future Perfect)', tag: 'EEAR' },
          { text: 'Modal Verbs (can, could, must, may, might, should, etc)', tag: 'AMBOS' },
          { text: 'Infinitivo e Gerúndio', tag: 'AMBOS' },
          { text: 'Modos Imperativo e Subjuntivo', tag: 'AMBOS' },
        ]
      },
      {
        title: 'Módulo 5: Sintaxe Avançada e Textos',
        desc: 'Construções complexas e interpretação.',
        topics: [
          { text: 'Pronomes e Advérbios Interrogativos (Wh- questions)', tag: 'AMBOS' },
          { text: 'Pronomes Relativos e Reflexivos', tag: 'AMBOS' },
          { text: 'Orações Condicionais (If clauses: 0, 1 e 2)', tag: 'AMBOS' },
          { text: 'Voz Passiva', tag: 'AMBOS' },
          { text: 'Phrasal Verbs', tag: 'AMBOS' },
          { text: 'Question Tags e Tag Answers', tag: 'AMBOS' },
          { text: 'Discurso Direto e Indireto (Reported Speech)', tag: 'EEAR' },
          { text: 'Prefixos e Sufixos', tag: 'AMBOS' },
          { text: 'Compreensão de Textos (assuntos técnicos e gerais)', tag: 'AMBOS' },
        ]
      }
    ]
  },
  fisica: {
    id: 'fisica',
    icon: '⚛️',
    title: 'Física',
    description: 'Disciplina exclusiva do concurso da EEAR. Organizada seguindo a sequência clássica da Física no Ensino Médio: Mecânica (movimento e energia), Termologia (calor), Óptica/Ondas e Eletromagnetismo.',
    modules: [
      {
        title: 'Módulo 1: Introdução e Cinemática',
        desc: 'As bases da medição e a descrição do movimento.',
        topics: [
          { text: 'Grandezas Físicas, Unidades, Ordem de Grandeza e Notação Científica', tag: 'EEAR' },
          { text: 'Vetores: conceitos e operações básicas', tag: 'EEAR' },
          { text: 'Conceitos básicos (tempo, espaço, velocidade, aceleração)', tag: 'EEAR' },
          { text: 'MRU (Movimento Retilíneo Uniforme)', tag: 'EEAR' },
          { text: 'MRUV, Queda Livre e Lançamentos', tag: 'EEAR' },
          { text: 'MCU (Movimento Circular Uniforme)', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 2: Dinâmica',
        desc: 'As causas do movimento (Forças).',
        topics: [
          { text: 'Leis de Newton e Inércia', tag: 'EEAR' },
          { text: 'Tipos de Força (Peso, Normal, Tração, Atrito, Hooke/Elástica)', tag: 'EEAR' },
          { text: 'Quantidade de Movimento, Impulso e Colisões', tag: 'EEAR' },
          { text: 'Estática: Equilíbrio de ponto material e corpo extenso, Torque', tag: 'EEAR' },
          { text: 'Gravitação Universal e Leis de Kepler', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 3: Hidrostática, Trabalho e Energia',
        desc: 'Fluidos e as leis de conservação.',
        topics: [
          { text: 'Pressão, Densidade e Pressão Atmosférica', tag: 'EEAR' },
          { text: 'Princípios de Pascal, Arquimedes (Empuxo) e Stevin', tag: 'EEAR' },
          { text: 'Trabalho, Potência e Rendimento', tag: 'EEAR' },
          { text: 'Energia (Cinética e Potencial)', tag: 'EEAR' },
          { text: 'Conservação e Dissipação da Energia Mecânica', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 4: Termologia e Termodinâmica',
        desc: 'O estudo do calor e da temperatura.',
        topics: [
          { text: 'Calor, Temperatura e Escalas Termométricas', tag: 'EEAR' },
          { text: 'Dilatação Térmica', tag: 'EEAR' },
          { text: 'Calorimetria (Calor Específico e Latente, Mudanças de Estado)', tag: 'EEAR' },
          { text: 'Transferência de calor', tag: 'EEAR' },
          { text: 'Estudo dos Gases Ideais (Equação de Clapeyron)', tag: 'EEAR' },
          { text: 'Leis da Termodinâmica e Máquinas Térmicas (Ciclo de Carnot)', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 5: Ondulatória e Óptica',
        desc: 'Ondas, som e luz.',
        topics: [
          { text: 'Ondas: tipos, propagação, elementos (período, frequência, comprimento)', tag: 'EEAR' },
          { text: 'Fenômenos Ondulatórios (reflexão, refração, difração, interferência)', tag: 'EEAR' },
          { text: 'MHS (Movimento Harmônico Simples)', tag: 'EEAR' },
          { text: 'Acústica: Ondas sonoras, qualidades do som, Efeito Doppler', tag: 'EEAR' },
          { text: 'Óptica Geométrica: princípios, reflexão, espelhos planos e esféricos', tag: 'EEAR' },
          { text: 'Refração: lentes, prismas, formação de imagens, olho humano', tag: 'EEAR' },
        ]
      },
      {
        title: 'Módulo 6: Eletromagnetismo e Física Moderna',
        desc: 'Cargas, correntes e ímãs.',
        topics: [
          { text: 'Eletrostática: Carga, Lei de Coulomb, Campo e Potencial Elétrico', tag: 'EEAR' },
          { text: 'Capacitores', tag: 'EEAR' },
          { text: 'Eletrodinâmica: Corrente, Leis de Ohm, Resistores e Circuitos', tag: 'EEAR' },
          { text: 'Geradores, Receptores e Medidores elétricos', tag: 'EEAR' },
          { text: 'Magnetismo: Ímãs, Campo Magnético, Força Magnética', tag: 'EEAR' },
          { text: 'Eletromagnetismo: Lei de Faraday, Lei de Lenz, Indução', tag: 'EEAR' },
          { text: 'Física Moderna: Modelos atômicos, Espectro Eletromagnético, Radioatividade', tag: 'EEAR' },
        ]
      }
    ]
  },
  historia: {
    id: 'historia',
    icon: '🏛️',
    title: 'História do Brasil',
    description: 'Disciplina exclusiva do concurso da ESA. Organizada de forma estritamente cronológica, abrangendo desde o período pré-colonial até a Nova República.',
    modules: [
      {
        title: 'Módulo 1: Período Colonial',
        desc: 'Da chegada dos portugueses às rebeliões nativistas.',
        topics: [
          { text: 'Povos indígenas e o Brasil pré-colonial', tag: 'ESA' },
          { text: 'Administração colonial: Capitanias, Governo Geral, Câmaras', tag: 'ESA' },
          { text: 'Economia e Sociedade: Ciclo do Açúcar, Mineração, Economias Complementares', tag: 'ESA' },
          { text: 'Escravidão africana', tag: 'ESA' },
          { text: 'Expansão territorial: Entradas, Bandeiras, Tratados de Limites', tag: 'ESA' },
          { text: 'Invasões estrangeiras (Francesas e Holandesas)', tag: 'ESA' },
          { text: 'Rebeliões Nativistas (Beckman, Emboabas, Mascates, Vila Rica)', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 2: Independência e Império',
        desc: 'Formação do Estado brasileiro moderno.',
        topics: [
          { text: 'Movimentos Pró-Independência (Inconfidência Mineira, Conjuração Baiana)', tag: 'ESA' },
          { text: 'Período Joanino e o Processo de Independência', tag: 'ESA' },
          { text: 'O Primeiro Reinado (Constituição de 1824, Guerra da Cisplatina)', tag: 'ESA' },
          { text: 'Período Regencial (Ato Adicional, Revoltas Regenciais)', tag: 'ESA' },
          { text: 'O Segundo Reinado: Política (Conservadores x Liberais, Parlamentarismo)', tag: 'ESA' },
          { text: 'O Segundo Reinado: Economia Cafeeira, Era Mauá, Imigração', tag: 'ESA' },
          { text: 'Política Externa no Império: Guerra da Tríplice Aliança', tag: 'ESA' },
          { text: 'Abolição da Escravatura e Crise do Império', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 3: A Primeira República (1889-1930)',
        desc: 'A República Velha.',
        topics: [
          { text: 'República da Espada (Deodoro e Floriano) e Constituição de 1891', tag: 'ESA' },
          { text: 'República Oligárquica (Coronelismo, Café com Leite)', tag: 'ESA' },
          { text: 'Revoltas Sociais (Canudos, Contestado, Chibata, Vacina, Cangaço)', tag: 'ESA' },
          { text: 'Tenentismo e Coluna Prestes', tag: 'ESA' },
          { text: 'Crise de 1929 e a Revolução de 1930', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 4: Era Vargas e República Populista',
        desc: 'Industrialização e tensões políticas (1930-1964).',
        topics: [
          { text: 'Era Vargas: Governo Provisório, Constitucional (1934) e Estado Novo (1937)', tag: 'ESA' },
          { text: 'O Brasil na Segunda Guerra Mundial (FEB)', tag: 'ESA' },
          { text: 'República Populista: Governo Dutra', tag: 'ESA' },
          { text: 'República Populista: Segundo Governo Vargas e Governo JK', tag: 'ESA' },
          { text: 'República Populista: Governos Jânio Quadros e João Goulart', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 5: Regime Militar e Nova República',
        desc: 'De 1964 até os dias atuais.',
        topics: [
          { text: 'Regime Militar: Governos Castello Branco, Costa e Silva, Médici', tag: 'ESA' },
          { text: 'Regime Militar: Governos Geisel, Figueiredo e Abertura', tag: 'ESA' },
          { text: 'Nova República: Governo Sarney e Constituição de 1988', tag: 'ESA' },
          { text: 'Crises econômicas e Planos Econômicos (Cruzado, Collor, Real)', tag: 'ESA' },
          { text: 'Governos Recentes (Collor, Itamar, FHC e posteriores)', tag: 'ESA' },
        ]
      }
    ]
  },
  geografia: {
    id: 'geografia',
    icon: '🌍',
    title: 'Geografia do Brasil',
    description: 'Disciplina exclusiva do concurso da ESA. Aborda a compreensão do espaço natural, econômico, político e humano do território brasileiro.',
    modules: [
      {
        title: 'Módulo 1: O Espaço Natural Brasileiro',
        desc: 'Geografia física e meio ambiente.',
        topics: [
          { text: 'Posição Geográfica, Limites e Fusos Horários', tag: 'ESA' },
          { text: 'Estrutura Geológica e Geomorfologia (Relevo)', tag: 'ESA' },
          { text: 'Climas do Brasil e Fenômenos Climáticos', tag: 'ESA' },
          { text: 'Biomas, Domínios Morfoclimáticos e Tipos de Solos', tag: 'ESA' },
          { text: 'Recursos Hídricos (Bacias hidrográficas, Aquíferos)', tag: 'ESA' },
          { text: 'Recursos Minerais, Matriz Energética e Impactos Ambientais', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 2: O Espaço Econômico',
        desc: 'Dinâmica produtiva do país.',
        topics: [
          { text: 'Formação do território (Ciclos econômicos)', tag: 'ESA' },
          { text: 'Industrialização Brasileira e reestruturação produtiva', tag: 'ESA' },
          { text: 'Agricultura: Modernização, Agronegócio, Dinâmicas territoriais', tag: 'ESA' },
          { text: 'Comércio Exterior e Integração Regional (Mercosul)', tag: 'ESA' },
          { text: 'Eixos de circulação e Transportes', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 3: O Espaço Humano e Demografia',
        desc: 'A população brasileira.',
        topics: [
          { text: 'Demografia: Crescimento, transição demográfica, estrutura etária', tag: 'ESA' },
          { text: 'Mobilidade Espacial (Migrações internas e externas)', tag: 'ESA' },
          { text: 'Mercado de trabalho e Indicadores socioeconômicos', tag: 'ESA' },
          { text: 'Urbanização Brasileira (Rede urbana, Regiões Metropolitanas)', tag: 'ESA' },
          { text: 'Problemas urbanos e RIDE', tag: 'ESA' },
        ]
      },
      {
        title: 'Módulo 4: O Espaço Político',
        desc: 'Organização territorial do Estado.',
        topics: [
          { text: 'Formação territorial (Fronteiras, Mar territorial, ZEE)', tag: 'ESA' },
          { text: 'Estrutura Político-Administrativa', tag: 'ESA' },
          { text: 'Divisão Regional (IBGE) e Complexos Regionais', tag: 'ESA' },
          { text: 'Políticas Públicas Territoriais', tag: 'ESA' },
        ]
      }
    ]
  }
};
